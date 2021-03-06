const { resolve } = require('path');
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
            {model: contracts, attributes: ['name','code']},
            {model: gasStations, attributes: ['name']},
            {model: products, attributes: ['name']}]
    }).then(bills => JSON.parse(JSON.stringify(bills))).catch(() => []);
}




// lấy thông tin driver, transaction, contractDriver, subcontract có driverId, plateId mong muốn
module.exports.getToCreateTransaction = async (driverId_ = '') => {
    let filter = {};
    if(driverId_){
        filter.driverId = driverId_;
        return drivers.findOne({
            where: filter,
            include: [{model: dividedContracts, include: [{model: contracts, where: { status: 'active'}}]}]
        }).then(driver => JSON.parse(JSON.stringify(driver)))
        .catch(() => { return {}});
    } else
        return {};
}
//  =========================================================

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
        where: filter,
        attributes: {
            include: [
                [sequelize.literal('`max_payment_limit` - (SELECT SUM(`debtCeiling`) FROM `contracts` WHERE `clientId` = `clients`.`clientId`)'), 'debtCeiling_remain']
            ]
        }
    }).then(clients => JSON.parse(JSON.stringify(clients)))
    .then(clients => clients.map(element => {
        element.debtCeiling_remain = stringToNumber(element.debtCeiling_remain);
        return element;
    })).catch(() => []);
}




//  =========================================================

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
    })).catch(() => []);
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
        client.debtCeiling_remain = stringToNumber(client.debtCeiling_remain);
        return client;
    })).catch(() => []);
}

//  =========================================================
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
        include: [{model: contracts, attributes: ['name','status']},
                {model: drivers, attributes: ['name']},]
    }).then(dividedContracts => JSON.parse(JSON.stringify(dividedContracts))).catch(() => []);
}

module.exports.getClients_Contracts = (clientId_ = '') => {
    let fliter = {};
    if(clientId_)
        fliter.clientId = clientId_;
    return clients.findOne({
        where: fliter,
        include: {model: contracts, where: {status: 'active'}}
    }).then(list => JSON.parse(JSON.stringify(list))).catch(() => { return {}});
}

module.exports.getToCreateDividedContract = async (clientId_, contractId_) => {
    console.log(clientId_ + " " + contractId_);
    if(clientId_ && contractId_) {
        let drivers_ = drivers.findAll({
            where: {
                clientId: clientId_
            },
            attributes: ['driverId'],
            
            include: {model: dividedContracts, attributes: [],required: true, include: [{model: contracts, where: { status: 'active'}, attributes: []}]}
        }).then(drivers => JSON.parse(JSON.stringify(drivers)))
        .then(list => {
            list = list.map(element => element.driverId);
            return drivers.findAll({
                where: {
                    clientId: clientId_,
                    driverId: {
                        [Op.notIn]: list
                    },
                    status: 'active'
                },
                order: ['name']
            }).then(drivers => JSON.parse(JSON.stringify(drivers))).catch(() => []);
        }).then(result => result).catch(() => []);

        let contract_ = contracts.findOne({
            where: {
                contractId: contractId_
            },
            attributes: {
                include: [
                    [sequelize.literal('`contracts`.`debtCeiling` - (SELECT SUM(`creditLimit`) FROM `divided_contracts` WHERE `contractId` = `contracts`.`contractId`)'), 'debtCeiling_remain'],
                    [sequelize.literal('`debtCeiling` - (SELECT sum(`creditLimit` - `creditRemain`) FROM `divided_contracts` WHERE `contractId` = `contracts`.`contractId`)'), 'creditRemain']
                ]
            },
            order: Sequelize.literal('`dividedContracts.driver.name`'),
            include: [{model: dividedContracts, include: [{model: drivers, where: {status: 'active'}}]}]
        }).then(contract => JSON.parse(JSON.stringify(contract)))
        .then(contract => {
            contract.debtCeiling_remain = stringToNumber(contract.debtCeiling_remain);
            contract.creditRemain = stringToNumber(contract.creditRemain);
            return contract;
        }).catch(() => { return {}});

        return await Promise.all([drivers_, contract_]).then(resolve_ => {
            console.log(JSON.stringify(resolve_[1],null,4));
            return {
                drivers: resolve_[0],
                contract: resolve_[1]
            }
        }).catch((err) => {
            console.log(err);
            return {
                drivers: [],
                contract: {}
            }
        });
    } 

    return {drivers: [], contract: {}};
}

module.exports.checkUpdateDividedContract = async (contractId_, update = [], insert = []) => {
    let debtCeiling = contracts.findOne({
        where: {
            contractId: contractId_
        },
        attributes: ['debtCeiling']
    }).then(contract => JSON.parse(JSON.stringify(contract)).debtCeiling).catch(() => 0);
    let listCreditLimit = await dividedContracts.findAll({
        where: {
            contractId: contractId_
        },
        attributes: ['dividedContractId', 'CreditLimit']
    }).then(listCreditLimit => JSON.parse(JSON.stringify(listCreditLimit)))
    .catch(() => []);

    return await Promise.all([debtCeiling, listCreditLimit]).then(resolve_ => {
        listCreditLimit = resolve_[1];
        update.map(element => {
            if(element.creditLimit) {
                for(let i = 0; i < listCreditLimit.length; i++) {
                    if(element.dividedContractId.toString() === listCreditLimit[i].dividedContractId.toString()) {
                        listCreditLimit[i].creditLimit = element.creditLimit;
                        return true;
                    }
                }
            }
            return false;
        });
        let sumCreditLimit = listCreditLimit.reduce((total, value) => {
            return total + value.creditLimit;
        }, 0);
        sumCreditLimit += insert.reduce((total, value) => {
            return total + value.creditLimit;
        }, 0);
        if(sumCreditLimit <= resolve_[0])
            return true;
        else
            return false;
    }).catch(() => flase);
}

//  =========================================================
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
    }).then(drivers => JSON.parse(JSON.stringify(drivers))).catch(() => { return {}});
}

//  =========================================================
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
    }).then(gasStations => JSON.parse(JSON.stringify(gasStations))).catch(() => []);
}


//  =========================================================
// hàm lấy product
module.exports.getProducts = (productId_ = '', code_ = '') => {
    let filter = {};
    if(productId_)
        filter.productId = productId_;
    if(code_)
        filter.code = code_;
    return products.findAll({
        where: filter
    }).then(products => JSON.parse(JSON.stringify(products))).catch(() => []);
}




//  =========================================================
// hàm lấy role
module.exports.getRoles = (roleId_ = '') => {
    let filter = {};
    if(roleId_)
        filter.roleId = roleId_;
    return roles.findAll({
        where: filter
    }).then(roles => JSON.parse(JSON.stringify(roles))).catch(() => []);
}



//  =========================================================
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
    }).then(users => JSON.parse(JSON.stringify(users))).catch(() => []);
}


module.exports.getUser = async (username_ = '', password_ = '') => {
    let user;
    if(username_ && password_) {
        user = await users.findOne({
            where: {
                username: username_,
                password: password_
            },
            attributes: {
                exclude: ['username','password','roleId']
            },
            include: [{model: roles, attributes: ['permission']}]
        }).then(user => JSON.parse(JSON.stringify(user))).catch(() => { return {}});
    }

    if(user) {
        switch(user.type) {
            case 'driver':
                user.info = await this.getDrivers('','',user.userId,'','').then(result => {
                    delete result[0].userId;
                    return result[0];
                }).catch(() => { return {}});
                break;
            case 'client':
                user.info = await this.getClients('',user.userId,'','').then(result => {
                    delete result[0].userId;
                    return result[0];
                }).catch(() => { return {}});
                break;
            case 'gasStation':
                user.info = await this.getGasStations('',user.userId,'').then(result => {
                    delete result[0].userId;
                    return result[0];
                }).catch(() => { return {}});
        }
        // user.userId = undefined;
        return user;
    }
    else
        return {};  
}

module.exports.getPassword = async (userId_) => {
    return await users.findOne({
        where: {
            userId: userId_
        },
        attributes: ['password']
    }).then(user => JSON.parse(JSON.stringify(user))).catch(() => '');
}

module.exports.checkUsername = async (username_) => {
    return await users.findOne({
        where: {
            username: username_
        }
    }).then(user => {
        if(Object.keys(user).length !== 0)
            return true;
        else
            return false;
    }).catch(() => false);
}

module.exports.checkCode = async (code_, type_) => {
    switch(type_) {
        case 'driver':
            return await drivers.findOne({
                where: {
                    code: code_
                },
                attributes: ['userId']
            }).then(user => {
                if(Object.keys(user).length !== 0)
                    return true;
                else
                    return false;
            }).catch(() => false);
        case 'client':
            return await clients.findOne({
                where: {
                    code: code_
                },
                attributes: ['userId']
            }).then(user => {
                if(Object.keys(user).length !== 0)
                    return true;
                else
                    return false;
            }).catch(() => false);
        case 'gasStation':
            return await gasStations.findOne({
                where: {
                    code: code_
                },
                attributes: ['userId']
            }).then(user => {
                if(Object.keys(user).length !== 0)
                    return true;
                else
                    return false;
            }).catch(() => false);
        case 'admin':
            return true;
        case 'product':
            return await products.findOne({
                where: {
                    code: code_
                },
                attributes: ['code']
            }).then(user => {
                if(Object.keys(user).length !== 0)
                    return true;
                else
                    return false;
            }).catch(() => false);
        case 'contract':
            return await contracts.findOne({
                where: {
                    code: code_
                },
                attributes: ['code']
            }).then(user => {
                if(Object.keys(user).length !== 0)
                    return true;
                else
                    return false;
            }).catch(() => false);
        case 'dividedContract':
            return await dividedContracts.findOne({
                where: {
                    code: code_
                },
                attributes: ['code']
            }).then(user => {
                if(Object.keys(user).length !== 0)
                    return true;
                else
                    return false;
            }).catch(() => false);
        default:
            return false;
    }
}

module.exports.checkTaxId = async (taxId_) => {
    return await clients.findOne({
        where: {
            taxId: taxId_
        }
    }).then(user => {
        if(Object.keys(user).length !== 0)
            return true;
        else
            return false;
    }).catch(() => false);
}



