const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../connect/connection.js');
const { sync } = require('../../connect/connection.js');
// database connect
require('../../connect/connection.js');


const Users = sequelize.define('users', {
    // Model attributes are defined here
    userID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleID: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'users',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = Users;
