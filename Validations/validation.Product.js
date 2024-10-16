const Joi = require('joi');

const productSchema = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    pricingType: Joi.string()
        .valid('one-time', 'recurring')
        .default('one-time')
        .optional(),
    originalPrice: Joi.any()
        .allow(null) // Allows null for original price
        .optional(), // Optional for all types
    // recurringPrice: Joi.any()
    //     .allow(null) // Allows null for recurring price
    //     .optional(), // Optional for all types
    recurringInterval: Joi.string()
        .valid('daily', 'weekly', 'monthly', 'yearly')
        .allow()
        .optional(),
    stock: Joi.number()
        .integer()
        .min(0)
        .default(0),
    brandName: Joi.string().required(),
    soldOut: Joi.boolean().default(false),
    images: Joi.array()
        .items(Joi.string().uri().required())
        .max(5)
        .optional(),
    categoryId: Joi.number()
        .integer()
        .required(),
    subcategoryId: Joi.number()
        .integer()
        .allow(),
    childCategoryId: Joi.number()
        .integer()
        .allow()
});

module.exports = productSchema;
