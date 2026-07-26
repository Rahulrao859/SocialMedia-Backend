const mongoose = require('mongoose');

const waitForConnection = () => new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) {
        resolve(true);
        return;
    }

    const timeout = setTimeout(() => {
        cleanup();
        resolve(false);
    }, 10000);

    const onConnected = () => {
        cleanup();
        resolve(true);
    };

    const cleanup = () => {
        clearTimeout(timeout);
        mongoose.connection.off('connected', onConnected);
    };

    mongoose.connection.once('connected', onConnected);
});

const dbReady = async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        next();
        return;
    }

    if (mongoose.connection.readyState === 2 && await waitForConnection()) {
        next();
        return;
    }

    res.status(503).json({
        message: 'Database is not connected yet. Wait a moment and try again.',
    });
};

module.exports = dbReady;
