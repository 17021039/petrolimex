const sequelize = require('../connect/connection.js');
const models = require('../models/models.js');
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
const object = require('../models/object.js');
const idGenerator = require('id-generator');
const { model } = require('../connect/connection.js');
let id = new idGenerator();


// tạo role (quyền đăng nhập)
module.exports.createRole = (roleID_, permission_) => {
    let role = object.role(roleID_,permission_);
    roles.create(role);
}

// tạo user (tài khoản của admin)
module.exports.createUser = (userID_, username_, password_, roleID_) => {
    let user = object.user(userID_, username_, password_, roleID_);
    users.create(user);
}

// tạo user của client + client (khách hàng)
module.exports.createClient = (clientID_, name_, address_, taxID_, max_payment_limit_, username_, password_, roleID_) => {
    let user = object.user(clientID_, username_, password_, roleID_);
    let client = object.client(clientID_, name_, address_, taxID_, max_payment_limit_);
    users.create(user)
    .then(() => clients.create(client));
}

// tạo user của driver + driver (tài xế)
module.exports.createDriver = (driverID_, clientID_, name_, residentID_, avatar_, phone_, address_, status_, username_, password_, roleID_) => {
    let user = object.user(driverID_, username_, password_, roleID_);
    let driver = object.driver(driverID_, clientID_, name_, residentID_, avatar_, phone_, gmail_, address_, status_);
    users.create(user)
    .then(() => drivers.create(driver));
}

// tạo user của gas station + gas station (cửa hàng xăng dầu)
module.exports.createGasStation = (gasStationID_, name_, address_, location_,workingTime_, username_, password_, roleID_) => {
    let user = object.user(gasStationID_, username_, password_, roleID_);
    let gasStation = object.gasStation(gasStationID_, name_, address_, location_, workingTime_);
    users.create(user)
    .then(() => gasStations.create(gasStation));
}

// tạo gross contract(hợp đồng tổng- ký giữa khách hàng với tổng công ty xăng dầu)
module.exports.createGrossContract = (clientID_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_) => {
    let grossContractID_ = id.newId();
    let grossContract = object.grossContract(grossContractID_, clientID_, name_, signedDate_,startDate_, expiredDate_, debtCeiling_, status_);
    return grossContracts.create(grossContract).then(() => "Lưu thành công").catch(()=> "Lưu thất bại");
}

// tạo subcontract(hợp đồng con- ký giữa khách hàng với tài xế)
module.exports.createSubcontract = (grossContractID_, name_, createdDate_, startDate_, expiredDate_, debtCeiling_, status_) => {
    let subcontractID_ = id.newId();
    let subcontract = object.subcontract(subcontractID_ , grossContractID_, name_,createdDate_, startDate_, expiredDate_, debtCeiling_, debtCeiling_, status_);
    return subcontracts.create(subcontract).then(() => "Lưu thành công").catch(() => "Lưu thất bại");
}

// chia hợp đồng cho tài xế
module.exports.createContractDriver = (driverID_, plate_, subcontractID_, creditLimit_, creditRemain_) => {
    let contractDriver = object.contractDriver(driverID_, plate_, subcontractID_, creditLimit_, creditRemain_);
    contractDrivers.create(contractDriver);
}

// tạo bill (bill đã hợp lệ để lưu) =========
module.exports.createBill = async (driverID_, plate_, subcontractID_, gasStationID_, productID_, quantity_, transactionDate_, status_ = "") => {
    let clientID_ = await drivers.findOne({
        where: {
            driverID: driverID_
        },
        attributes: ['clientID']
    }).then(driver => driver.clientID);

    let price_ = await products.findOne({
        where: {
            productID: productID_
        },
        attributes: ['price']
    }).then(product => product.price);

    let creditRemain_ = await contractDrivers.findOne({
        where: {
            driverID: driverID_,
            plate: plate_,
            subcontractID: subcontractID_
        },
        attributes: ['creditRemain']
    }).then(contractDriver => contractDriver.creditRemain);
    status_ = await subcontracts.findOne({
        where: {
            subcontractID: subcontractID_
        },
        attributes: ['status']
    }).then(subcontract => subcontract.status);

    let billID_ = id.newId();
    let total_ = price_ * quantity_;
    if(total_ > creditRemain_)
        status_ = "inactive";
    // else
    //     status_ = "active";
    let bill = object.bill(billID_, driverID_, clientID_, plate_, subcontractID_, gasStationID_, productID_, quantity_, total_, transactionDate_, status_);
    console.log(bill);

    let status_save = "Lưu thành công";
    if(status_ === "active") {
        status_save = await bills.create(bill)
            .then(() => {
                contractDrivers.update({creditRemain: sequelize.literal('creditRemain - ' + total_.toString())},
                {
                    where: {
                        driverID: driverID_,
                        plate: plate_,
                        subcontractID: subcontractID_
                    }
                }).catch(() => {
                    bills.destroy({
                        where: {
                            billID: billID_
                        }
                    });
                    return false;
                });
                
            }).then(save_continue => {
                if(save_continue) {
                    subcontracts.update({creditRemain: sequelize.literal('creditRemain - ' + total_.toString())},
                    {
                        where: {
                            subcontractID: subcontractID_
                        }
                    }).then(() => true)
                    .catch(() => {
                        bills.destroy({
                            where: {
                                billID: billID_
                            }
                        });
                        contractDrivers.update({creditRemain: sequelize.literal('creditRemain + ' + total_.toString())},
                        {
                            where: {
                                driverID: driverID_,
                                plate: plate_,
                                subcontractID: subcontractID_
                            }
                        });
                        return false;
                    });
                } else
                    return false;
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
module.exports.createProduct = (productID_, name_, unit_, price_) => {
    let product = object.product(productID_, name_, unit_, price_);
    products.create(product);
}

// tạo transport
module.exports.createTransport = (plate_, clientID_, name_, type_, image_, maxQuantity_) => {
    let transport = object.transport(plate_, clientID_, name_, type_, image_, maxQuantity_);
    transports.create(transport);
}