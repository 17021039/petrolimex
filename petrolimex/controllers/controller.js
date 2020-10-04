const get = require('./get.js');
const create = require('./creating.js');
const fs = require('fs');

function writeFile(link_, method_, request_, response_) {
    let oldData = fs.readFileSync("./data/data.json",{encoding: "utf-8"});
    if(oldData)
        oldData = JSON.parse(oldData);
    else
        oldData = {}
    oldData["link: " + link_] = {
        method: method_,
        request: request_,
        response: response_ 
    };
    fs.writeFileSync("./data/data.json", JSON.stringify(oldData,null,2), "utf-8");
}

//  =========================================================
module.exports.show = (req,res) => {
    res.render('main', {
        messenger: 'Hello World'
    })
}

//  =========================================================
module.exports.bills = async (req,res) => {
    let bills = await get.getBills();
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

module.exports.getBills = async (req,res) => {
    let bills = await get.getBills();

    // writeFile("/getBills", "GET", "", {bills: bills});
    res.send({bills: bills});
}

module.exports.transaction = async (req,res) => {
    let driverId_ = req.body.driverId;
    let driver = await get.getToCreateTransaction(driverId_);
    let products = await get.getProducts();
    let gasStations = await get.getGasStations();

    // writeFile("/transaction", "POST", req.body, {
    //     driver: driver,
    //     products: products,
    //     gasStations: gasStations
    // });

    res.send({
        driver: driver,
        products: products,
        gasStations: gasStations
    });
}

module.exports.createBill = async (req,res) => {
    let driverId_ = req.body.driverId;
    let contractId_ = req.body.contractId;
    let gasStationId_ = req.body.gasStationId;
    let productId_ = req.body.productId;
    let quantity_ = req.body.quantity;
    let transactionDate_ = req.body.transactionDate;
    let status_ = req.body.status;
    

    let status = "";
    status = await create.createBill(driverId_, contractId_, gasStationId_, productId_, quantity_, transactionDate_, status_);
    
    // writeFile("/createBill", "POST", req.body, {status: status});
    
    res.send({status: status});
}


//  =========================================================

module.exports.clients = async (req,res) => {
    let clients = await get.getClients();
    res.render('clients', {
        messenger: 'Hello World',
        clients: clients
    })
}

module.exports.getClients = async (req,res) => {
    let clients = await get.getClients();

    // writeFile("/getClients", "GET", "", {clients: clients});
    res.send({clients: clients});
}

//  =========================================================
module.exports.contracts = async (req,res) => {
    let contracts = await get.getContracts();
    
    res.render('contracts', {
        messenger: 'Hello World',
        contracts: contracts,
        create: false
    })
}

module.exports.getContracts = async (req,res) => {
    let contracts = await get.getContracts();
    
    // writeFile("/getContracts", "GET", "", {contracts: contracts});
    res.send({contracts: contracts});
}

module.exports.getToCreateContract = async (req,res) => {
    let clients = await get.getToCreateContract();

    // writeFile("/getToCreateContract", "GET", "", {clients: clients});
    res.send({clients: clients});
}

module.exports.createContract = async (req,res) => {
    let clientId_ = req.body.clientId;
    let name_ = req.body.name;
    let code_ = req.body.code;
    let signedDate_ = req.body.signedDate;
    let startDate_ = req.body.startDate;
    let expiredDate_ = req.body.expiredDate;
    let debtCeiling_ = req.body.debtCeiling;
    let status_ = req.body.status;

    let status = "";
    status = await create.createContract(clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_, status_);
    
    // writeFile("/createContract", "POST", req.body, {status: status});
    res.send({status: status});
}
// ==========================================================

module.exports.drivers = async (req,res) => {
    let drivers = await get.getDrivers();
    res.render('drivers', {
        messenger: 'Hello World',
        drivers: drivers
    })
}

module.exports.getDrivers = async (req,res) => {
    let drivers = await get.getDrivers();

    // writeFile("/getDrivers", "GET", "", {drivers: drivers});
    res.send({drivers: drivers});
}

//  =========================================================
module.exports.gasStations = async (req,res) => {
    let gasStations = await get.getGasStations();
    res.render('gasStations', {
        messenger: 'Hello World',
        gasStations: gasStations
    })
}

module.exports.getGasStations = async (req,res) => {
    let gasStations = await get.getGasStations();

    // writeFile("/getGasStations", "GET", "", {gasStations: gasStations});
    res.send({gasStations: gasStations});
}

//  =========================================================
module.exports.products = async (req,res) => {
    let products = await get.getProducts();
    res.render('products', {
        messenger: 'Hello World',
        products: products
    })
}

module.exports.getProducts = async (req,res) => {
    let products = await get.getProducts();

    // writeFile("/getProducts", "GET", "", {products: products});
    res.send({products: products});
}

//  =========================================================
module.exports.roles = async (req,res) => {
    let roles = await get.getRoles();
    res.render('roles', {
        messenger: 'Hello World',
        roles: roles
    })
}

module.exports.getRoles = async (req,res) => {
    let roles = await get.getRoles();

    // writeFile("/getRoles", "GET", "", {roles: roles});
    res.send({roles: roles});
}

//  =========================================================
module.exports.users = async (req,res) => {
    let users = await get.getUsers();
    res.render('users', {
        messenger: 'Hello World',
        users: users
    })
}

module.exports.getUsers = async (req,res) => {
    let users = await get.getUsers();

    // writeFile("/getUsers", "GET", "", {users: users});
    res.send({users: users});
}




// =========================================================
module.exports.dividedContracts = async (req,res) => {
    let dividedContracts = await get.getDividedContracts();

    res.render('dividedContracts', {
        messenger: 'Hello World',
        dividedContracts: dividedContracts,
    })
    
}

module.exports.getDividedContracts = async (req,res) => {
    let dividedContracts = await get.getDividedContracts();

    // writeFile("/getDividedContracts", "GET", "", {dividedContracts: dividedContracts});
    res.send({dividedContracts: dividedContracts});
    
}

module.exports.getClients_Contracts = async (req,res) => {
    let clients_contracts = await get.getClients_Contracts();

    // writeFile("/getClients_Contracts", "GET", "", {clients_contracts: clients_contracts});
    res.send({clients_contracts: clients_contracts});
}

module.exports.getToCreateDividedContract = async (req,res) => {
    let clientId_ = req.body.clientId;
    let contractId_ = req.body.contractId;
    let list = await get.getToCreateDividedContract(clientId_, contractId_);

    // writeFile("/getToCreateDividedContract", "POST", req.body, list);
    res.send(list);
}

module.exports.createDividedContract = async (req,res) => {
    console.log(req.body);
    let status = '';
    status = await create.createDividedContract(req.body.insert);

    // writeFile("/createDividedContract", "POST", req.body, {status: status});
    res.send({status: status});
}

//  =========================================================