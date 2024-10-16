const User = require('../models/user.models');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize'); // Import Op for query operations
const sendEmail = require('../utils/sendEmail');
const {
    userRegisterSchema,
    userLoginSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
} = require('../Validations/Validation.User');

// User registration
exports.register = catchAsyncError(async (req, res, next) => {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
        return next(new ErrorHandler(error.details[0].message, 400));
    }
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
// User login
exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Trim password to remove any whitespace
    const trimmedPassword = password.trim();
    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Use the sendToken utility function
    sendToken(user, 200, res);
});


// Get user information
exports.GetUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 404));
    }

    res.status(200).json({ success: true, user });
});

// Update user information
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
});

// Get one user by ID
exports.getOneUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
});

// Get all users for admin
exports.getUserAdmin = catchAsyncError(async (req, res, next) => {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });

    res.status(200).json({ success: true, users });
});

// Forget password
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
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    // Create reset URL
    const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;


    // Email message
    const message = `you recived reset password  ${resetUrl}`;

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
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token
    const user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: {
                [Op.gt]: Date.now(),
            },
        },
    });

    if (!user) {
        return next(new ErrorHandler("Token is invalid or has expired", 400));
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    console.log('Before saving user:', user); // Debug log

    // Save the user with the new password and cleared tokens
    try {
        await user.save();
        console.log('User saved successfully:', user); // Debug log
    } catch (error) {
        console.error('Error saving user:', error); // Debug log
        return next(new ErrorHandler("Error saving user", 500));
    }

    // Send success response
    res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
    });
});


// User logout
exports.logout = catchAsyncError(async (req, res, next) => {
    // Clear the cookie or token from the client side
    res.cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    -
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
});

// Update user role (Admin functionality)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const { role } = req.body; // Only get role from request body
    const userId = req.params.id; // Get userId from route parameters

    // Validate input
    if (!userId || !role) {
        return next(new ErrorHandler("Please provide user ID and role!", 400));
    }

    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update user role
    user.role = role; // Assuming 'role' is a field in your User model
    await user.save(); // Save the updated user

    res.status(200).json({
        success: true,
        message: "User role updated successfully!",
        user, // Return the updated user object
    });
});

