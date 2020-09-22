const { model } = require("../connect/connection");
const { transports } = require("./models");

// xuất object bill
module.exports.bill = (billID_, driverID_, clientID_, plate_, subcontractID_, gasStationID_, productID_, quantity_, total_, transactionDate_, status_) => {
    let bill = {};
    bill.billID = billID_;
    bill.driverID = driverID_;
    bill.clientID = clientID_;
    bill.plate = plate_;
    bill.subcontractID = subcontractID_;
    bill.gasStationID = gasStationID_;
    bill.productID = productID_;
    bill.quantity = quantity_;
    bill.total = total_;
    bill.transactionDate = transactionDate_;
    bill.status = status_;
    return bill;
}

// xuất object client
module.exports.client = (clientID_, name_, address_, taxID_, max_payment_limit_) => {
    let client = {};
    client.clientID = clientID_;
    client.name = name_;
    client.address = address_;
    client.taxID = taxID_;
    client.max_payment_limit = max_payment_limit_;
    return client;
}

// xuất object grossContract
module.exports.grossContract = (grossContractID_, clientID_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_) => {
    let grossContract = {};
    grossContract.grossContractID = grossContractID_;
    grossContract.clientID = clientID_;
    grossContract.name = name_;
    grossContract.signedDate = signedDate_;
    grossContract.startDate = startDate_;
    grossContract.expiredDate = expiredDate_;
    grossContract.debtCeiling = debtCeiling_;
    grossContract.status = status_;
    return grossContract;
}

// xuất object subcontract
module.exports.subcontract = (subcontractID_ , grossContractID_, name_, createdDate_, startDate_, expiredDate_, debtCeiling_, creditRemain_, status_) => {
    let subcontract = {};
    subcontract.subcontractID = subcontractID_;
    subcontract.grossContractID = grossContractID_;
    subcontract.name = name_;
    subcontract.createdDate = createdDate_;
    subcontract.startDate = startDate_;
    subcontract.expiredDate = expiredDate_;
    subcontract.debtCeiling = debtCeiling_;
    subcontract.creditRemain = creditRemain_;
    subcontract.status = status_;
    return subcontract;
}

// xuất object contractDriver
module.exports.contractDriver = (driverID_, plate_, subcontractID_, creditLimit_, creditRemain_) => {
    let contractDriver = {};
    contractDriver.driverID = driverID_;
    contractDriver.plate = plate_;
    contractDriver.contractID = subcontractID_;
    contractDriver.creditLimit = creditLimit_;
    contractDriver.creditRemain = creditRemain_;
    return contractDriver;
}

// xuất object driver
module.exports.driver = (driverID_, clientID_, name_, residentID_, avatar_, phone_, address_, status_) => {
    let driver = {};
    driver.driverID = driverID_;
    driver.clientID = clientID_;
    driver.name = name_;
    driver.residentID = residentID_;
    driver.avatar = avatar_;
    driver.phone = phone_;
    driver.address = address_;
    driver.status = status_;
    return driver;
}

// xuất object gas station
module.exports.gasStation = (gasStationID_, name_, address_, location_, workingTime_) => {
    let gasStation = {};
    gasStation.gasStationID = gasStationID_;
    gasStation.name = name_;
    gasStation.address = address_;
    gasStation.location = location_;
    gasStation.workingTime = workingTime_;
    return gasStation;
}

// xuất object product
module.exports.product = (productID_, name_, unit_, price_) => {
    let product = {};
    product.productID = productID_;
    product.name = name_;
    product.unit = unit_;
    product.price = price_;
    return product;
}

// xuất object role
module.exports.role = (roleID_, permission_) => {
    let role = {};
    role.roleID = roleID_;
    role.permission = permission_;
    return role;
}

// xuất object user
module.exports.user = (userID_, username_, password_, roleID_) => {
    let user = {};
    user.userID = userID_;
    user.username = username_;
    user.password = password_;
    user.roleID = roleID_;
    return user;
}

// xuất object transport
module.exports.transport = (plate_, clientID_, name_, type_, image_, maxQuantity_) => {
    let transport = {};
    transport.plate = plate_;
    transport.clientID = clientID_;
    transport.name = name_;
    transport.type = type_;
    transport.image = image_;
    transport.maxQuantity = maxQuantity_;
    return transport;
}