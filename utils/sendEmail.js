const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use Gmail service
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    // Set up email options
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: options.email, // Recipient's email
        subject: options.subject, // Email subject
        text: options.message, // Email message
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to: ${options.email}`);
    } catch (error) {
        // Log the error and throw a new error
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;
