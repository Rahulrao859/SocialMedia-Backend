# Social Connect Backend

Node.js/Express backend for the Social Connect social media application.

## Features

- 🔐 JWT-based authentication
- 👤 User registration and login
- 📝 Post creation with text and/or images
- 💬 Comments on posts
- ❤️ Like/unlike posts
- 🗄️ MongoDB database
- 📁 Image upload with Multer
- 🔒 Protected routes with JWT middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- MongoDB installed and running locally

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

3. Start MongoDB:
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
```

4. Run the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### POST /api/auth/signup
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### POST /api/auth/login
Login existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

### Post Routes (Requires Authentication)

All post routes require JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### GET /api/posts
Get all posts (sorted by most recent)

**Response:**
```json
[
  {
    "_id": "post_id",
    "user": "user_id",
    "username": "johndoe",
    "text": "Hello world!",
    "image": "/uploads/image.jpg",
    "likes": [...],
    "comments": [...],
    "createdAt": "2026-02-05T..."
  }
]
```

#### POST /api/posts
Create a new post (multipart/form-data)
- `text` (optional): Post text content
- `image` (optional): Image file

**Note:** At least one of `text` or `image` is required

#### POST /api/posts/:id/like
Toggle like/unlike on a post

#### POST /api/posts/:id/comment
Add a comment to a post
```json
{
  "text": "Nice post!"
}
```

### Health Check

#### GET /api/health
Check server status

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   └── Post.js            # Post schema
├── routes/
│   ├── auth.js            # Authentication routes
│   └── posts.js           # Post routes
├── middleware/
│   ├── auth.js            # JWT verification
│   └── upload.js          # Multer configuration
├── uploads/               # Uploaded images
├── server.js              # Main server file
├── .env                   # Environment variables
└── package.json
```

## Database Schema

### User Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  username: String (required),
  createdAt: Date
}
```

### Post Collection
```javascript
{
  user: ObjectId (ref: User),
  username: String,
  text: String (optional),
  image: String (optional),
  likes: [{
    user: ObjectId,
    username: String
  }],
  comments: [{
    user: ObjectId,
    username: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## License

MIT
