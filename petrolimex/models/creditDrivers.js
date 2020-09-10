const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const creditDrivers = sequelize.define('creditDrivers', {
    // Model attributes are defined here
    driverID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'drivers',
            key: 'driverID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    contractID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'contracts',
            key: 'contractID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    tableName: 'credit_drivers',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = creditDrivers;

module.exports.created = (driverID_, contractID_, creditLimit_, creditRemain_) => {
    creditDrivers.create({
        driverID: driverID_,
        contractID: contractID_,
        creditLimit: creditLimit_,
        creditRemain: creditRemain_
    });
}