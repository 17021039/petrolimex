const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const bills = sequelize.define('bills', {
    // Model attributes are defined here
    billID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
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
    gasStationID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'gas_stations',
            key: 'gasStationID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    productID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'products',
            key: 'productID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

module.exports = bills;

module.exports.created = (billID_, driverID_, clientID_, gasStationID_, productID_, quantity_, total_, transactionDate_, status_) => {
    bills.create({
        billID: billID_,
        driverID: driverID_,
        clientID: clientID_,
        gasStationID: gasStationID_,
        productID: productID_,
        quantity: quantity_,
        total: total_,
        transactionDate: transactionDate_,
        status: status_
    });
}