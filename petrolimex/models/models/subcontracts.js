const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');


const Subcontracts = sequelize.define('subcontracts', {
    // Model attributes are defined here
    subcontractID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    grossContractID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    expiredDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    debtCeiling: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    creditRemain: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
  }, {
    // Other model options go here
    tableName: 'subcontracts',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = Subcontracts;
