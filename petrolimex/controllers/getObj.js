const { Sequelize, Op} = require('sequelize');
const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
const bills = models.bills();
const clients = models.clients();
const contracts = models.contracts();
const dividedContracts = models.dividedContracts();
const drivers = models.drivers();
const gasStations = models.gasStations();
const products = models.products();
const roles = models.roles();
const users = models.users();
const object = require('../models/object.js');

function stringToNumber(str,num = 0) {
    if(str)
        return parseInt(str);
    else
        return num;
}

//  =========================================================
// hàm lấy bill
module.exports.getBills =  (filter = {} ) => {
    if(object.containKeys('bill',Object.keys(filter),false,true) === false)
        return [];
    if(Object.keys(filter).indexOf('clientId') !== -1) {
        let clientId = filter.clientId;
        delete filter.clientId;
        return clients.findOne({
            where: {
                clientId: clientId
            },
            include: [{model: contracts, include: [{model: bills, where: filter,
                                                    include: [{model: drivers, attributes: ['name']},
                                                                {model: contracts, attributes: ['name']},
                                                                {model: gasStations, attributes: ['name']},
                                                                {model: products, attributes: ['name']}
                                                            ]}
                                                ]}
                    ]
        }).then(client => JSON.parse(JSON.stringify(client)))
        .then(client => client.contracts.reduce(function(bills, element) {
            return bills.concat(element.bills);
        }, [])).catch(() => []);
    }

    return bills.findAll({
        where: filter,
        include: [{model: drivers, attributes: ['name']},
            {model: contracts, attributes: ['name']},
            {model: gasStations, attributes: ['name']},
            {model: products, attributes: ['name']}]
    }).then(bills => JSON.parse(JSON.stringify(bills))).catch(() => []);
    
}

//  =========================================================
// hàm lấy client
module.exports.getClients = (filter = {}) => {
    if(object.containKeys('client',Object.keys(filter),false,true) === false)
        return [];
    return clients.findAll({
        where: filter,
        attributes: {
            include: [
                [sequelize.literal('`max_payment_limit` - (SELECT SUM(`debtCeiling`) FROM `contracts` WHERE `clientId` = `clients`.`clientId`)'), 'debtCeiling_remain']
            ]
        }
    }).then(clients => JSON.parse(JSON.stringify(clients)))
    .then(clients => clients.map(client => {
        client.debtCeiling_remain = stringToNumber(client.debtCeiling_remain);
        return client;
    })).catch(() => []);
}

//  =========================================================
// hàm lấy contract
module.exports.getContracts = (filter = {}) => {
    if(object.containKeys('contract',Object.keys(filter),false,true) === false)
        return [];
    if(Object.keys(filter).indexOf('driverId') !== -1) {
        let driverId = filter.driverId;
        delete filter.driverId;
        return drivers.findOne({
            where: {
                driverId: driverId
            },
            include: [{model: dividedContracts, include: [{model: contracts, where: filter, include: [{model: clients, attributes: ['name']} ]}]}]
        }).then(driver => JSON.parse(JSON.stringify(driver)))
        .then(driver => driver.dividedContracts.map(element => element.contract)).catch(() => []);
    }
    
    return contracts.findAll({
        where: filter,
        attributes: {
            include: [
            [sequelize.literal('`debtCeiling` - (SELECT sum(`creditLimit` - `creditRemain`) FROM `divided_contracts` WHERE `contractId` = `contracts`.`contractId`)'), 'creditRemain']
              ]
        },
        include: [{model: clients, attributes: ['name']}]
    }).then(contracts => JSON.parse(JSON.stringify(contracts)).map(obj => {
        obj.creditRemain = stringToNumber(obj.creditRemain);
        return obj;
    })).catch(() => []);
    
}

//  =========================================================
// hàm lấy  divided contract
module.exports.getDividedContracts = (filter = {}) => {
    if(object.containKeys('bill',Object.keys(filter),false,true) === false)
        return [];
    if(Object.keys(filter).indexOf('clientId') !== -1) {
        let clientId = filter.clientId;
        delete filter.clientId;
        return clients.findOne({
            where: {
                clientId: clientId
            },
            include: [{model: contracts, include: [{model: dividedContracts, where: filter, include: {model: drivers, attributes: ['name']}}]}]
        }).then(client => JSON.parse(JSON.stringify(client)))
        .then(client => client.contracts.reduce((arr, element) => {
            element.dividedContracts = element.dividedContracts.map(element_ => {
                element_.contract = {name: element.name};
                return element_;
            })
            return arr.concat(element.dividedContracts);
        }, [])).catch(() => []);
    }

    return dividedContracts.findAll({
        where: filter,
        include: [{model: contracts, attributes: ['name']},
                {model: drivers, attributes: ['name']}]
    }).then(dividedContracts => JSON.parse(JSON.stringify(dividedContracts))).catch(() => []);

    
}

//  =========================================================
// hàm lấy driver
module.exports.getDrivers = (filter = {}) => {
    if(object.containKeys('driver',Object.keys(filter),false,true) === false)
        return [];
    return drivers.findAll({
        where: filter,
        include: [{model: clients, attributes: ['name']}]
    }).then(drivers => JSON.parse(JSON.stringify(drivers))).catch(() => []);
}

//  =========================================================
// hàm lấy gas station
module.exports.getGasStations = (filter = {}) => {
    if(object.containKeys('gasStation',Object.keys(filter),false,true) === false)
        return [];
    return gasStations.findAll({
        where: filter
    }).then(gasStations => JSON.parse(JSON.stringify(gasStations))).catch(() => []);
}

//  =========================================================
// hàm lấy product
module.exports.getProducts = (filter = {}) => {
    if(object.containKeys('product',Object.keys(filter),false,true) === false)
        return [];
    return products.findAll({
        where: filter
    }).then(products => JSON.parse(JSON.stringify(products))).catch(() => []);
}

//  =========================================================
// hàm lấy role
module.exports.getRoles = (filter = {}) => {
    if(object.containKeys('role',Object.keys(filter),false,true) === false)
        return [];
    return roles.findAll({
        where: filter
    }).then(roles => JSON.parse(JSON.stringify(roles))).catch(() => []);
}

//  =========================================================
// hàm lấy user
module.exports.getUsers = (filter = {}) => {
    if(object.containKeys('user',Object.keys(filter),false,true) === false)
        return [];
    return users.findAll({
        where: filter,
        include: [{model: roles, attributes: ['permission']}]
    }).then(users => JSON.parse(JSON.stringify(users))).catch(() => []);
}