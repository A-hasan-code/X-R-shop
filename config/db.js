require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,

});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database.');
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        // Optionally rethrow the error if you want to handle it higher up
        throw error;
    }
};

module.exports = { sequelize, DataTypes, connectDatabase };
