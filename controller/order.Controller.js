const Order = require('../models/Order')
const { orderSchema, updateOrderSchema } = require('../Validations/validation.order')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')

const createOrder = catchAsyncError(async (req, res, next) => {
    try {
        const { error } = orderSchema.validate(req.body)
        if (error) {
            return next(
                new ErrorHandler(error.details[0].message, 400)
            )
        }
        const newOrder = await Order.create(req.body)
        return res.status(201).json(newOrder)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})
const getAllorders = catchAsyncError(async (req, res, next) => {
    try {
        const orders = await Order.findAll()
        res.status(200).json(orders)
    } catch (error) {
        return next(new ErrorHandler({ error: error.message }, 500))
    }
})
const getOrderById = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        return next(new ErrorHandler({ error: error.message }, 500))
    }
})
const updateOrder = catchAsyncError(async (req, res) => {
    try {
        // Validate request body
        await updateOrderSchema.validateAsync(req.body);

        const { id } = req.params;
        const [updated] = await Order.update(req.body, {
            where: { id },
        });

        if (!updated) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const updatedOrder = await Order.findByPk(id);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(error.isJoi ? 400 : 500).json({ error: error.details ? error.details[0].message : error.message });
    }
})
const deleteOrder = catchAsyncError(async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Order.destroy({
            where: { id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
const getOrdersByUserId = catchAsyncError(async (req, res, next) => {
    try {
        const userId = req.params.userId; // Assuming userId is passed as a route parameter

        // Fetch all orders from the database
        const orders = await Order.findAll();

        // Filter orders based on user ID
        const filteredOrders = orders.filter(order => {
            try {
                const user = JSON.parse(order.user); // Parse the user field
                return user.id === parseInt(userId, 10); // Compare user IDs
            } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                return false; // Skip this order if parsing fails
            }
        });

        // Check if any orders were found for the user
        if (filteredOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Respond with the filtered orders
        res.status(200).json(filteredOrders);
    } catch (error) {
        console.error('Error fetching orders by user ID:', error); // Log the error for debugging
        return next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});


const calculateTotalSales = catchAsyncError(async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Expecting dates as query parameters

        const orders = await Order.findAll({
            where: {
                paymentInfo: {
                    method: {
                        [Op.ne]: 'COD', // Exclude COD payments
                    },
                },
                ...(startDate && endDate ? {
                    createdAt: {
                        [Op.gte]: new Date(startDate), // Start date
                        [Op.lte]: new Date(endDate),   // End date
                    },
                } : {}),
            },
        });

        const totalSales = orders.reduce((total, order) => total + order.totalPrice, 0);

        res.status(200).json({ totalSales });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = { createOrder, getAllorders, getOrderById, updateOrder, deleteOrder, calculateTotalSales, getOrdersByUserId }