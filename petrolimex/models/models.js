const { Sequelize} = require('sequelize');

const Bills = require('./models/bills.js');
const Clients = require('./models/clients.js');
const Contracts = require('./models/contracts.js');
const DividedContracts = require('./models/dividedContracts.js');
const Drivers = require('./models/drivers.js');
const GasStations = require('./models/gasStations.js');
const Products = require('./models/products.js');
const Roles = require('./models/roles.js');
const Users = require('./models/users.js');



// hàm tạo các quan hệ của bill và xuất bill
module.exports.bills = () => {
    Bills.belongsTo(Drivers, {
        foreignKey: { name: "driverId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(Contracts, {
        foreignKey: { name: "contractId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(GasStations, {
        foreignKey: { name: "gasStationId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(Products, {
        foreignKey: { name: "productId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Bills;
}

// hàm tạo các quan hệ của client và xuất client
module.exports.clients = () => {
    Clients.belongsTo(Users, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Clients.hasMany(Contracts, {
        foreignKey: { name: "clientId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Clients.hasMany(Drivers, {
        foreignKey: { name: "clientId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Clients;
}

// hàm tạo các quan hệ của contract và xuất contract
module.exports.contracts = () => {
    Contracts.belongsTo(Clients, {
        foreignKey: { name: "clientId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Contracts.hasMany(DividedContracts, {
        foreignKey: { name: "contractId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Contracts.hasMany(Bills, {
        foreignKey: { name: "contractId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    // Contracts.belongsToMany(Drivers, {
    //     through: DividedContracts,
    //     foreignKey: { name: "contractId"},
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    // });
    return Contracts;
}

// hàm tạo các quan hệ của divided contracts và xuất divided contracts
module.exports.dividedContracts = () => {
    DividedContracts.belongsTo(Drivers, {
        foreignKey: { name: "driverId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    DividedContracts.belongsTo(Contracts, {
        foreignKey: { name: "contractId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return DividedContracts;
}

// hàm tạo các quan hệ của driver và xuất driver
module.exports.drivers = () => {
    Drivers.belongsTo(Users, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Drivers.belongsTo(Clients, {
        foreignKey: { name: "clientId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Drivers.hasMany(DividedContracts, {
        foreignKey: { name: "driverId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    // Drivers.belongsToMany(Contracts, {
    //     through: DividedContracts,
    //     foreignKey: { name: "driverId"},
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    // });
    Drivers.hasMany(Bills, {
        foreignKey: { name: "driverId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Drivers;
}

// hàm tạo các quan hệ của gas station và xuất gas station
module.exports.gasStations = () => {
    GasStations.belongsTo(Users, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    GasStations.hasMany(Bills, {
        foreignKey: { name: "gasStationId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return GasStations;
}

// hàm tạo các quan hệ của user và xuất user
module.exports.users = () => {
    Users.belongsTo(Roles, {
        foreignKey: { name: "roleId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Clients, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(GasStations, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Drivers, {
        foreignKey: { name: "userId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Users;
}

// hàm tạo các quan hệ của role và xuất role
module.exports.roles = () => {
    Roles.hasMany(Users, {
        foreignKey: { name: "roleId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Roles;
}

// hàm tạo các quan hệ của product và xuất product
module.exports.products = () => {
    Products.hasMany(Bills, {
        foreignKey: { name: "productId"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Products;
}

