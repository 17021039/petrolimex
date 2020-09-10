const { Sequelize, Op} = require('sequelize');
const bills = require('../models/bills.js');
const clients = require('../models/clients.js');
const contracts = require('../models/contracts.js');
const creditClients = require('../models/creditClients.js');
const creditDrivers = require('../models/creditDrivers.js');
const drivers = require('../models/drivers.js');
const gasStations = require('../models/gasStations.js');
const products = require('../models/products.js');
const roles = require('../models/roles.js');
const users = require('../models/users.js');


// tạo role (quyền đăng nhập)
module.exports.createRole = (roleID_, permission_) => {
    roles.created(roleID_, permission_);
}

// tạo user (tài khoản của admin)
module.exports.createUser = (userID_, username_, password_, roleID_) => {
    users.created(userID_, username_, password_, roleID_);
}

// tạo user của client + client (khách hàng)
module.exports.createClient = (clientID_, name_, address_, taxID_, max_payment_limit_, username_, password_, roleID_) => {
    users.created(clientID_, username_, password_, roleID_)
    .then(() => clients.created(clientID_, name_, address_, taxID_, max_payment_limit_));
}

// tạo user của driver + driver (tài xế)
module.exports.createDriver = (driverID_, clientID_, name_, residentID_, avatar_, phone_, address_, plate_, status_, username_, password_, roleID_) => {
    users.created(driverID_, username_, password_, roleID_)
    .then(() => drivers.created(driverID_, clientID_, name_, residentID_, avatar_, phone_, gmail_, address_, plate_, status_));
}

// tạo user của gas station + gas station (cửa hàng xăng dầu)
module.exports.createGasStation = (gasStationID_, name_, address_, location_,workingTime_, username_, password_, roleID_) => {
    users.created(gasStationID_, username_, password_, roleID_)
    .then(() => gasStations.created(gasStationID_, name_, address_, location_, workingTime_));
}

// tạo contract(hợp đồng)
module.exports.createContract = (contractID_, clientID_, startDate_, endDate_, debtCeiling_, status_) => {
    contracts.created(contractID_, clientID_, startDate_, endDate_, status_)
    .then(() => creditClients.created(clientID_, contractID_, debtCeiling_, debtCeiling_));
}

// chia hợp đồng cho tài xế
module.exports.createCreditDriver = (driverID_, contractID_, creditLimit_) => {
    creditDrivers.created(driverID_, contractID_, creditLimit_, creditLimit_);
}

module.exports.selectUsers =  () => {
    return users.findAll().then(list => list.map(obj => obj.dataValues));
}

this.selectUsers().then((data) => {
    console.log(data);
})