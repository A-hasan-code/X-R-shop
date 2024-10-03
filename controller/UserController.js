const User = require('../models/user.models');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const crypto = require('crypto');
const path = require('path'); // Import path for handling file paths
const sendEmail = require('../utils/sendEmail');
// User registration
exports.register = catchAsyncError(async (req, res, next) => {
    const { username, password, email, phoneNumber, address } = req.body;

    // Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedPhoneNumber = phoneNumber ? phoneNumber.trim() : null;
    const avatarPath = req.file ? req.file.path : null;

    // Construct full URL for avatar if it exists
    const avatar = avatarPath ? `${req.protocol}://${req.get('host')}/${avatarPath}` : null;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    // Create the user
    const user = await User.create({
        username,
        email,
        password,
        phoneNumber,
        address,
        avatar,
    });

    // Send token and response
    sendToken(user, 201, res);
});

// User login
exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Use the sendToken utility function
    sendToken(user, 200, res);
});
exports.GetUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 404));
    }

    res.status(200).json({ success: true, user });
})
exports.updateinfo = catchAsyncError(async (req, res, next) => {
    const { username, phoneNumber } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 404));
    }

    user.username = username;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({ success: true, message: "User information updated successfully!" });
})
exports.getOneUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
})
exports.getUserAdmin = catchAsyncError(async (req, res, next) => {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });

    res.status(200).json({ success: true, users });
})
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new ErrorHandler("Email not found", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiration date on user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;

    // Email message
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
    Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        // Send the email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        // Handle the email sending error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return next(new ErrorHandler("Email could not be sent", 500));
    }
})
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token
    const user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: {
                [Op.gt]: Date.now(), // Token is still valid
            },
        },
    });

    if (!user) {
        return next(new ErrorHandler("Token is invalid or has expired", 400));
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Send success response
    res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
    });
});