const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');

const GasStations = sequelize.define('gasStations', {
    // Model attributes are defined here
    gasStationID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    workingTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    // Other model options go here
    tableName: 'gas_stations',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });


module.exports = GasStations;
