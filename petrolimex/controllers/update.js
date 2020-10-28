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
    return await drivers.update(driver,
        {
            where: {
                driverId: driverId_
            }
        }).then(() => true)
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

    let listUpdate = [];
    if(creditLimit_) {
        listUpdate.push(dividedContracts.update({creditRemain: Sequelize.literal(creditLimit_.toString() + ' - (`creditLimit` - `creditRemain`)'),creditLimit: creditLimit_},
            {
                where: {
                    [Op.and]: [
                        {dividedContractId: dividedContractId_},
                        Sequelize.where(Sequelize.literal('(`creditLimit` - `creditRemain`)'), {[Op.lte]: creditLimit_})
                    ]
                }
            }).then(() => true)
            .catch(() => false));
    }
    if(max_transaction_) {
        listUpdate.push(dividedContracts.update({max_transaction: max_transaction_},
            {
                where: {
                    dividedContractId: dividedContractId_
                }
            }).then(() => true)
            .catch(() => false));
    }
    return await Promise.all(listUpdate).then((resolve) => resolve.indexOf(false) !== -1 ? false : true).catch(() => false);
}

module.exports.updateDividedContracts = async (dividedContracts_ = []) => {
    for(let element of dividedContracts_) {
        if(object.containKeys('dividedContract', Object.keys(element)) === false)
            return false;
    }

    let previousDatas = [];
    for(let element of dividedContracts_) {
        let dividedContract = object.dividedContract('' , '', '', '', element.creditLimit, '', element.max_transaction);
        let keys = Object.keys(dividedContract);
        keys.push('dividedContractId');
        let oldData = dividedContracts.findOne({
            where: {
                dividedContractId: element.dividedContractId
            },
            attributes: keys
        });
        let listUpdate = [];
        if(element.creditLimit) {
            listUpdate.push(dividedContracts.update({creditRemain: Sequelize.literal(element.creditLimit.toString() + ' - (`creditLimit` - `creditRemain`)'),creditLimit: element.creditLimit},
                {
                    where: {
                        [Op.and]: [
                            {dividedContractId: element.dividedContractId},
                            Sequelize.where(Sequelize.literal('(`creditLimit` - `creditRemain`)'), {[Op.lte]: element.creditLimit})
                        ]
                    }
                }).then(() => true)
                .catch(() => false));
        }
        if(element.max_transaction) {
            listUpdate.push(dividedContracts.update({max_transaction: element.max_transaction},
                {
                    where: {
                        dividedContractId: element.dividedContractId
                    }
                }).then(() => true)
                .catch(() => false));
        }
        let update = Promise.all(listUpdate).then((resolve) => resolve.indexOf(false) !== -1 ? false : true).catch(() => false);
        
        let updateStatus = await Promise.all([oldData, update]).then(resolve => {
            if(resolve[1]) {
                previousDatas.push(resolve[0]);
                return true;
            }
            else
                return false;
        }).catch(() => false);

        if(!updateStatus) {
            let promises = []
            for(let previousData of previousDatas) {
                promises.push(dividedContracts.update(previousData,
                    {
                        where: {
                            dividedContractId: previousData.dividedContractId
                        }
                    }).then(() => true)
                    .catch(() => false));
            }
            return await Promise.all(promises).then(() => false).catch(() => false);;
        }
    }

    return true;
    
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