// validations/orderValidation.js
const Joi = require('joi');

const orderSchema = Joi.object({
    cart: Joi.array().items(
        Joi.object()
    ).required(),
    shippingAddress: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        zip: Joi.string(),
        country: Joi.string(),

    }).required(),
    user: Joi.object().required(),
    totalPrice: Joi.number().precision(2).positive().required(),
    paymentInfo: Joi.object().required(),
    status: Joi.string()
});

const updateOrderSchema = Joi.object()

module.exports = { orderSchema, updateOrderSchema };
