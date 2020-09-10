const { Sequelize, DataTypes} = require('sequelize');
const { sync } = require('../connect/connection.js');
// database connect
require('../connect/connection.js');

const drivers = sequelize.define('drivers', {
    // Model attributes are defined here
    driverID: {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    residentID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    // Other model options go here
    tableName: 'drivers',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_520_ci',
  });

module.exports = drivers;

// tạo drivers
module.exports.created = (driverID_, clientID_, name_, residentID_, avatar_, phone_, address_, plate_, status_) => {
    drivers.create({
        driverID: driverID_,
        clientID: clientID_,
        name: name_,
        residentID: residentID_,
        avatar: avatar_,
        phone: phone_,
        address: address_,
        plate: plate_,
        status: status_
    });
}


// this.created('2','1','5','Nguyễn Văn B','avatar','0333452356',100000000,75486987,'29C-888.88')
// (1,1,4,'Nguyễn Văn A','avatar','0324532567','gmail@gmail.com','address','75A-145.19')