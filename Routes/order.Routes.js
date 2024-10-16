const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllorders,
    getOrderById,
    updateOrder,
    deleteOrder,
    calculateTotalSales, getOrdersByUserId
} = require('../controller/order.Controller');

const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Order routes
router.post('/createOrder', isAuthenticated, createOrder);
router.get('/orders', isAuthenticated, getAllorders);
router.get('/orders/:id', isAuthenticated, getOrderById);
router.put('/orders/:id', isAuthenticated, isAdmin('admin'), updateOrder);
router.delete('/orders/:id', isAuthenticated, isAdmin('admin'), deleteOrder);
router.get('/sales', isAuthenticated, isAdmin('admin'), calculateTotalSales); // Admin-only sales report
router.get('/order/:userId', getOrdersByUserId);
module.exports = router;
