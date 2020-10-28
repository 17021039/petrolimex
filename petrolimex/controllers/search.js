const { resolve } = require('path');
const { Sequelize, Op, QueryTypes} = require('sequelize');
const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
const { bill } = require('../models/object.js');
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

module.exports.reportCreditDriver = async (driverId_, startDate_ = '', finalDate_ = '') => {

    /* let query = "SELECT SUM(`total`) AS `sumTransaction`,";
    query += " `dividedContract`.`dividedContractId` AS `dividedContract.dividedContractId`, `dividedContract`.`code` AS `dividedContract.code`, `dividedContract`.`creditLimit` AS `dividedContract.creditLimit`, `dividedContract`.`creditRemain` AS `dividedContract.creditRemain`";
    query += " FROM `bills` AS `bills` INNER JOIN `divided_contracts` AS `dividedContract` ON `bills`.`contractId` = `dividedContract`.`contractId` AND `bills`.`driverId` = `dividedContract`.`driverId`";
    query += " WHERE `bills`.`driverId` = " + driverId_;
    if(startDate_) {
        startDate_ = new Date(startDate_);
        query += " AND `bills`.`transactionDate` >= " + startDate_.toLocaleDateString();
    }
        
    if(finalDate_) {
        finalDate_ = new Date(finalDate_);
        query += " AND `bills`.`transactionDate` <= " + finalDate_.toLocaleDateString();
    }
    query += " GROUP BY `bills`.`contractId`;";

    return sequelize.query(query, {
        nest: true,
        type: QueryTypes.SELECT
    }); */

    let filter = {
        driverId: driverId_,
        status: 'active'
    }
    if(startDate_ || finalDate_) {
        filter.transactionDate = {};
        if(startDate_)
            filter.transactionDate = Object.assign(filter.transactionDate, {[Op.gte]: startDate_});
        if(finalDate_)
            filter.transactionDate = Object.assign(filter.transactionDate, {[Op.lte]: finalDate_});
    }

    let creditDrivers = bills.findAll({
        where: filter,
        attributes: [[sequelize.fn('SUM',sequelize.col('total')), 'sumTransaction']],
        group: '`bills`.`contractId`',
        include: [{model: contracts, attributes: ['contractId','name', 'status'],
                     include: [{model: dividedContracts, attributes: {exclude: ['contractId','driverId']}, where: {driverId: driverId_}}]
                }]
    }).then(result => JSON.parse(JSON.stringify(result)))
    .then(result => result.map(element =>{
        // element = Object.assign(element, element.contract);
        element.sumTransaction = stringToNumber(element.sumTransaction);
        element = Object.assign(element, {dividedContract: element.contract.dividedContracts[0]});
        delete element.contract.dividedContracts;
        return element;
    })).catch(() => []);
    
    let driver = drivers.findOne({
        where: {
            driverId: driverId_
        },
        attributes: ['driverId', 'code', 'name']
    }).then(result => JSON.parse(JSON.stringify(result))).catch(() => {});

    return await Promise.all([creditDrivers, driver]).then((resolve) => {
        return {
            driver: resolve[1],
            creditDrivers: resolve[0]
        }
    }).catch(() => {});
}

module.exports.reportCreditClient = async (clientId_, startDate_ = '', finalDate_ = '') => {
    let filter_contract = {};
    let filter_bill = {};
    if(startDate_ || finalDate_) {
        filter_bill.transactionDate = {};
        
        if(startDate_) {
            filter_contract = {expiredDate: {[Op.gte]: startDate_}};
            filter_bill.transactionDate = Object.assign(filter_bill.transactionDate, {[Op.gte]: startDate_});
        }
        if(finalDate_) {
            if(startDate_)
                filter_contract = {[Op.or]: [
                                {startDate: { [Op.lte]: startDate_}, expiredDate: {[Op.gte]: startDate_}},
                                {startDate: { [Op.lte]: finalDate_}, expiredDate: {[Op.gte]: finalDate_}}
                            ]
                };
            else
                filter_contract = {startDate: {[Op.lte]: finalDate_}};
            
            filter_bill.transactionDate = Object.assign(filter_bill.transactionDate, {[Op.lte]: finalDate_});
        }
    }

    filter_contract.clientId = clientId_;

    let client = clients.findOne({
        where: {
            clientId: clientId_
        },
        attributes: {
            include: [
                [sequelize.literal('`max_payment_limit` - (SELECT SUM(`debtCeiling`) FROM `contracts` WHERE `clientId` = `clients`.`clientId`)'), 'debtCeiling_remain']
            ]
        }
    }).then(client => JSON.parse(JSON.stringify(client)))
    .then(client => {
        client.debtCeiling_remain = stringToNumber(client.debtCeiling_remain);
        return client;
    }).catch(() => {});

    let contract =  contracts.findAll({
        where: filter_contract,
        attributes: {
            include: [
            [sequelize.literal('`debtCeiling` - (SELECT sum(`creditLimit` - `creditRemain`) FROM `divided_contracts` WHERE `contractId` = `contracts`.`contractId`)'), 'creditRemain']
              ]
        },
        include: [
                    {model: bills, attributes: [[sequelize.fn('SUM',sequelize.col('total')), 'sumTransaction']], where: filter_bill}
                ],
        group: '`contracts`.`contractId`'
    }).then(contracts => JSON.parse(JSON.stringify(contracts)).map(obj => {
        obj.creditRemain = stringToNumber(obj.creditRemain);
        obj.bills = obj.bills[0];
        obj.bills.sumTransaction = stringToNumber(obj.bills.sumTransaction);
        return obj;
    })).catch(() => []);
    
    return await Promise.all([client, contract]).then(resolve => {
        return {
            client: resolve[0],
            contracts: resolve[1],
        }
    }).catch(() => {});

}


module.exports.statisticBills = async (gasStationId_, driverId_ , clientId_, productId_, startDate_ = '', finalDate_ = '') => {
    let filter = {};
    if(startDate_ || finalDate_) {
        filter.transactionDate = {};
        
        if(startDate_) {
            filter.transactionDate = Object.assign(filter.transactionDate, {[Op.gte]: startDate_});
        }
        if(finalDate_) {
            filter.transactionDate = Object.assign(filter.transactionDate, {[Op.lte]: finalDate_});
        }
    }

    if(gasStationId_)
        filter.gasStationId = gasStationId_;
    if(driverId_)
        filter.driverId = driverId_;
    if(productId_)
        filter.productId = productId_;
    if(clientId_) {
        let filter_contract = {};
        if(startDate_) {
            filter_contract = {expiredDate: {[Op.gte]: startDate_}};
        }
        if(finalDate_) {
            if(startDate_)
                filter_contract = {[Op.or]: [
                                {startDate: { [Op.lte]: startDate_}, expiredDate: {[Op.gte]: startDate_}},
                                {startDate: { [Op.lte]: finalDate_}, expiredDate: {[Op.gte]: finalDate_}}
                            ]
                };
            else
                filter_contract = {startDate: {[Op.lte]: finalDate_}};
        }

        filter_contract.clientId = clientId_;
        filter.contractId = {
            [Op.in]: await contracts.findAll({
                where: filter_contract,
                attributes: ['contractId']
            }).then(contracts => JSON.parse(JSON.stringify(contracts)))
            .then(contracts => contracts.map(contract => contract.contractId)).catch(() => [])
        }
    }
    
    return bills.findAll({
        where: filter,
        include: [{model: drivers, attributes: ['name', 'code']},
            {model: contracts, attributes: ['name','code']},
            {model: gasStations, attributes: ['name', 'code']},
            {model: products, attributes: ['name', 'code']}]
    }).then(bills => JSON.parse(JSON.stringify(bills))).catch(() => []);

}