const express = require('express');
const { register, login, GetUser, updateinfo, getUserAdmin, forgetPassword, resetPassword, logout, updateUserRole } = require("../controller/UserController");
const router = express.Router();
const upload = require('../middleware/upload'); // Ensure this path is correct
const { isAuthenticated, isAdmin } = require('../middleware/auth'); // Middleware for authentication

// User registration
router.post('/register', upload.single('avatar'), register);

// User login
router.post('/login', login);

// Get logged-in user information
router.get('/me', isAuthenticated, GetUser);
router.put('/update-user-info', isAuthenticated, upload.single('avatar'), updateinfo);
router.get('/admin/users', isAuthenticated, isAdmin('admin'), getUserAdmin);
router.put('/admin/user-role/:id', isAuthenticated, isAdmin('admin'), updateUserRole);
router.post('/forgot-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/logout', logout);
module.exports = router;
