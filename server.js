require('dotenv').config();
const express = require('express');
const { connectDatabase, db } = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error');
const userRoutes = require('./Routes/User.Routes');
const categoryRoutes = require('./Routes/Category.Routes');
const ProductRoutes = require('./Routes/Product.Routes')
const orderRoutes = require('./Routes/order.Routes')
const Stripe = require('./controller/checkout.controller')
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(bodyParser.json());
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log('Incoming request:', req.body);
    next();
});
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/v1', Stripe)
app.use('/api/v1', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', ProductRoutes)
app.use('/api/v1', orderRoutes)
// Connect to the database and sync models
connectDatabase()
    .then(() => {
        // Sync the model with the database
        return db.sync();
    })
    .then(() => {
        console.log('User model was synchronized successfully.');
    })
    .catch(err => {
        console.error('Error synchronizing the model:', err);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
