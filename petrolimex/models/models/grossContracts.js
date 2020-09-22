const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');

const GrossContracts = sequelize.define('grossContracts', {
    // Model attributes are defined here
    grossContractID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    clientID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    signedDate: {
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
  }, {
    // Other model options go here
    tableName: 'gross_contracts',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });



module.exports = GrossContracts;