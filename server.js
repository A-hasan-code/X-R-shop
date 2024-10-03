require('dotenv').config();
const express = require('express');
const { connectDatabase, sequelize } = require('./config/db'); // Ensure sequelize is imported
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error');
const userRoutes = require('./Routes/User.Routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Your frontend URL
    credentials: true,
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/api', userRoutes);

// Connect to the database and sync models
const startServer = async () => {
    try {
        await connectDatabase(); // Connect to the database
        await sequelize.sync({ alter: true }); // Sync models with the database, use force: true in development
        console.log('Database & tables created!');

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();
