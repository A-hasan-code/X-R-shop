const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 30], // Minimum length of 3, maximum of 30
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensure the email is valid
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100], // Minimum length of 6
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9]+$/, // Only allow digits
                msg: 'Phone number can only contain digits.',
            },
            len: {
                args: [10, 15], // Length between 10 and 15 digits
                msg: 'Phone number must be between 10 and 15 digits long.',
            },
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'), // Possible roles
        defaultValue: 'user', // Default role
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Hash password before saving the user
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

// Method to compare passwords
User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate JWT token
User.prototype.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: '90d', // Token expires in 90 days
    });
};

module.exports = User;
