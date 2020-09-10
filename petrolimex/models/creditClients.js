const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const creditClients = sequelize.define('creditClients', {
    // Model attributes are defined here
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
    debtCeiling: {
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
    tableName: 'credit_clients',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = creditClients;

module.exports.created = (clientID_, contractID_, debtCeiling_, creditRemain_) => {
    creditClients.create({
        clientID: clientID_,
        contractID: contractID_,
        debtCeiling: debtCeiling_,
        creditRemain: creditRemain_
    });
}