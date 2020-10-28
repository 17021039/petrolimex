const { Sequelize, Op, QueryTypes} = require('sequelize');
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

const fs = require('fs');

module.exports.updateRole = async (roleId_, permission_) => {
    let role = object.role('', permission_);
    return await roles.update(role,
        {
            where: {
                roleId: roleId_
            }
        }).then(() => true)
        .catch(() => false);
}

module.exports.updateUser = async (userId_, username_, password_, roleId_) => {
    let user = object.user('', username_, password_, '', roleId_);
    return await users.update(user,
        {
            where: {
                userId: userId_
            }
        }).then(() => true)
        .catch(() => false);
}

module.exports.updateClient = async (clientId_, code_, name_, address_, taxId_, max_payment_limit_) => {
    let client = object.client('', '', '', name_, address_, taxId_, max_payment_limit_);
    return await clients.update(client,
        {
            where: {
                clientId: clientId_
            }
        }).then(() => true)
        .catch(() => false);
}

module.exports.updateDriver = async (driverId_, code_, name_, residentId_, plate_, avatar_, phone_, address_, status_) => {
    let driver = object.driver('', '', '', '', name_, residentId_, plate_, avatar_, phone_, address_, status_);
    let previousData = await drivers.findOne({
        where: {
            driverId: driverId_
        },
        attributes: Object.keys(driver).push('clientId')
    }).then(driver => JSON.parse(JSON.stringify(driver))).catch(() => {});
    return await drivers.update(driver,
        {
            where: {
                driverId: driverId_
            }
        }).then(async () => {
            if(status_ && status_ !== 'active') {
                let dividedContractIds = await dividedContracts.findAll({
                    where: {
                        driverId: driverId_
                    },
                    attributes: ['dividedContractId'],
                    include: [{model: contracts, where: {status: {[Op.ne]: 'inactive'}}}]
                }).then((result) => JSON.parse(JSON.stringify(result)).map(element => element.dividedContractId))
                .catch((err) => err);
                
                return dividedContracts.update({creditLimit: Sequelize.literal(' `creditLimit` - `creditRemain`'), creditRemain: 0},
                                        {
                                            where: {
                                                dividedContractId: {
                                                    [Op.in]: dividedContractIds
                                                }
                                            }
                                    }).then(() => true).catch((err) => {
                                        drivers.update(previousData,
                                            {
                                                where: {
                                                    driverId: driverId_
                                                }
                                            }).catch(() => false);
                                        return false;
                                    });
            }
            return true;
        }).then(result => result)
        .catch(() => false); 
}

module.exports.updateGasStation = async (gasStationId_, code_, name_, address_, location_, workingTime_) => {
    let gasStation = object.gasStation('', '', '', name_, address_, location_, workingTime_);
    return await gasStations.update(gasStation,
        {
            where: {
                gasStationId: gasStationId_
            }
        }).then(() => true)
        .catch(() => false);
}

module.exports.updateContract = async (contractId_, name_, destroy_ = false) => {
    let contract = object.contract('', '', '', name_, '', '', '', '', '');
    let listUpdate = [];
    listUpdate.push(contracts.update(contract,
        {
            where: {
                contractId: contractId_
            }
        }).then(() => true)
        .catch(() => false));
    listUpdate.push(this.destroyContract(contractId_, destroy_));
    return await Promise.all (listUpdate).then((resolve) => resolve.indexOf(false) !== -1 ? false : true).catch(() => false);
}

module.exports.updateDividedContract = async (dividedContractId_, code_, creditLimit_, creditRemain_, max_transaction_) => {

    let update = {};
    let previousData = await dividedContracts.findOne({
        where: {
            dividedContractId: dividedContractId_
        },
        attributes: ['creditLimit', 'creditRemain', 'max_transaction']
    }).then(data => JSON.parse(JSON.stringify(data)))
    .catch(() => {});

    if(creditLimit_ && creditLimit_ !== previousData.creditLimit) {
        if((previousData.creditLimit - previousData.creditRemain) > creditLimit_)
            return false;
        update = {
            creditRemain: Sequelize.literal(creditLimit_.toString() + ' - (`creditLimit` - `creditRemain`)'),
            creditLimit: creditLimit_
        };
    }

    if(max_transaction_ && max_transaction_ !== previousData.max_transaction) {
        update.max_transaction = max_transaction_;
    }
    if(Object.keys(update).length !== 0)
        return await dividedContracts.update(update, {
            where: {
                dividedContractId: dividedContractId_
            }
        }).then(() => true).catch(() => false);
    else
        return false;
}

module.exports.updateDividedContracts = async (dividedContracts_ = []) => {
    for(let element of dividedContracts_) {
        if(object.containKeys('dividedContract', Object.keys(element)) === false)
            return false;
    }

    let previousDatas = [];
    let listUpdate = [];
    for(let element of dividedContracts_) {
        let update = {};
        let previousData = await dividedContracts.findOne({
            where: {
                dividedContractId: element.dividedContractId
            },
            attributes: ['dividedContractId','creditLimit', 'creditRemain', 'max_transaction']
        }).then(data => JSON.parse(JSON.stringify(data)))
        .catch(() => {});
        previousDatas.push(previousData);

        if(element.creditLimit && element.creditLimit !== previousData.creditLimit) {
            if((previousData.creditLimit - previousData.creditRemain) <= element.creditLimit) {
                update = {
                    creditRemain: Sequelize.literal(element.creditLimit.toString() + ' - (`creditLimit` - `creditRemain`)'),
                    creditLimit: element.creditLimit
                };
            }
        }

        if(element.max_transaction && element.max_transaction !== previousData.max_transaction) {
            update.max_transaction = element.max_transaction;
        }
        if(Object.keys(update).length !== 0)
            listUpdate.push(dividedContracts.update(update, {
                where: {
                    dividedContractId: element.dividedContractId
                }
            }).then(() => true).catch(() => false));
    }

    return Promise.all(listUpdate).then(resolve => {
        if(resolve.indexOf(false) !== -1) {
            let promises = [];
            for(let previousData of previousDatas) {
                promises.push(dividedContracts.update(previousData,
                    {
                        where: {
                            dividedContractId: previousData.dividedContractId
                        }
                    }).then(() => true)
                    .catch(() => false));
            }
            return Promise.all(promises).then(() => false).catch(() => false);
        } else {
            return true;
        }
    }).then((result) => result).catch(() => false);
    
}

module.exports.updateProduct = async (productId_, code_, name_, unit_, price_) => {
    let product = object.product('', code_, name_, unit_, price_);
    return await products.update(product,
        {
            where: {
                productId: productId_
            }
        }).then(() => true)
        .catch(() => false);
}


module.exports.updateStatusContracts = async () => {
    let now = new Date(Date.now());
    now.setHours(0,0,0,0);
    let DATE = fs.readFileSync('./info.json',{encoding: 'utf-8'});
    if(DATE)
        DATE = new Date(JSON.parse(DATE).DATE);
    else
        DATE = new Date('start');

    if(!DATE.toJSON() || DATE < now) {
        let updateActive = contracts.update({status: 'active'}, {
            where: {
                status: 'inactive',
                startDate: {
                    [Op.lte]: now
                },
                expiredDate: {
                    [Op.gte]: now
                }
            }
        });
    
        let updateInactive = contracts.update({status: 'inactive'}, {
            where: {
                status: 'active',
                [Op.or]: [
                    {
                        startDate: {
                            [Op.gt]: now
                        }
                    },
                    {
                        expiredDate: {
                            [Op.lt]: now
                        }
                    }
                ]
            }
        });
        await Promise.all([updateActive, updateInactive]).then(() => {
            fs.writeFileSync('./info.json', JSON.stringify({DATE: now.toJSON()}) ,{encoding: 'utf-8'});
        })
    }

}

module.exports.destroyContract = async (contractId_, destroy_ = true) => {
    if(destroy_) {
        return await contracts.update({status: 'destroy'},{
            where: {
                contractId: contractId_
            }
        }).then(() => true)
        .catch(() => false);
    } else {
        return await contracts.findOne({
            where: {
                contractId: contractId_
            }
        }).then(contract => {
            let now = new Date(Date.now());
            now.setHours(0,0,0,0);
            startDate = new Date(contract.startDate);
            expiredDate = new Date(contract.expiredDate);
            let status_ = 'inactive';
            if(startDate <= now && now <= expiredDate)
                status_ = 'active';
            return contracts.update({status: status_},{
                where: {
                    contractId: contractId_
                }
            }).then(() => true).catch(() => false);
        }).catch(() => false);
    }
    
}

module.exports.changePassword = async (id_, type_, password_) => {
    switch(type_) {
        case 'driver':
            return await drivers.findOne({
                where: {
                    driverId: id_
                },
                attributes: ['userId']
            }).then(userId => {
                return users.update({password: password_},
                    {
                        where: userId
                    }).then(() => true).catch(() => false);
            }).catch(() => false);
        case 'client':
            return await clients.findOne({
                where: {
                    clientId: id_
                },
                attributes: ['userId']
            }).then(userId => {
                return users.update({password: password_},
                    {
                        where: userId
                    }).then(() => true).catch(() => false);
            }).catch(() => false);
        case 'gasStation':
            return await gasStations.findOne({
                where: {
                    gasStationId: id_
                },
                attributes: ['userId']
            }).then(userId => {
                return users.update({password: password_},
                    {
                        where: userId
                    }).then(() => true).catch(() => false);
            }).catch(() => false);
        case 'admin':
            return await users.update({password: password_},{where: {userId: id_}})
                    .then(() => true).catch(() => false);
        default:
            return false;
    }
}