const Joi = require('joi');

// Validation for Category
const categoryValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name cannot be empty.',
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name must be less than or equal to 50 characters long.',
            'any.required': 'Name is required.'
        }),
});

// Validation for Subcategory
const subcategoryValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name cannot be empty.',
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name must be less than or equal to 50 characters long.',
            'any.required': 'Name is required.'
        }),
    categoryId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Category ID must be a number.',
            'number.integer': 'Category ID must be an integer.',
            'number.positive': 'Category ID must be a positive number.',
            'any.required': 'Category ID is required.'
        }),
});

// Validation for ChildCategory
const childCategoryValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name cannot be empty.',
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name must be less than or equal to 50 characters long.',
            'any.required': 'Name is required.'
        }),
    subcategoryId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Subcategory ID must be a number.',
            'number.integer': 'Subcategory ID must be an integer.',
            'number.positive': 'Subcategory ID must be a positive number.',
            'any.required': 'Subcategory ID is required.'
        }),
});

module.exports = {
    categoryValidation,
    subcategoryValidation,
    childCategoryValidation,
};
