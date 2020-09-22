const get = require('./get.js');
const create = require('./creating.js');

module.exports.show = (req,res) => {
    res.render('main', {
        messenger: 'Hello World'
    })
}

module.exports.bills = async (req,res) => {
    let bills = await get.getBills('','','','','');
    bills = bills.map(bill => {
        let date = new Date(bill.transactionDate);
        let str = date.toLocaleDateString().split('/');
        str.unshift(str.splice(1,1))
        bill.transactionDate = date.toLocaleTimeString() + " " + str.join('/');
        return bill;
    })
    res.render('bills', {
        messenger: 'Hello World',
        bills: bills
    })
}

module.exports.clients = async (req,res) => {
    let clients = await get.getClients('','');
    res.render('clients', {
        messenger: 'Hello World',
        clients: clients
    })
}

module.exports.grossContracts = async (req,res) => {
    let clientID_ = req.body.clientID;
    let name_ = req.body.name;
    let signedDate_ = req.body.signedDate;
    let startDate_ = req.body.startDate;
    let expiredDate_ = req.body.expiredDate;
    let debtCeiling_ = req.body.debtCeiling;
    let status_ = req.body.status;
    console.log(req.body);
    let status = "";
    if(req.body.submit) {
        status = await create.createGrossContract(clientID_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_);
    }

    let grossContracts = await get.getGrossContracts('','');
    if(req.body.create){
        let clients = await get.getToCreateGrossContracts();

        res.render('grossContracts', {
            messenger: 'Hello World',
            grossContracts: grossContracts,
            clients: JSON.stringify(clients),
            create: true
        })
    } else {
        res.render('grossContracts', {
            messenger: 'Hello World',
            grossContracts: grossContracts,
            create: false
        })
    }
}

module.exports.drivers = async (req,res) => {
    let drivers = await get.getDrivers('','');
    res.render('drivers', {
        messenger: 'Hello World',
        drivers: drivers
    })
}

module.exports.gasStations = async (req,res) => {
    let gasStations = await get.getGasStations('');
    res.render('gasStations', {
        messenger: 'Hello World',
        gasStations: gasStations
    })
}

module.exports.products = async (req,res) => {
    let products = await get.getProducts('');
    res.render('products', {
        messenger: 'Hello World',
        products: products
    })
}

module.exports.roles = async (req,res) => {
    let roles = await get.getRoles('');
    res.render('roles', {
        messenger: 'Hello World',
        roles: roles
    })
}

module.exports.users = async (req,res) => {
    let users = await get.getUsers('','');
    res.render('users', {
        messenger: 'Hello World',
        users: users
    })
}

module.exports.createBill = async (req,res) => {
    let driverID_ = req.body.driverID;
    let plate_ = req.body.plate;
    let driver_plate = await get.getToCreateTransaction(driverID_,plate_);
    let submited = req.body.submited;
    let subcontractID_ = req.body.subcontractID;
    let gasStationID_ = req.body.gasStationID;
    let productID_ = req.body.productID;
    let quantity_ = req.body.quantity;
    let transactionDate_ = req.body.transactionDate;
    let status_ = req.body.status;
    console.log(req.body);
    let status = "";
    if(submited) {
        status = await create.createBill(driverID_, plate_, subcontractID_, gasStationID_, productID_, quantity_, transactionDate_, status_);
    }
    
    let bills = await get.getBills('','','','','');
    bills = bills.map(bill => {
        let date = new Date(bill.transactionDate);
        let str = date.toLocaleDateString().split('/');
        str.unshift(str.splice(1,1))
        bill.transactionDate = date.toLocaleTimeString() + " " + str.join('/');
        return bill;
    })

    if(Object.keys(driver_plate).length !== 0 && !submited) {
        let products = await get.getProducts();
        let gasStations = await get.getGasStations();
        res.render('bills', {
            messenger: 'Hello World',
            bills: bills,
            driver_plate: driver_plate,
            accept_create: true,
            products: products,
            gasStations: gasStations
        })
    } else {
        res.render('bills', {
            messenger: 'Hello World',
            bills: bills,
            accept_create: false
        })
    }
}

module.exports.subcontracts = async (req,res) => {
    let clientID_ = req.body.clientID;
    let name_ = req.body.name;
    let grossContractID_= req.body.grossContractID;
    let createdDate_ = req.body.createdDate;
    let startDate_ = req.body.startDate;
    let expiredDate_ = req.body.expiredDate;
    let debtCeiling_ = req.body.debtCeiling;
    let status_ = req.body.status;
    console.log(req.body);
    let status_save;
    if(req.body.submit) {
        status_save = await create.createSubcontract(grossContractID_, name_, createdDate_, startDate_, expiredDate_, debtCeiling_, status_);
    }
    console.log(status_save);
    let clients = await get.getClients('','');
    let subcontracts = await get.getSubcontracts('','');
    if(req.body.create) {
        let client = await get.getToCreateSubcontract(clientID_);
        console.log(client);
        res.render('subcontracts', {
            messenger: 'Hello World',
            subcontracts: subcontracts,
            clients: clients,
            client: JSON.stringify(client),
            create: true
        })
    } else {
        res.render('subcontracts', {
            messenger: 'Hello World',
            subcontracts: subcontracts,
            clients: clients,
            create: false
        })
    }
    
}

module.exports.contractDrivers = async (req,res) => {
    let contractDrivers = await get.getContractDrivers('','','');
    res.render('contractDrivers', {
        messenger: 'Hello World',
        contractDrivers: contractDrivers
    })
}

module.exports.transports = async (req,res) => {
    let transports = await get.getTransports();
    console.log(transports);
    res.render('transports', {
        messenger: 'Hello World',
        transports: transports
    })
}

function print(str) {
    console.log(str);
}
