const { Sequelize} = require('sequelize');

const Bills = require('./models/bills.js');
const Clients = require('./models/clients.js');
const GrossContracts = require('./models/grossContracts.js');
const Subcontracts = require('./models/subcontracts.js');
const ContractDrivers = require('./models/contractDrivers.js');
const Drivers = require('./models/drivers.js');
const GasStations = require('./models/gasStations.js');
const Products = require('./models/products.js');
const Roles = require('./models/roles.js');
const Users = require('./models/users.js');
const Transports = require('./models/transports.js');



// hàm tạo các quan hệ của bill và xuất bill
module.exports.bills = () => {
    Bills.belongsTo(Clients, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(Drivers, {
        foreignKey: { name: "driverID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(Transports, {
        foreignKey: { name: "plate"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(Subcontracts, {
        foreignKey: { name: "subcontractID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(GasStations, {
        foreignKey: { name: "gasStationID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Bills.belongsTo(Products, {
        foreignKey: { name: "productID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Bills;
}

// hàm tạo các quan hệ của client và xuất client
module.exports.clients = () => {
    Clients.hasMany(Bills, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Clients.belongsTo(Users, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Clients.hasMany(GrossContracts, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Clients.hasMany(Drivers, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Clients.hasMany(Transports, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    return Clients;
}

// hàm tạo các quan hệ của gross contract và xuất gross contract
module.exports.grossContracts = () => {
    GrossContracts.belongsTo(Clients, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    GrossContracts.hasMany(Subcontracts, {
        foreignKey: { name: "grossContractID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return GrossContracts;
}

// hàm tạo các quan hệ của subcontracts và xuất subcontracts
module.exports.subcontracts = () => {
    Subcontracts.hasMany(ContractDrivers, {
        foreignKey: { name: "subcontractID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Subcontracts.belongsTo(GrossContracts, {
        foreignKey: { name: "grossContractID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Subcontracts;
}

// hàm tạo các quan hệ của contract drivers và xuất contract drivers
module.exports.contractDrivers = () => {
    ContractDrivers.belongsTo(Drivers, {
        foreignKey: { name: "driverID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    ContractDrivers.belongsTo(Transports, {
        foreignKey: { name: "plate"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    ContractDrivers.belongsTo(Subcontracts, {
        foreignKey: { name: "subcontractID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return ContractDrivers;
}

// hàm tạo các quan hệ của driver và xuất driver
module.exports.drivers = () => {
    Drivers.belongsTo(Users, {
        foreignKey: { name: "driverID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Drivers.belongsTo(Clients, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Drivers.hasMany(ContractDrivers, {
        foreignKey: { name: "driverID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Drivers.hasMany(Bills, {
        foreignKey: { name: "driverID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Drivers;
}

// hàm tạo các quan hệ của gas station và xuất gas station
module.exports.gasStations = () => {
    GasStations.belongsTo(Users, {
        foreignKey: { name: "gasStationID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    GasStations.hasMany(Bills, {
        foreignKey: { name: "gasStationID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return GasStations;
}

// hàm tạo các quan hệ của user và xuất user
module.exports.users = () => {
    Users.belongsTo(Roles, {
        foreignKey: { name: "roleID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Clients, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(GasStations, {
        foreignKey: { name: "gasStationID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Users.hasOne(Drivers, {
        foreignKey: { name: "driverID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Users;
}

// hàm tạo các quan hệ của role và xuất role
module.exports.roles = () => {
    Roles.hasMany(Users, {
        foreignKey: { name: "roleID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Roles;
}

// hàm tạo các quan hệ của product và xuất product
module.exports.products = () => {
    Products.hasMany(Bills, {
        foreignKey: { name: "productID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    return Products;
}

// hàm tạo các quan hệ của transport và xuất transport
module.exports.transports = () => {
    Transports.hasMany(ContractDrivers, {
        foreignKey: { name: "plate"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Transports.hasMany(Bills, {
        foreignKey: { name: "plate"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Transports.belongsTo(Clients, {
        foreignKey: { name: "clientID"},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    return Transports;
}