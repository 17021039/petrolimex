const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const contracts = sequelize.define('contracts', {
    // Model attributes are defined here
    contractID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    clientID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'clientID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
  }, {
    // Other model options go here
    tableName: 'contracts',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = contracts;

module.exports.created = (contractID_, clientID_, startDate_, endDate_, status_) => {
    contracts.create({
        contractID: contractID_,
        clientID: clientID_,
        startDate: startDate_,
        endDate: endDate_,
        status: status_
    });
}