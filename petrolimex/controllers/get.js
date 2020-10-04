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

// hàm lấy bill
module.exports.getBills = (billId_ = '', driverId_ = '', contractId_ = '', gasStationId_ = '', productId_ = '') => {
    let filter = {};
    if(billId_)
        filter.billId = billId_;
    if(driverId_)
        filter.driverId = driverId_;
    if(contractId_)
        filter.contractId = contractId_;
    if(gasStationId_)
        filter.gasStationId = gasStationId_;
    if(productId_)
        filter.productId = productId_;
    return bills.findAll({
        where: filter,
        include: [{model: drivers, attributes: ['name']},
            {model: contracts, attributes: ['name']},
            {model: gasStations, attributes: ['name']},
            {model: products, attributes: ['name']}]
    }).then(bills => JSON.parse(JSON.stringify(bills)));
}

// hàm lấy client
module.exports.getClients = (clientId_ = '', userId_ = '', code_ = '', taxId_ = '') => {
    let filter = {};
    if(clientId_)
        filter.clientId = clientId_;
    if(code_)
        filter.code = code_;
    if(taxId_)
        filter.taxId = taxId_;
    if(userId_)
        filter.userId = userId_;
    return clients.findAll({
        where: filter
    }).then(clients => JSON.parse(JSON.stringify(clients)));
}

// hàm lấy contract
module.exports.getContracts = (contractId_ = '', clientId_ = '', code_ = '') => {
    let filter = {};
    if(contractId_)
        filter.contractId = contractId_;
    if(clientId_)
        filter.clientId = clientId_;
    if(code_)
        filter.code = code_;
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

// hàm lấy  divided contract
module.exports.getDividedContracts = (dividedContractId_ = '', driverId_ = '', contractId_ = '', code_ = '') => {
    let filter = {};
    if(dividedContractId_)
        filter.dividedContractId = dividedContractId_;
    if(driverId_)
        filter.driverId = driverId_;
    if(contractId_)
        filter.contractId = contractId_;
    if(code_)
        filter.code = code_;
    return dividedContracts.findAll({
        where: filter,
        include: [{model: contracts, attributes: ['name']},
                {model: drivers, attributes: ['name']},]
    }).then(dividedContracts => JSON.parse(JSON.stringify(dividedContracts)));
}

// hàm lấy driver
module.exports.getDrivers = (driverId_ = '', clientId_ = '', userId_ = '', code_ = '', resIdentId_ = '') => {
    let filter = {};
    if(driverId_)
        filter.driverId = driverId_;
    if(clientId_)
        filter.clientId = clientId_;
    if(userId_)
        filter.userId = userId_;
    if(code_)
        filter.code = code_;
    if(resIdentId_)
        filter.resIdentId = resIdentId_;
    return drivers.findAll({
        where: filter,
        include: [{model: clients, attributes: ['name']}]
    }).then(drivers => JSON.parse(JSON.stringify(drivers)));
}

// hàm lấy gas station
module.exports.getGasStations = (gasStationId_ = '', userId_ = '', code_ = '') => {
    let filter = {};
    if(gasStationId_)
        filter.gasStationId = gasStationId_;
    if(userId_)
        filter.userId = userId_;
    if(code_)
        filter.code = code_;
    return gasStations.findAll({
        where: filter
    }).then(gasStations => JSON.parse(JSON.stringify(gasStations)));
}

// hàm lấy product
module.exports.getProducts = (productId_ = '', code_ = '') => {
    let filter = {};
    if(productId_)
        filter.productId = productId_;
    if(code_)
        filter.code = code_;
    return products.findAll({
        where: filter
    }).then(products => JSON.parse(JSON.stringify(products)));
}

// hàm lấy role
module.exports.getRoles = (roleId_ = '') => {
    let filter = {};
    if(roleId_)
        filter.roleId = roleId_;
    return roles.findAll({
        where: filter
    }).then(roles => JSON.parse(JSON.stringify(roles)));
}

// hàm lấy user
module.exports.getUsers = (userId_ = '', roleId_ = '') => {
    let filter = {};
    if(userId_)
        filter.userId = userId_;
    if(roleId_)
        filter.roleId = roleId_;
    return users.findAll({
        where: filter,
        include: [{model: roles, attributes: ['permission']}]
    }).then(users => JSON.parse(JSON.stringify(users)));
}

// lấy thông tin driver, transaction, contractDriver, subcontract có driverId, plateId mong muốn
module.exports.getToCreateTransaction = async (driverId_ = '') => {
    let filter = {};
    if(driverId_)
        filter.driverId = driverId_;
    return drivers.findOne({
        where: filter,
        include: [{model: dividedContracts, include: contracts}]
    }).then(driver => JSON.parse(JSON.stringify(driver)));
}


module.exports.getToCreateContract = () => {
    return clients.findAll({
        attributes: {
            include: [
                [sequelize.literal('`max_payment_limit` - (SELECT SUM(`debtCeiling`) FROM `contracts` WHERE `clientId` = `clients`.`clientId`)'), 'debtCeiling_remain']
            ]
        }
    }).then(clients => JSON.parse(JSON.stringify(clients)))
    .then(clients => clients.map(client => {
        client.debtCeiling_remain = stringToNumber(client.debtCeiling_remain, client.debtCeiling);
        return client;
    }));
}


module.exports.getClients_Contracts = (clientId_ = '') => {
    let fliter = {};
    if(clientId_)
        fliter.clientId = clientId_;
    return clients.findAll({
        where: fliter,
        include: contracts
    }).then(list => JSON.parse(JSON.stringify(list)));
}


module.exports.getToCreateDividedContract = async (clientId_, contractId_) => {
    let result = {}

    if(clientId_) {
        result.drivers = await drivers.findAll({
            where: {
                clientId: clientId_
            }
        }).then(drivers => JSON.parse(JSON.stringify(drivers)));
    }
        
    if(contractId_) {
        result.contract = await contracts.findOne({
            where: {
                contractId: contractId_
            },
            attributes: {
                include: [
                    [sequelize.literal('`contracts`.`debtCeiling` - (SELECT SUM(`creditLimit`) FROM `divided_contracts` WHERE `contractId` = `contracts`.`contractId`)'), 'debtCeiling_remain']
                ]
            },
            include: [{model: dividedContracts, include: drivers}, {model: clients, attributes: ['name']}]
        }).then(contract => JSON.parse(JSON.stringify(contract)))
        .then(contract => {
            contract.debtCeiling_remain = stringToNumber(contract.debtCeiling_remain, contract.debtCeiling);
            return contract;
        });
    }
    

    return result;
}

//  async function print() {
//      console.log(await getTransaction('11','75A-145.19'));
//  }

//  print();