const { Model, DataTypes } = require('sequelize');
const { db } = require('../config/db')
class Setting extends Model { }

Setting.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize: db,
    modelName: 'Setting',
    timestamps: true,
});

module.exports = Setting;