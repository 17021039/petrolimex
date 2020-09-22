const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');

const Products = sequelize.define('products', {
    // Model attributes are defined here
    productID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    }
  }, {
    // Other model options go here
    tableName: 'products',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });


module.exports = Products;

