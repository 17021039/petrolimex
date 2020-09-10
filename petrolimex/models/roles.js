const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const roles = sequelize.define('roles', {
    // Model attributes are defined here
    roleID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    permission: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'roles',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = roles;

module.exports.created = (roleID_, permission_) => {
  roles.create({
    roleID: roleID_,
    permission: permission_
  });
}