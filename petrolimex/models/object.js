 
// xuất object bill
module.exports.bill = (billId_, driverId_, contractId_, gasStationId_, productId_, quantity_, total_, transactionDate_, status_) => {
    let bill = {};
    if(billId_)
        bill.billId = billId_;
    if(driverId_)
        bill.driverId = driverId_;
    if(contractId_)
        bill.contractId = contractId_;
    if(gasStationId_)
        bill.gasStationId = gasStationId_;
    if(productId_)
        bill.productId = productId_;
    if(quantity_)
        bill.quantity = quantity_;
    if(total_)
        bill.total = total_;
    if(transactionDate_)
        bill.transactionDate = transactionDate_;
    if(status_)
        bill.status = status_;
    return bill;
}

// xuất object client
module.exports.client = (clientId_, code_, userId_, name_, address_, taxId_, max_payment_limit_) => {
    let client = {};
    if(clientId_)
        client.clientId = clientId_;
    if(userId_)
        client.userId = userId_;
    if(code_)
        client.code = code_;
    if(name_)
        client.name = name_;
    if(address_)
        client.address = address_;
    if(taxId_)
        client.taxId = taxId_;
    if(max_payment_limit_)
        client.max_payment_limit = max_payment_limit_;
    return client;
}

// xuất object contract
module.exports.contract = (contractId_, clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_) => {
    let contract = {};
    if(contractId_)
        contract.contractId = contractId_;
    if(clientId_)
        contract.clientId = clientId_;
    if(code_)
        contract.code = code_;
    if(name_)
        contract.name = name_;
    if(signedDate_)
        contract.signedDate = signedDate_;
    if(startDate_)
        contract.startDate = startDate_;
    if(expiredDate_)
        contract.expiredDate = expiredDate_;
    if(debtCeiling_)
        contract.debtCeiling = debtCeiling_;
    if(status_)
        contract.status = status_;
    return contract;
}


// xuất object dividedContract
module.exports.dividedContract = (dividedContractId_ , driverId_, code_, contractId_, creditLimit_, creditRemain_, max_transaction_) => {
    let dividedContract = {};
    if(dividedContractId_)
        dividedContract.dividedContractId = dividedContractId_;
    if(driverId_)
        dividedContract.driverId = driverId_;
    if(contractId_)
        dividedContract.contractId = contractId_;
    if(code_)
        dividedContract.code = code_;
    if(creditLimit_)
        dividedContract.creditLimit = creditLimit_;
    if(creditRemain_)
        dividedContract.creditRemain = creditRemain_;
    if(max_transaction_)
        dividedContract.max_transaction = max_transaction_;
    return dividedContract;
}

// xuất object driver
module.exports.driver = (driverId_, clientId_, code_, userId_, name_, residentId_, plate_, avatar_, phone_, address_, status_) => {
    let driver = {};
    if(driverId_)
        driver.driverId = driverId_;
    if(clientId_)
        driver.clientId = clientId_;
    if(userId_)
        driver.userId = userId_;
    if(code_)
        driver.code = code_;
    if(name_)
        driver.name = name_;
    if(residentId_)
        driver.residentId = residentId_;
    if(plate_)
        driver.plate = plate_;
    if(avatar_)
        driver.avatar = avatar_;
    if(phone_)
        driver.phone = phone_;
    if(address_)
        driver.address = address_;
    if(status_)
        driver.status = status_;
    return driver;
}

// xuất object gas station
module.exports.gasStation = (gasStationId_, userId_, code_, name_, address_, location_, workingTime_) => {
    let gasStation = {};
    if(gasStationId_)
        gasStation.gasStationId = gasStationId_;
    if(userId_)
        gasStation.userId = userId_;
    if(code_)
        gasStation.code = code_;
    if(name_)
        gasStation.name = name_;
    if(address_)
        gasStation.address = address_;
    if(location_)
        gasStation.location = location_;
    if(workingTime_)
        gasStation.workingTime = workingTime_;
    return gasStation;
}

// xuất object product
module.exports.product = (productId_, code_, name_, unit_, price_) => {
    let product = {};
    if(productId_)
        product.productId = productId_;
    if(code_)
        product.code = code_;
    if(name_)
        product.name = name_;
    if(unit_)
        product.unit = unit_;
    if(price_)
        product.price = price_;
    return product;
}

// xuất object role
module.exports.role = (roleId_, permission_) => {
    let role = {};
    if(roleId_)
        role.roleId = roleId_;
    if(permission_)
        role.permission = permission_;
    return role;
}

// xuất object user
module.exports.user = (userId_, username_, password_, type_, roleId_) => {
    let user = {};
    if(userId_)
        user.userId = userId_;
    if(username_)
        user.username = username_;
    if(password_)
        user.password = password_;
    if(type_)
        user.type = type_;
    if(roleId_)
        user.roleId = roleId_;
    return user;
}

module.exports.containKeys = (nameObj, listKeys = [], required = false, get = false) => {
    let keys = {
        role: ['roleId', 'permission'],
        user: ['userId', 'username', 'password', 'type', 'roleId'],
        product: ['productId', 'code', 'name', 'unit', 'price'],
        driver: ['driverId', 'clientId', 'code', 'userId', 'name', 'residentId', 'plate', 'avatar', 'phone', 'address', 'status'],
        client: ['clientId', 'code', 'userId', 'name', 'address', 'taxId', 'max_payment_limit'],
        gasStation: ['gasStationId', 'userId', 'code', 'name', 'address', 'location', 'workingTime'],
        contract: ['contractId', 'clientId', 'code', 'name', 'signedDate', 'startDate', 'expiredDate', 'debtCeiling', 'status'],
        dividedContract: ['dividedContractId' , 'driverId', 'code', 'contractId', 'creditLimit', 'creditRemain', 'max_transaction'],
        bill: ['billId', 'driverId', 'contractId', 'gasStationId', 'productId', 'quantity', 'total', 'transactionDate', 'status']
    }

    let requiredKeys = {
        role: ['permission'],
        user: ['username', 'password', 'type', 'roleId'],
        product: ['code', 'name', 'unit', 'price'],
        driver: ['clientId', 'code', 'name', 'userId', 'residentId', 'plate', 'phone', 'status'],
        client: ['code', 'name', 'userId', 'taxId', 'max_payment_limit'],
        gasStation: ['userId', 'name', 'code', 'workingTime'],
        contract: ['clientId', 'code', 'name', 'startDate', 'expiredDate', 'debtCeiling', 'status'],
        dividedContract: ['driverId', 'code', 'contractId', 'creditLimit', 'creditRemain', 'max_transaction'],
        bill: ['driverId', 'contractId', 'gasStationId', 'productId', 'quantity', 'total', 'transactionDate', 'status']
    }

    let getKeys = {
        role: ['roleId', 'permission'],
        user: ['userId', 'username', 'password', 'type', 'roleId'],
        product: ['productId', 'code', 'name', 'unit', 'price'],
        driver: ['driverId', 'clientId', 'code', 'userId', 'name', 'residentId', 'plate', 'avatar', 'phone', 'address', 'status'],
        client: ['clientId', 'code', 'userId', 'name', 'address', 'taxId', 'max_payment_limit'],
        gasStation: ['gasStationId', 'userId', 'code', 'name', 'address', 'location', 'workingTime'],
        contract: ['driverId', 'contractId', 'clientId', 'code', 'name', 'signedDate', 'startDate', 'expiredDate', 'debtCeiling', 'status'],
        dividedContract: ['clientId' ,'dividedContractId' , 'driverId', 'code', 'contractId', 'creditLimit', 'creditRemain', 'max_transaction'],
        bill: ['clientId', 'billId', 'driverId', 'contractId', 'gasStationId', 'productId', 'quantity', 'total', 'transactionDate', 'status']
    }

    if(get) {
        let list = getKeys[nameObj];
        for(let element of listKeys) {
            if(list.indexOf(element) === -1)
                return false;
        }
        return true;
    } else {
        if(!required) {
            let list = keys[nameObj];
            for(let element of listKeys) {
                if(list.indexOf(element) === -1)
                    return false;
            }
            return true;
        }  
        else {
            let list = keys[nameObj];
            for(let element of listKeys) {
                if(list.indexOf(element) === -1)
                    return false;
            }
            list = requiredKeys[nameObj];
            for(let element of list) {
                if(listKeys.indexOf(element) === -1)
                    return false;
            }
    
            return true;
        }
    }

    
}