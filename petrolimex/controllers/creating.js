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

// tạo role (quyền đăng nhập)
module.exports.createRole = async (permission_) => {
    let role = object.role('',permission_);
    if(object.containKeys('role', Object.keys(role), true) === false)
        return false;
    return await roles.create(role).then(() => true).catch(() => false);
}

// tạo user (tài khoản của admin)
module.exports.createUser = async (username_, password_, roleId_ = 1) => {
    let user = object.user('', username_, password_, 'admin', roleId_);
    if(object.containKeys('user', Object.keys(user), true) === false)
        return false;
    return await users.create(user).then(() => true).catch(() => false);
}

// tạo user của client + client (khách hàng)
module.exports.createClient = async (code_, name_, address_, taxId_, max_payment_limit_, username_, password_, roleId_) => {
    let user =  object.user('', username_, password_, 'client', roleId_);
    
    if(object.containKeys('user', Object.keys(user), true) === false)
        return false;
    return await users.create(user)
    .then((user) => {
        let client = object.client('', code_, user.userId, name_, address_, taxId_, max_payment_limit_);
        if(object.containKeys('client', Object.keys(client), true) === false) {
            users.destroy({
                where: {
                    userId: user.userId
                }
            })
            return false;
        }

        return clients.create(client).then(() => true)
        .catch(() => {
            users.destroy({
                where: {
                    userId: user.userId
                }
            })
            return false;
        });
    }).catch(() => false);
}

// tạo user của driver + driver (tài xế)
module.exports.createDriver = async (clientId_, code_, name_, residentId_, plate_, avatar_, phone_, address_, status_, username_, password_, roleId_) => {
    let user = object.user('', username_, password_, 'driver', roleId_);
    
    if(object.containKeys('user', Object.keys(user), true) === false)
        return false;
    
    return await users.create(user)
    .then((user) => {
        
        let driver = object.driver('', clientId_, code_, user.userId, name_, residentId_, plate_, avatar_, phone_, address_, status_);
        if(object.containKeys('driver', Object.keys(driver), true) === false) {
            users.destroy({
                where: {
                    userId: user.userId
                }
            })
            return false;
        }

        return drivers.create(driver).then(() => true)
        .catch((err) => {
            console.log(err);
            users.destroy({
                where: {
                    userId: user.userId
                }
            })
            return false;
        });
    })
    .catch((err) => {console.log(err); return false;});
}

// tạo user của gas station + gas station (cửa hàng xăng dầu)
module.exports.createGasStation = async (code_, name_, address_, location_,workingTime_, username_, password_, roleId_) => {
    let user = object.user('', username_, password_, 'gasStation', roleId_);
    
    if(object.containKeys('user', Object.keys(user), true) === false)
        return false;
    return await users.create(user)
    .then((user) => {
        let gasStation = object.gasStation('', user.userId, code_, name_, address_, location_, workingTime_);
        if(object.containKeys('gasStation', Object.keys(gasStation), true) === false) {
            users.destroy({
                where: {
                    userId: user.userId
                }
            })
            return false;
        }

        return gasStations.create(gasStation).then(() => true)
        .catch(() => {
            users.destroy({
                where: {
                    userId: user.userId
                }
            })
            return false;
        });
    }).catch(() => false);
}

// tạo contract(hợp đồng tổng- ký giữa khách hàng với tổng công ty xăng dầu)
module.exports.createContract = async (clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_) => {
    let now = new Date(Date.now());
    now.setHours(0,0,0,0);
    startDate = new Date(startDate_);
    expiredDate = new Date(expiredDate_);
    let status_ = 'inactive';
    if(startDate <= now && now <= expiredDate)
        status_ = 'active';
    let contract = object.contract('', clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_);
    if(object.containKeys('contract', Object.keys(contract), true))
        return false;
    return await contracts.create(contract).then(() => true).catch(()=> false);
}

// chia hợp đồng cho tài xế
module.exports.createDividedContract = async (driverId_, code_, contractId_, creditLimit_, max_transaction_) => {
    let dividedContract = object.dividedContract('', driverId_, code_, contractId_, creditLimit_, creditLimit_, max_transaction_);
    if(object.containKeys('dividedContract', Object.keys(dividedContract), true) === false)
        return false;
    return await dividedContracts.create(dividedContract).then(() => true).catch(()=> false);
}

// chia hợp đồng cho tài xế vào theo array
module.exports.createDividedContracts = async (dividedContractArray = []) => {
    for(let dividedContract of dividedContractArray) {
        if(object.containKeys('dividedContract', Object.keys(dividedContract), true) === false || object.containKeys('dividedContract', Object.keys(dividedContract)) === false)
            return false;
    }
    return await dividedContracts.bulkCreate(dividedContractArray).then(() => true).catch(()=> false);
}

module.exports.updateDividedContracts = async (dividedContractObject = {}) => {
    if(object.containKeys('dividedContract', Object.keys(dividedContract), true) === false || object.containKeys('dividedContract', Object.keys(dividedContract)) === false)
        return false;
    return await dividedContracts.update(dividedContractObject, {
        where: {
            dividedContractId: dividedContractObject.dividedContractId
        }
    }).then(() => true).catch(()=> false);
}

// tạo bill (bill đã hợp lệ để lưu) =========
module.exports.createBill = async (driverId_, contractId_, gasStationId_, productId_, quantity_, total_, transactionDate_, status_) => {

    if(!total_) {
        let price_ = await products.findOne({
            where: {
                productId: productId_
            },
            attributes: ['price']
        }).then(product => product.price);
        total_ = price_ * quantity_;
    }

    if(!status_) {
        let creditRemain_ = await dividedContracts.findOne({
            where: {
                driverId: driverId_,
                contractId: contractId_
            },
            attributes: ['creditRemain'],
            include: [{model: contracts, attributes: [], where: {status: 'active'}}]
        }).then(dividedContract => {
            if(dividedContract.creditRemain) {
                return 0;
            }
            return dividedContract.creditRemain;
        });

        if(total_ > creditRemain_)
            status_ = "inactive";
    }

    let bill = object.bill('', driverId_, contractId_, gasStationId_, productId_, quantity_, total_, transactionDate_, status_);
    if(object.containKeys('bill', Object.keys(bill), true) === false) {
        return false;
    }
        

    let status_save = true;
    
    if(status_ === "active") {
        status_save = await bills.create(bill)
            .then((bill) => {
                return dividedContracts.update({creditRemain: sequelize.literal(' `creditRemain` - ' + total_.toString())},
                {
                    where: {
                        driverId: driverId_,
                        contractId: contractId_
                    }
                })
                .then(() => true)
                .catch(() => {
                    bills.destroy({
                        where: {
                            billId: bill.billId
                        }
                    });
                    return false;
                });
                
            })
            .then(saved => {
                if(saved)
                    return true;
                else
                    return false;
                }
            ).catch(() => false);
    } else {
        status_save = await bills.create(bill).then(() => true).catch(() => false);
    }
    return status_save;
}

// tạo product
module.exports.createProduct = async (code_, name_, unit_, price_) => {
    let product = object.product('', code_, name_, unit_, price_);
    if(object.containKeys('product', Object.keys(product), true) === false)
        return false;
    return await products.create(product).then(() => true).catch(()=> false);
}
