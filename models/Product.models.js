const { Model, DataTypes } = require('sequelize');
const { db } = require('../config/db'); // Adjust the path as necessary

class Product extends Model {
    static associate(models) {
        // Define associations here

        // A product belongs to a category
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category', // Alias for easier querying
        });

        // A product belongs to a subcategory
        Product.belongsTo(models.SubCategory, {
            foreignKey: 'subcategoryId',
            as: 'subcategory', // Alias for easier querying
        });

        // A product belongs to a child category
        Product.belongsTo(models.ChildCategory, {
            foreignKey: 'childCategoryId',
            as: 'childCategory', // Alias for easier querying
        });
    }
}

Product.init({
    productName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    // recurringPrice: {
    //     type: DataTypes.DECIMAL(10, 2),
    //     allowNull: true,
    // },
    recurringInterval: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: true,
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    images: {
        type: DataTypes.JSON, // or DataTypes.ARRAY(DataTypes.STRING)
        allowNull: true,
    },
    brandName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    soldOut: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
    },
    pricingType: {
        type: DataTypes.ENUM('one-time', 'recurring'),
        allowNull: false,
        defaultValue: 'one-time',
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories', // Ensure this matches your category table name
            key: 'id',
        },
    },
    subcategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'SubCategories', // Ensure this matches your subcategory table name
            key: 'id',
        },
    },
    childCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'ChildCategories', // Ensure this matches your child category table name
            key: 'id',
        },
    },
}, {
    sequelize: db,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
});

// Hook to validate pricing logic before saving
// Product.beforeValidate((product) => {
//     if (product.pricingType === 'one-time' && product.originalPrice == null) {
//         throw new Error('originalPrice is required for one-time pricing.');
//     }

//     if (product.pricingType === 'recurring') {
//         product.originalPrice = null; // Ensure originalPrice is null for recurring
//     }
// });

// Export the model
module.exports = Product;
