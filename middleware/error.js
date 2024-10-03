const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Sequelize Error Handling
    switch (err.name) {
        case 'SequelizeUniqueConstraintError':
            err = new ErrorHandler("Duplicate entry error: " + err.errors[0].message, 400);
            break;
        case 'SequelizeValidationError':
            const messages = err.errors.map(e => e.message).join(', ');
            err = new ErrorHandler("Validation error: " + messages, 400);
            break;
        case 'SequelizeDatabaseError':
            err = new ErrorHandler("Database error: " + err.message, 400);
            break;
        case 'SequelizeForeignKeyConstraintError':
            err = new ErrorHandler("Foreign key constraint error: " + err.message, 400);
            break;
        case 'SequelizeConnectionError':
            err = new ErrorHandler("Database connection error: " + err.message, 503);
            break;
        // Other Sequelize errors...
        default:
            console.error(err); // Log the error for debugging
            break;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
