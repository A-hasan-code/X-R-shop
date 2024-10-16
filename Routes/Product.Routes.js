const express = require('express');
const router = express.Router();
const productController = require('../controller/Product.Controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Ensure your upload middleware is imported

// Route to create a product with image uploads
router.post('/products',
    isAuthenticated,
    isAdmin("admin"),
    upload.array('images', 5), // Allow up to 5 images
    productController.createProduct
);

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id',
    isAuthenticated,
    isAdmin("admin"),
    productController.updateProduct
);
router.delete('/products/:id',
    isAuthenticated,
    isAdmin("admin"),
    productController.deleteProduct
);

module.exports = router;
