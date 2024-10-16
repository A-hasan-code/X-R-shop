const Joi = require('joi');

// Joi schema for validating payment method credentials
const paymentMethodSchema = Joi.object({
    key: Joi.string().required().messages({
        'string.empty': 'Key is required',
        'any.required': 'Key is required',
    }),
    value: Joi.string().required().messages({
        'string.empty': 'Value is required',
        'any.required': 'Value is required',
    }),
});

module.exports = paymentMethodSchema