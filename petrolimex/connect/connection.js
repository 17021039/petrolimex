const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('petrolimex_temp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
global.sequelize = sequelize;