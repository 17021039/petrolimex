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
const IdGenerator = require('Id-generator');
let Id = new IdGenerator();


// tạo role (quyền đăng nhập)
module.exports.createRole = (permission_) => {
    let role = object.role('',permission_);
    roles.create(role);
}

// tạo user (tài khoản của admin)
module.exports.createUser = (username_, password_, type_, roleId_) => {
    let user = object.user('', username_, password_, type_, roleId_);
    users.create(user);
}

// tạo user của client + client (khách hàng)
module.exports.createClient = (code_, name_, address_, taxId_, max_payment_limit_, username_, password_, roleId_) => {
    let user =  object.user('', username_, password_, roleId_);
    users.create(user)
    .then((user) => {
        let client = object.client('', code_, user.userId, name_, address_, taxId_, max_payment_limit_);
        clients.create(client);
    });
}

// tạo user của driver + driver (tài xế)
module.exports.createDriver = (clientId_, code_, name_, residentId_, avatar_, phone_, address_, status_, username_, password_, roleId_) => {
    let user = object.user('', username_, password_, roleId_);
    users.create(user)
    .then((user) => {
        let driver = object.driver('', clientId_, code_, user.userId, name_, residentId_, avatar_, phone_, address_, status_);
        drivers.create(driver)
    });
}

// tạo user của gas station + gas station (cửa hàng xăng dầu)
module.exports.createGasStation = (code_, name_, address_, location_,workingTime_, username_, password_, roleId_) => {
    let user = object.user('', username_, password_, roleId_);
    users.create(user)
    .then((user) => {
        let gasStation = object.gasStation('', user.userId, code_, name_, address_, location_, workingTime_);
        gasStations.create(gasStation)
    });
}

// tạo contract(hợp đồng tổng- ký giữa khách hàng với tổng công ty xăng dầu)
module.exports.createContract = (clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_) => {
    let contract = object.contract('', clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_);
    return contracts.create(contract).then(() => "Lưu thành công").catch(()=> "Lưu thất bại");
}

// chia hợp đồng cho tài xế
module.exports.createDividedContract = (driverId_, code_, contractId_, creditLimit_, max_transaction_) => {
    let dividedContract = object.dividedContract('', driverId_, code_, contractId_, creditLimit_, creditLimit_, max_transaction_);
    dividedContracts.create(dividedContract);
}

// chia hợp đồng cho tài xế vào theo array
module.exports.createDividedContract = (dividedContractArray = []) => {
    return dividedContracts.bulkCreate(dividedContractArray).then(() => "Lưu thành công").catch(()=> "Lưu thất bại");
}

module.exports.updateDividedContracts = (dividedContractObject = {}) => {
    dividedContracts.update(dividedContractObject, {
        where: {
            dividedContractId: dividedContractObject.dividedContractId
        }
    })
}

// tạo bill (bill đã hợp lệ để lưu) =========
module.exports.createBill = async (driverId_, contractId_, gasStationId_, productId_, quantity_, transactionDate_, status_) => {

    let price_ = await products.findOne({
        where: {
            productId: productId_
        },
        attributes: ['price']
    }).then(product => product.price);

    let creditRemain_ = await dividedContracts.findOne({
        where: {
            driverId: driverId_,
            contractId: contractId_
        },
        attributes: ['creditRemain']
    }).then(dividedContract => dividedContract.creditRemain);

    let total_ = price_ * quantity_;
    if(total_ > creditRemain_)
        status_ = "inactive";
    // else
    //     status_ = "active";
    let bill = object.bill('', driverId_, contractId_, gasStationId_, productId_, quantity_, total_, transactionDate_, status_);

    let status_save = "Lưu thành công";
    
    if(status_ === "active") {
        status_save = await bills.create(bill)
            .then((bill) => {
                return dividedContracts.update({creditRemain: sequelize.literal('creditRemain - ' + total_.toString())},
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
                    return "Lưu thành công";
                else
                    return "Lưu thất bại";
                }
            ).catch(() => "Lưu thất bại");
    } else {
        status_save = bills.create(bill).then(() => "Lưu thành công").catch(() => "Lưu thất bại");
    }
    return status_save;
}

// tạo product
module.exports.createProduct = (code_, name_, unit_, price_) => {
    let product = object.product('', code_, name_, unit_, price_);
    products.create(product);
}
