const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const gasStations = sequelize.define('gasStations', {
    // Model attributes are defined here
    gasStationID: {
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

module.exports = gasStations;

module.exports.created = (gasStationID_, name_, address_, location_, workingTime_) => {
    gasStations.create({
        gasStationID: gasStationID_,
        name: name_,
        address: address_,
        location: location_,
        workingTime: workingTime_
    });
}