const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const dbReady = require('../middleware/dbReady');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', dbReady, auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Most recent first
            .limit(100); // Limit to 100 posts

        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', dbReady, auth, upload.single('image'), async (req, res) => {
    try {
        const { text } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        // Validation: At least one of text or image required
        if (!text && !image) {
            return res.status(400).json({ message: 'Post must contain text or image' });
        }

        const post = new Post({
            user: req.user.id,
            username: req.user.username,
            text: text || undefined,
            image: image || undefined,
        });

        await post.save();

        res.status(201).json(post);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', dbReady, auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked the post
        const likeIndex = post.likes.findIndex(
            (like) => like.user.toString() === req.user.id
        );

        if (likeIndex > -1) {
            // Unlike: Remove the like
            post.likes.splice(likeIndex, 1);
        } else {
            // Like: Add the like
            post.likes.push({
                user: req.user.id,
                username: req.user.username,
            });
        }

        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Error liking post' });
    }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', dbReady, auth, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            user: req.user.id,
            username: req.user.username,
            text: text.trim(),
        });

        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Comment post error:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (only post owner)
router.delete('/:id', dbReady, auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the post owner
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

module.exports = router;
