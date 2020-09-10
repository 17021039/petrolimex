const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const users = sequelize.define('users', {
    // Model attributes are defined here
    userID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'roleID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    // Other model options go here
    tableName: 'users',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = users;

module.exports.created = (userID_, username_, password_, roleID_) => {
  users.create({
    userID: userID_,
    username: username_,
    password: password_,
    roleID: roleID_
  });
}