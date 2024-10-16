const { Model, DataTypes } = require('sequelize');
const { db } = require('../config/db')
class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cart: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    user: {
        type: DataTypes.JSON,
        allowNull: false,
    }, totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }, status: {
        type: DataTypes.STRING,
        defaultValue: 'Processing',
    }, paymentInfo: {
        type: DataTypes.JSON,
    }, paidAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }, deliveredAt: {
        type: DataTypes.DATE,
    }, createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    sequelize: db,
    modelName: 'Order',
    timestamps: false,
})
module.exports = Order;