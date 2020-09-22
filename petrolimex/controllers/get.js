const { Sequelize, Op} = require('sequelize');
const { model } = require('../connect/connection.js');
const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
const { transport } = require('../models/object.js');
const bills = models.bills();
const clients = models.clients();
const grossContracts = models.grossContracts();
const subcontracts = models.subcontracts();
const contractDrivers = models.contractDrivers();
const drivers = models.drivers();
const gasStations = models.gasStations();
const products = models.products();
const roles = models.roles();
const users = models.users();
const transports = models.transports();

function stringToNumber(str,num = 0) {
    if(str)
        return parseInt(str);
    else
        return num;
}

// hàm lấy bill
module.exports.getBills = (billID_, driverID_, clientID_, plate_, subcontractID_, gasStationID_, productID_) => {
    let filter = {};
    if(billID_)
        filter.billID = billID_;
    if(driverID_)
        filter.driverID = driverID_;
    if(clientID_)
        filter.clientID = clientID_;
    if(plate_)
        filter.plate = plate_;
    if(subcontractID_)
        filter.subcontractID = subcontractID_;
    if(gasStationID_)
        filter.gasStationID = gasStationID_;
    if(productID_)
        filter.productID = productID_;
    return bills.findAll({
        where: filter,
        include: [{model: drivers, attributes: ['name']},
            {model: clients, attributes: ['name']},
            {model: subcontracts, attributes: ['name']},
            {model: gasStations, attributes: ['name']},
            {model: products, attributes: ['name']}]
    }).then(bills => JSON.parse(JSON.stringify(bills)));
}

// hàm lấy client
module.exports.getClients = (clientID_, taxID_ = '') => {
    let filter = {};
    if(clientID_)
        filter.clientID = clientID_;
    if(taxID_)
        filter.taxID = taxID_;
    return clients.findAll({
        where: filter
    }).then(clients => JSON.parse(JSON.stringify(clients)));
}

// hàm lấy gross contract
module.exports.getGrossContracts = (grossContractID_, clientID_) => {
    let filter = {};
    if(grossContractID_)
        filter.grossContractID = grossContractID_;
    if(clientID_)
        filter.clientID = clientID_;
    return grossContracts.findAll({
        where: filter,
        attributes: {
            include: [
            [sequelize.literal('`grossContracts`.`debtCeiling` - (select sum(`debtCeiling` - `creditRemain`) from `subcontracts` where `grossContracts`.`grossContractID` = `subcontracts`.`grossContractID`)'), 'creditRemain']
              ]
        },
        include: [{model: clients, attributes: ['name']}]
    }).then(grossContracts => JSON.parse(JSON.stringify(grossContracts)).map(obj => {
        obj.creditRemain = stringToNumber(obj.creditRemain, obj.debtCeiling);
        return obj;
    }));
}

// hàm lấy subcontract
module.exports.getSubcontracts = (subcontractID_, grossContractID_) => {
    let filter = {};
    if(grossContractID_)
        filter.grossContractID = grossContractID_;
    if(subcontractID_)
        filter.subcontractID = subcontractID_;
    return subcontracts.findAll({
        where: filter,
        include: [{model: grossContracts, attributes: ['name']}]
    }).then(subcontracts => JSON.parse(JSON.stringify(subcontracts)));
}


// hàm lấy  contract driver
module.exports.getContractDrivers = (driverID_, plate_, subcontractID_) => {
    let filter = {};
    if(driverID_)
        filter.driverID = driverID_;
    if(subcontractID_)
        filter.contractID = subcontractID_;
    if(plate_)
        filter.plate = plate_;
    return contractDrivers.findAll({
        where: filter,
        include: [{model: subcontracts, attributes: ['name']},
                {model: drivers, attributes: ['name']},]
    }).then(contractDrivers => JSON.parse(JSON.stringify(contractDrivers)));
}

// hàm lấy driver
module.exports.getDrivers = (driverID_, clientID_) => {
    let filter = {};
    if(driverID_)
        filter.driverID = driverID_;
    if(clientID_)
        filter.clientID = clientID_;
    return drivers.findAll({
        where: filter,
        include: [{model: clients, attributes: ['name']}]
    }).then(drivers => JSON.parse(JSON.stringify(drivers)));
}

// hàm lấy gas station
module.exports.getGasStations = (gasStationID_ = '') => {
    let filter = {};
    if(gasStationID_)
        filter.gasStationID = gasStationID_;
    return gasStations.findAll({
        where: filter
    }).then(gasStations => JSON.parse(JSON.stringify(gasStations)));
}

// hàm lấy product
module.exports.getProducts = (productID_ = '') => {
    let filter = {};
    if(productID_)
        filter.productID = productID_;
    return products.findAll({
        where: filter
    }).then(products => JSON.parse(JSON.stringify(products)));
}

// hàm lấy role
module.exports.getRoles = (roleID_) => {
    let filter = {};
    if(roleID_)
        filter.roleID = roleID_;
    return roles.findAll({
        where: filter
    }).then(roles => JSON.parse(JSON.stringify(roles)));
}

// hàm lấy user
module.exports.getUsers = (userID_, roleID_) => {
    let filter = {};
    if(userID_)
        filter.userID = userID_;
    if(roleID_)
        filter.roleID = roleID_;
    return users.findAll({
        where: filter,
        include: [{model: roles, attributes: ['permission']}]
    }).then(users => JSON.parse(JSON.stringify(users)));
}

// lấy transport
module.exports.getTransports = (plate_ = '') => {
    let filter = {};
    if(plate_)
        filter.plate = plate_;
    return transports.findAll({
        where: filter,
        include: [{model: clients, attributes: ['name']}]
    }).then(transports => JSON.parse(JSON.stringify(transports)));
}

// lấy thông tin driver, transaction, contractDriver, subcontract có driverID, plateID mong muốn
module.exports.getToCreateTransaction = async (driverID_, plate_) => {
    let result = {};
    if(driverID_)
        result.driver = await drivers.findOne({
            where: {
                driverID: driverID_
            }
        }).then(driver => JSON.parse(JSON.stringify(driver)));
    if(plate_)
        result.transport = await transports.findOne({
            where: {
                plate: plate_
            }
        }).then(transport => JSON.parse(JSON.stringify(transport)));
    if(result.driver && result.transport) {
        result.contractDrivers = await contractDrivers.findAll({
            where: {driverID: driverID_, plate: plate_},
            include: subcontracts
        }).then(transport => JSON.parse(JSON.stringify(transport)));
        return result;
    } else
        return {};
}


module.exports.getToCreateSubcontract = (clientID_ = '') => {
    let fliter = {};
    if(clientID_)
        fliter.clientID = clientID_;
    return clients.findAll({
        where: fliter,
        include: [{model: grossContracts,
                    attributes: {
                        include: [
                            [sequelize.literal('`grossContracts`.`debtCeiling` - (SELECT SUM(`debtCeiling`) FROM `subcontracts` as `sub` WHERE `sub`.`grossContractID` = `grossContracts`.`grossContractID`)'), 'debtCeiling_remain']
                        ]
                    },
                    include: subcontracts
                }]
    }).then(clients => JSON.parse(JSON.stringify(clients)))
    .then(clients => clients.map(  client => {
        client.grossContracts.map(grossContract => {
            grossContract.debtCeiling_remain = stringToNumber(grossContract.debtCeiling_remain, grossContract.debtCeiling);
            return grossContract;
        })
        return client;
    }));
}


module.exports.getToCreateGrossContracts = () => {
    return clients.findAll({
        attributes: {
            include: [
                [sequelize.literal('`clients`.`max_payment_limit` - (SELECT SUM(`gross_contracts`.`debtCeiling`) FROM `gross_contracts` WHERE `gross_contracts`.`clientID` = `clients`.`clientID`)'), 'debtCeiling_remain']
            ]
        },
        include: [{model: grossContracts}]
    }).then(clients => JSON.parse(JSON.stringify(clients)))
    .then(clients => clients.map(client => {
        client.debtCeiling_remain = stringToNumber(client.debtCeiling_remain, client.debtCeiling);
        return client;
    }) );;
}

module.exports.getFilterToCreateContractDrivers = (clientID_ = '') => {
    let filter = {};
    if(clientID_)
        filter.clientID = clientID_;
    return clients.findAll({
        where: filter,
        include: [{model: grossContracts, include: subcontracts}]
    }).then(clients  => JSON.parse(JSON.stringify(clients)));
}

module.exports.getListChooseToCreateContractDrivers = async (clientID_, subcontractID_) => {
    let result = {}
    result.drivers = await drivers.findAll({
        where: {
            clientID: clientID_
        }
    }).then(drivers => JSON.parse(JSON.stringify(drivers)));
    result.transports = await transports.findAll({
        where: {
            clientID: clientID_
        }
    }).then(transports => JSON.parse(JSON.stringify(transports)));;
    result.contractDrivers = await contractDrivers.findAll({
        where: {
            subcontractID: subcontractID_
        },
        include: [{model: drivers, attributes: ['driverID','name']},
            {model: transports, attributes: ['plate']}]
    }).then(contractDrivers => JSON.parse(JSON.stringify(contractDrivers)));;
    return result;
}

//  async function print() {
//      console.log(await getTransaction('11','75A-145.19'));
//  }

//  print();