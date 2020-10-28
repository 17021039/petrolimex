const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');

const Bills = sequelize.define('bills', {
    // Model attributes are defined here
    billId: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    driverId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    contractId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    gasStationId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    productId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    total: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
  }, {
    // Other model options go here
    tableName: 'bills',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });


module.exports = Bills;

