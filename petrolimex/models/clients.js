const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const clients = sequelize.define('clients', {
    // Model attributes are defined here
    clientID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    taxID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    max_payment_limit: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        defaultValue: 0
    }
  }, {
    // Other model options go here
    tableName: 'clients',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = clients;

// tạo clients
module.exports.created = (clientID_, name_, address_, taxID_, max_payment_limit_) => {
    clients.create({
        clientID: clientID_,
        name: name_,
        address: address_,
        taxID: taxID_,
        max_payment_limit: max_payment_limit_
    });
}