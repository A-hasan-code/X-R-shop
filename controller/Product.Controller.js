const productSchema = require('../Validations/validation.Product');
const Product = require('../models/Product.models');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');

// Create a new product
const createProduct = catchAsyncError(async (req, res, next) => {
    console.log('Incoming request body:', req.body); // Log the request body
    console.log('Uploaded files:', req.files); // Log the uploaded files

    await productSchema.validate(req.body); // Validate request body

    // Process uploaded files and store their paths
    if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => `/uploads/${file.filename}`); // Adjust path as needed
    }

    const product = await Product.create(req.body);
    return res.status(201).json({
        message: 'Product created successfully',
        product,
    });
});


// Get all products
const getAllProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.findAll();
    return res.status(200).json(products);
});

// Get a single product by ID
const getProductById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
});

// Update a product by ID
const updateProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    await productSchema.validateAsync(req.body);
    const [updated] = await Product.update(req.body, {
        where: { id },
    });

    if (!updated) {
        return next(new ErrorHandler({ message: 'Product not found' }, 404));
    }

    const updatedProduct = await Product.findByPk(id);
    return res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
    });
});

// Delete a product by ID
const deleteProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Product.destroy({ where: { id } });

    if (!deleted) {
        return next(new ErrorHandler({ message: 'Product not found' }, 404));
    }

    return res.status(204).send();
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
