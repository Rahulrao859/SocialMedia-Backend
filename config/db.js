const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.warn('MongoDB connection warning:', error.message);
        console.warn('Server will keep running. Start MongoDB to use auth and posts.');
        return false;
    }
};

module.exports = connectDB;
