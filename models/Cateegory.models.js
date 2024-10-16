const { Model, DataTypes } = require('sequelize');
const { db } = require('../config/db');

// Category Model
class Category extends Model { }

Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: 'Category',
});

// SubCategory Model
class SubCategory extends Model { }

SubCategory.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize: db,
    modelName: 'SubCategory',
});

// ChildCategory Model
class ChildCategory extends Model { }

ChildCategory.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subcategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize: db,
    modelName: 'ChildCategory',
});

// Define Associations
Category.hasMany(SubCategory, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });

SubCategory.hasMany(ChildCategory, { foreignKey: 'subcategoryId', onDelete: 'CASCADE' });
ChildCategory.belongsTo(SubCategory, { foreignKey: 'subcategoryId' });

// Export Models
module.exports = { Category, SubCategory, ChildCategory };
