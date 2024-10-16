const { Category, SubCategory, ChildCategory } = require('../models/Cateegory.models');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const { categoryValidation, subcategoryValidation, childCategoryValidation } = require('../validations/validation.Category');

// Category Controller
const createCategory = catchAsyncError(async (req, res, next) => {
    const { error } = categoryValidation.validate(req.body);
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    const { name } = req.body;
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) return next(new ErrorHandler('Category already exists.', 400));

    const category = await Category.create(req.body);
    res.status(201).json(category);
});

// Get all categories
const getAllCategories = catchAsyncError(async (req, res) => {
    const categories = await Category.findAll();
    res.status(200).json(categories);
});

// Get category by ID
const getCategoryById = catchAsyncError(async (req, res, next) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return next(new ErrorHandler('Category not found', 404));
    res.status(200).json(category);
});

// Update category
const updateCategory = catchAsyncError(async (req, res, next) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return next(new ErrorHandler('Category not found', 404));

    await category.update(req.body);
    res.status(200).json(category);
});

// Delete category
const deleteCategory = catchAsyncError(async (req, res, next) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return next(new ErrorHandler('Category not found', 404));

    await SubCategory.destroy({ where: { categoryId: category.id } });
    await category.destroy();
    res.status(204).send();
});

// Subcategory Controller
const createSubcategory = catchAsyncError(async (req, res, next) => {
    const { error } = subcategoryValidation.validate(req.body);
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    const { name, categoryId } = req.body;
    const existingSubcategory = await SubCategory.findOne({ where: { name } });
    if (existingSubcategory) return next(new ErrorHandler('Subcategory already exists.', 400));

    const existingCategory = await Category.findByPk(categoryId);
    if (!existingCategory) return next(new ErrorHandler('Category does not exist.', 400));

    const subcategory = await SubCategory.create(req.body);
    res.status(201).json(subcategory);
});

// Get all subcategories
const getAllSubcategories = catchAsyncError(async (req, res) => {
    const subcategories = await SubCategory.findAll();
    res.status(200).json(subcategories);
});

// Get subcategories by categoryId
const getSubcategoriesByCategoryId = catchAsyncError(async (req, res, next) => {
    const subcategories = await SubCategory.findAll({ where: { categoryId: req.params.categoryId } });
    res.status(200).json(subcategories);
});

// Get subcategory by ID
const getSubcategoryById = catchAsyncError(async (req, res, next) => {
    const subcategory = await SubCategory.findByPk(req.params.id);
    if (!subcategory) return next(new ErrorHandler('Subcategory not found', 404));
    res.status(200).json(subcategory);
});

// Update subcategory
const updateSubcategory = catchAsyncError(async (req, res, next) => {
    const subcategory = await SubCategory.findByPk(req.params.id);
    if (!subcategory) return next(new ErrorHandler('Subcategory not found', 404));

    await subcategory.update(req.body);
    res.status(200).json(subcategory);
});

// Delete subcategory
const deleteSubcategory = catchAsyncError(async (req, res, next) => {
    const subcategory = await SubCategory.findByPk(req.params.id);
    if (!subcategory) return next(new ErrorHandler('Subcategory not found', 404));

    await ChildCategory.destroy({ where: { subcategoryId: subcategory.id } });
    await subcategory.destroy();
    res.status(204).send();
});

// ChildCategory Controller
const createChildCategory = catchAsyncError(async (req, res, next) => {
    const { error } = childCategoryValidation.validate(req.body);
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    const { name, subcategoryId } = req.body;
    // const existingChildCategory = await ChildCategory.findOne({ where: { subcategoryId } });
    // if (existingChildCategory) return next(new ErrorHandler('Child category already exists.', 400));

    const existingSubcategory = await SubCategory.findByPk(subcategoryId);
    if (!existingSubcategory) return next(new ErrorHandler('Subcategory does not exist.', 400));

    const childCategory = await ChildCategory.create(req.body);
    res.status(201).json(childCategory);
});

// Get all child categories
const getAllChildCategories = catchAsyncError(async (req, res) => {
    const childCategories = await ChildCategory.findAll();
    res.status(200).json(childCategories);
});

// Get child categories by subcategoryId
const getChildCategoriesBySubcategoryId = catchAsyncError(async (req, res, next) => {
    const childCategories = await ChildCategory.findAll({ where: { subcategoryId: req.params.subcategoryId } });
    res.status(200).json(childCategories);
});

// Get child category by ID
const getChildCategoryById = catchAsyncError(async (req, res, next) => {
    const childCategory = await ChildCategory.findByPk(req.params.id);
    if (!childCategory) return next(new ErrorHandler('Child category not found', 404));
    res.status(200).json(childCategory);
});

// Update child category
const updateChildCategory = catchAsyncError(async (req, res, next) => {
    const childCategory = await ChildCategory.findByPk(req.params.id);
    if (!childCategory) return next(new ErrorHandler('Child category not found', 404));

    await childCategory.update(req.body);
    res.status(200).json(childCategory);
});

// Delete child category
const deleteChildCategory = catchAsyncError(async (req, res, next) => {
    const childCategory = await ChildCategory.findByPk(req.params.id);
    if (!childCategory) return next(new ErrorHandler('Child category not found', 404));

    await childCategory.destroy();
    res.status(204).send();
});

module.exports = {
    categoryController: {
        createCategory,
        getAllCategories,
        getCategoryById,
        updateCategory,
        deleteCategory,
    },
    subcategoryController: {
        createSubcategory,
        getAllSubcategories,
        getSubcategoriesByCategoryId,
        getSubcategoryById,
        updateSubcategory,
        deleteSubcategory,
    },
    childCategoryController: {
        createChildCategory,
        getAllChildCategories,
        getChildCategoriesBySubcategoryId,
        getChildCategoryById,
        updateChildCategory,
        deleteChildCategory,
    },
};
