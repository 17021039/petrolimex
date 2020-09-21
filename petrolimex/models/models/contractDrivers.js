const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');


const ContractDrivers = sequelize.define('contractDrivers', {
    // Model attributes are defined here
    driverID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    plate: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    subcontractID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    creditLimit: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    creditRemain: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    }
  }, {
    // Other model options go here
    tableName: 'contract_drivers',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });


module.exports = ContractDrivers;

