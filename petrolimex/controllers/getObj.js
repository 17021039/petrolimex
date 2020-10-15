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

function stringToNumber(str,num = 0) {
    if(str)
        return parseInt(str);
    else
        return num;
}

//  =========================================================
// hàm lấy bill
module.exports.getBills =  (filter = {} ) => {
    if(Object.keys(filter)[0] !== 'clientId') {
        return bills.findAll({
            where: filter,
            include: [{model: drivers, attributes: ['name']},
                {model: contracts, attributes: ['name']},
                {model: gasStations, attributes: ['name']},
                {model: products, attributes: ['name']}]
        }).then(bills => JSON.parse(JSON.stringify(bills)));
    } else {
        return clients.findOne({
            where: filter,
            include: [{model: contracts, include: [{model: bills, include: [{model: drivers, attributes: ['name']},
                                                                            {model: contracts, attributes: ['name']},
                                                                            {model: gasStations, attributes: ['name']},
                                                                            {model: products, attributes: ['name']}
                                                                        ]}
                                                ]}
                    ]
        }).then(client => JSON.parse(JSON.stringify(client)))
        .then(client => client.contracts.reduce(function(bills, element) {
            return bills.concat(element.bills);
        }, []));
    }
    
}

//  =========================================================
// hàm lấy client
module.exports.getClients = (filter = {}) => {
    return clients.findAll({
        where: filter
    }).then(clients => JSON.parse(JSON.stringify(clients)));
}

//  =========================================================
// hàm lấy contract
module.exports.getContracts = (filter = {}) => {
    switch(Object.keys(filter)[0]) {
        case 'driverId':
            return drivers.findOne({
                where: filter,
                include: [{model: dividedContracts, include: [{model: contracts, include: [{model: clients, attributes: ['name']} ]}]}]
            }).then(driver => JSON.parse(JSON.stringify(driver)))
            .then(driver => driver.dividedContracts.map(element => element.contract));
        default:
            return contracts.findAll({
                where: filter,
                attributes: {
                    include: [
                    [sequelize.literal('`debtCeiling` - (SELECT sum(`creditLimit` - `creditRemain`) FROM `divided_contracts` WHERE `contractId` = `contracts`.`contractId`)'), 'creditRemain']
                      ]
                },
                include: [{model: clients, attributes: ['name']}]
            }).then(contracts => JSON.parse(JSON.stringify(contracts)).map(obj => {
                obj.creditRemain = stringToNumber(obj.creditRemain, obj.debtCeiling);
                return obj;
            }));
    }
    
}

//  =========================================================
// hàm lấy  divided contract
module.exports.getDividedContracts = (filter = {}) => {
    switch(Object.keys(filter)[0]) {
        case 'clientId':
            return clients.findOne({
                where: filter,
                include: [{model: contracts, include: [{model: dividedContracts, include: {model: drivers, attributes: ['name']}}]}]
            }).then(client => JSON.parse(JSON.stringify(client)))
            .then(client => client.contracts.reduce((arr, element) => {
                element.dividedContracts = element.dividedContracts.map(element_ => {
                    element_.contract = {name: element.name};
                    return element_;
                })
                return arr.concat(element.dividedContracts);
            }, []));
        default:
            return dividedContracts.findAll({
                where: filter,
                include: [{model: contracts, attributes: ['name']},
                        {model: drivers, attributes: ['name']}]
            }).then(dividedContracts => JSON.parse(JSON.stringify(dividedContracts)));
    }
    
}

//  =========================================================
// hàm lấy driver
module.exports.getDrivers = (filter = {}) => {
    return drivers.findAll({
        where: filter,
        include: [{model: clients, attributes: ['name']}]
    }).then(drivers => JSON.parse(JSON.stringify(drivers)));
}

//  =========================================================
// hàm lấy gas station
module.exports.getGasStations = (filter = {}) => {
    return gasStations.findAll({
        where: filter
    }).then(gasStations => JSON.parse(JSON.stringify(gasStations)));
}

//  =========================================================
// hàm lấy product
module.exports.getProducts = (filter = {}) => {
    return products.findAll({
        where: filter
    }).then(products => JSON.parse(JSON.stringify(products)));
}

//  =========================================================
// hàm lấy role
module.exports.getRoles = (filter = {}) => {
    return roles.findAll({
        where: filter
    }).then(roles => JSON.parse(JSON.stringify(roles)));
}

//  =========================================================
// hàm lấy user
module.exports.getUsers = (filter = {}) => {
    return users.findAll({
        where: filter,
        include: [{model: roles, attributes: ['permission']}]
    }).then(users => JSON.parse(JSON.stringify(users)));
}