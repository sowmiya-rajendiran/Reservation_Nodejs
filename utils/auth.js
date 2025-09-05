const jwt = require('jsonwebtoken');
const { SECRET_KEY, EXPIRES_IN } = require('./config');

// generate token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        SECRET_KEY,
        { expiresIn: EXPIRES_IN }
    );
};

// send token in JSON (not cookies)
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    // response → frontend saves this in localStorage
    res.status(statusCode).json({
        success: true,
        token,
        user
    });
};

module.exports = {
    generateToken,
    sendTokenResponse
};
