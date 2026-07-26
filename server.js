require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/social-media';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-only-social-media-secret';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Social Connect API - Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
};

startServer();

module.exports = app;
