const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    const options = {
        expires: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        sameSite: "none",
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie("token", token, options).json({
        success: true,
        user,

        token,
    });
};

module.exports = sendToken;
