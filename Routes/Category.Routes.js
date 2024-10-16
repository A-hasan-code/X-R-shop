const express = require('express');
const router = express.Router();
const {
    categoryController,
    subcategoryController,
    childCategoryController,
} = require('../controller/Category.Controller'); // Ensure path is correct
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Category routes
router.post('/categories', isAuthenticated, isAdmin('admin'), categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', isAuthenticated, isAdmin('admin'), categoryController.updateCategory);
router.delete('/categories/:id', isAuthenticated, isAdmin('admin'), categoryController.deleteCategory);

// Subcategory routes
router.post('/subcategories', isAuthenticated, isAdmin('admin'), subcategoryController.createSubcategory);
router.get('/subcategories', subcategoryController.getAllSubcategories);
router.get('/subcategories/:categoryId', subcategoryController.getSubcategoryById);
router.put('/subcategories/:id', isAuthenticated, isAdmin('admin'), subcategoryController.updateSubcategory);
router.delete('/subcategories/:id', isAuthenticated, isAdmin('admin'), subcategoryController.deleteSubcategory);

// Child Category routes
router.post('/childcategories', isAuthenticated, isAdmin('admin'), childCategoryController.createChildCategory);
router.get('/childcategories', childCategoryController.getAllChildCategories);
router.get('/childcategories/:subcategoryId', childCategoryController.getChildCategoryById);
router.put('/childcategories/:id', isAuthenticated, isAdmin('admin'), childCategoryController.updateChildCategory);
router.delete('/childcategories/:id', isAuthenticated, isAdmin('admin'), childCategoryController.deleteChildCategory);

module.exports = router;
