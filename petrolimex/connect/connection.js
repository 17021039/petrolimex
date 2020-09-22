const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('petrolimex_temp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_unicode_520_ci'
    }
});

module.exports = sequelize;
global.sequelize = sequelize;