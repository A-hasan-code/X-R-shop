const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const Order = require("../models/Order");
const { orderSchema } = require("../Validations/validation.order");

router.post("/create-checkout-session", async (req, res) => {
    const { error } = orderSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { cart, shippingAddress, user, totalPrice } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: "\"cart\" is required" });
    }

    // Prepare line items for Stripe
    const lineItems = cart.map(item => {
        const isRecurring = item.recurringInterval ? true : false;

        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.productName,
                    images: item.images ? [item.images] : [],
                },
                unit_amount: Math.round(parseFloat(item.originalPrice) * 100), // Convert to cents
                recurring: isRecurring ? {
                    interval: item.recurringInterval,
                } : undefined,
            },
            quantity: item.qnty,
        };
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cancel`,
        });

        const orderData = {
            cart,
            shippingAddress,
            user,
            totalPrice,
            sessionId: session.id,
            paymentInfo: { // Ensure this is included
                id: session.id,
                status: session.payment_status, // Check the status of the payment
            },
        };

        const newOrder = await Order.create(orderData); // Create the order in the database

        return res.json({ id: session.id, order: newOrder }); // Respond with session ID and new order
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
