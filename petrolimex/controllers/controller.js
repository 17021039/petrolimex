const get = require('./get.js');
const getObj = require('./getObj.js');
const create = require('./creating.js');
const update = require('./update.js');
const search = require('./search.js');
const fs = require('fs');

function writeFile(link_, method_, request_, response_) {
    let oldData = fs.readFileSync("../data.json",{encoding: "utf-8"});
    if(oldData)
        oldData = JSON.parse(oldData);
    else
        oldData = {}
    oldData["link: " + link_] = {
        method: method_,
        request: request_,
        response: response_ 
    };
    fs.writeFileSync("../data.json", JSON.stringify(oldData,null,2), "utf-8");
}

//  =========================================================
module.exports.show = (req,res) => {
    res.render('main', {
        messenger: 'Hello World'
    })
}

//  =========================================================
module.exports.bills = async (req,res) => {
    res.render('bills', {
        messenger: 'Hello World',
    })
}

module.exports.getBills = async (req,res) => {
    let bills = await getObj.getBills(req.body);

    // writeFile("/getBills", "POST", req.body, {bills: bills});
    res.send({bills: bills});
}

module.exports.statisticBills = async (req,res) => {
    let driverId_ = req.body.driverId;
    let gasStationId_ = req.body.gasStationId;
    let clientId_ = req.body.clientId;
    let productId_ = req.body.productId;
    let startDate_ = req.body.startDate;
    let finalDate_ = req.body.finalDate;


    let statisticBills = await search.statisticBills(gasStationId_, driverId_ , clientId_, productId_, startDate_, finalDate_);
    // writeFile("/statisticBills", "POST", req.body, {bills: statisticBills});
    res.send({bills: statisticBills});
}

module.exports.transaction = async (req,res) => {
    let driverId_ = req.body.driverId;
    let driver = await get.getToCreateTransaction(driverId_);
    let products = await get.getProducts();
    // let gasStations = await get.getGasStations();

    // writeFile("/transaction", "POST", req.body, {driver: driver, products: products});

    res.send({
        driver: driver,
        products: products,
        // gasStations: gasStations
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
    let total_ = req.body.total;
    
    console.log(req.body);
    let status = "";
    status = await create.createBill(driverId_, contractId_, gasStationId_, productId_, quantity_, total_, transactionDate_, status_);
    
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
    let clients = await getObj.getClients(req.body);

    // writeFile("/getClients", "POST", req.body, {clients: clients});
    res.send({clients: clients});
}

module.exports.reportCreditClient = async (req,res) => {
    let clientId_ = req.body.clientId;
    let startDate_ = req.body.startDate;
    let finalDate_ = req.body.finalDate;


    let creditClient = await search.reportCreditClient(clientId_, startDate_, finalDate_);
    // writeFile("/reportCreditClient", "POST", req.body, creditClient);
    res.send(creditClient);
}

module.exports.createClient = async (req,res) => {
    let code_ = req.body.code;
    let name_ = req.body.name;
    let address_ = req.body.address;
    let taxId_ = req.body.taxId;
    let max_payment_limit_ = req.body.max_payment_limit;
    let username_ = req.body.username;
    let password_ = req.body.password;
    let roleId_ = req.body.roleId;



    let status = await create.createClient(code_, name_, address_, taxId_, max_payment_limit_, username_, password_, roleId_);
    // writeFile("/createClient", "POST", req.body, {status: status});
    res.send({status: status})
}

module.exports.updateClient = async (req,res) => {
    let clientId_ = req.body.clientId;
    let code_ = req.body.code;
    let name_ = req.body.name;
    let address_ = req.body.address;
    let taxId_ = req.body.taxId;
    let max_payment_limit_ = req.body.max_payment_limit;

    let status = await update.updateClient(clientId_, '', name_, address_, taxId_, max_payment_limit_);
    // writeFile("/updateClient", "POST", req.body, {status: status});
    res.send({status: status})
}

//  =========================================================
module.exports.contracts = async (req,res) => {
    
    res.render('contracts', {
        messenger: 'Hello World'
    })
}

module.exports.getContracts = async (req,res) => {
    let contracts = await getObj.getContracts(req.body);
    
    // writeFile("/getContracts", "POST", req.body, {contracts: contracts});
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

    let status = "";
    status = await create.createContract(clientId_, code_, name_, signedDate_, startDate_, expiredDate_, debtCeiling_);
    
    // writeFile("/createContract", "POST", req.body, {status: status});
    res.send({status: status});
}

module.exports.updateContract = async (req,res) => {
    let contractId_ = req.body.contractId;
    let name_ = req.body.name;
    let destroy_ = req.body.destroy;

    let status = await update.updateContract(contractId_, name_, destroy_);
    // writeFile("/updateContract ", "POST", req.body, {status: status});

    res.send({status: status})
}

module.exports.updateStatusContracts = (req, res, next) => {
    update.updateStatusContracts();
    next();
}

module.exports.destroyContract = async (req, res) => {
    let contractId_ = req.body.contractId;
    let destroy_ = req.body.destroy;

    let status = await update.destroyContract(contractId_, destroy_);
    // writeFile("/destroyContract", "POST", req.body, {status: status});
    res.send({status: status})
}

// ==========================================================

module.exports.drivers = async (req,res) => {

    res.render('drivers', {
        messenger: 'Hello World'
    })
}

module.exports.getDrivers = async (req,res) => {
    console.log(req.body);
    let drivers = await getObj.getDrivers(req.body);

    // writeFile("/getDrivers", "POST", req.body, {drivers: drivers});
    res.send({drivers: drivers});
}

module.exports.reportCreditDriver = async (req,res) => {
    let driverId_ = req.body.driverId;
    let startDate_ = req.body.startDate;
    let finalDate_ = req.body.finalDate;


    let creditDriver = await search.reportCreditDriver(driverId_, startDate_, finalDate_);
    // writeFile("/reportCreditDriver", "POST", req.body, creditDriver);
    res.send(creditDriver);
}

module.exports.createDriver = async (req,res) => {
    let clientId_ = req.body.clientId;
    let code_ = req.body.code;
    let name_ = req.body.name;
    let plate_ = req.body.plate;
    let residentId_ = req.body.residentId;
    let avatar_ = req.body.avatar;
    let phone_ = req.body.phone;
    let address_ = req.body.address;
    let status_ = req.body.status;
    let username_ = req.body.username;
    let password_ = req.body.password;
    let roleId_ = req.body.roleId;

    

    let status = await create.createDriver(clientId_, code_, name_, residentId_, plate_, avatar_, phone_, address_, status_, username_, password_, roleId_);
    // writeFile("/createDriver", "POST", req.body, {status: status});
    res.send({status: status})
}

module.exports.updateDriver = async (req,res) => {
    let driverId_ = req.body.driverId;
    let code_ = req.body.code;
    let name_ = req.body.name;
    let residentId_ = req.body.residentId;
    let plate_ = req.body.plate;
    let avatar_ = req.body.avatar;
    let phone_ = req.body.phone;
    let address_ = req.body.address;
    let status_ = req.body.status;

    let status = await update.updateDriver(driverId_, '', name_, residentId_, plate_, avatar_, phone_, address_, status_);
    // writeFile("/updateDriver", "POST", req.body, {status: status});
    res.send({status: status})
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
    let gasStations = await getObj.getGasStations(req.body);

    // writeFile("/getGasStations", "POST", req.body, {gasStations: gasStations});
    res.send({gasStations: gasStations});
}

module.exports.createGasStation = async (req,res) => {
    let code_ = req.body.code;
    let name_ = req.body.name;
    let workingTime_ = req.body.workingTime;
    let address_ = req.body.address;
    let location_ = req.body.location;
    let username_ = req.body.username;
    let password_ = req.body.password;
    let roleId_ = req.body.roleId;

    let status = await create.createGasStation(code_, name_, address_, location_,workingTime_, username_, password_, roleId_);
    // writeFile("/createGasStation", "POST", req.body, {status: status});
    res.send({status: status})
}

module.exports.updateGasStation = async (req,res) => {
    let gasStationId_ = req.body.gasStationId;
    let code_ = req.body.code;
    let name_ = req.body.name;
    let location_ = req.body.location;
    let address_ = req.body.address;
    let workingTime_ = req.body.workingTime;

    let status = await update.updateGasStation(gasStationId_, '', name_, address_, location_, workingTime_);
    // writeFile("/updateGasStation", "POST", req.body, {status: status});
    res.send({status: status})
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
    let products = await getObj.getProducts(req.body);

    // writeFile("/getProducts", "POST", req.body, {products: products});
    res.send({products: products});
}

module.exports.createProduct = async (req,res) => {
    let code_ = req.body.code;
    let name_ = req.body.name;
    let unit_ = req.body.unit;
    let price_ = req.body.price;

    let status = await create.createProduct(code_, name_, unit_, price_);
    // writeFile("/createProduct", "POST", req.body, {status: status});
    res.send({status: status})
}

module.exports.updateProduct = async (req,res) => {
    let productId_ = req.body.productId;
    let code_ = req.body.code;
    let name_ = req.body.name;
    let unit_ = req.body.unit;
    let price_ = req.body.price;

    let status = await update.updateProduct(productId_, '', name_, unit_, price_);
    // writeFile("/updateProduct", "POST", req.body, {status: status});
    res.send({status: status})
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
    let roles = await getObj.getRoles(req.body);

    // writeFile("/getRoles", "POST", req.body, {roles: roles});
    res.send({roles: roles});
}

module.exports.createRole = async (req,res) => {
    let permission_ = req.body.permission;

    let status = await create.createRole(permission_);
    // writeFile("/createRole", "POST", req.body, {status: status});
    res.send({status: status})
}

module.exports.updateRole = async (req,res) => {
    let roleId_ = req.body.roleId;
    let permission_ = req.body.permission;

    let status = await update.updateRole(roleId_, permission_);
    // writeFile("/updateRole", "POST", req.body, {status: status});
    res.send({status: status})
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
    let users = await getObj.getUsers(req.body);

    // writeFile("/getUsers", "POST", req.body, {users: users});
    res.send({users: users});
}

module.exports.createUser = async (req,res) => {
    let username_ = req.body.username;
    let password_ = req.body.password;
    let roleId_ = req.body.roleId;

    let status = await create.createUser(username_, password_, roleId_);
    // writeFile("/createUser", "POST", req.body, {status: status});
    res.send({status: status})
}

module.exports.updateUser = async (req,res) => {
    let userId_ = req.body.userId;
    // let username_ = req.body.username;
    let password_ = req.body.password;
    let roleId_ = req.body.roleId;

    let status = await update.updateUser(userId_, '', password_, roleId_);
    // writeFile("/updateUser", "POST", req.body, {status: status});
    res.send({status: status})
}


// =========================================================
module.exports.dividedContracts = async (req,res) => {

    res.render('dividedContracts', {
        messenger: 'Hello World'
    })
    
}

module.exports.getDividedContracts = async (req,res) => {
    let dividedContracts = await getObj.getDividedContracts(req.body);

    // writeFile("/getDividedContracts", "POST", req.body, {dividedContracts: dividedContracts});
    res.send({dividedContracts: dividedContracts});
    
}

module.exports.getClients_Contracts = async (req,res) => {
    let clients_contracts = await get.getClients_Contracts(req.body.clientId);

    // writeFile("/getClients_Contracts", "POST", req.body, {clients_contracts: clients_contracts});
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
    let status = {};
    status.insert = await create.createDividedContracts(req.body.insert);
    status.update = await update.updateDividedContracts(req.body.update);

    // writeFile("/createDividedContract", "POST", req.body, {status: status});
    res.send({status: status});
}

module.exports.updateDividedContract = async (req,res) => {
    let dividedContractId_ = req.body.dividedContractId;
    let creditLimit_ = req.body.creditLimit;
    let max_transaction_ = req.body.max_transaction;

    let status = await update.updateDividedContract(dividedContractId_, '', creditLimit_, '', max_transaction_);

    // writeFile("/updateDividedContract", "POST", req.body, {status: status});
    res.send({status: status})
}

//  =========================================================
module.exports.formLogin = (req,res) => {
    let formLogin = '';
    formLogin += '<div class="modal fade show" tabindex="-1" aria-labelledby="modalTitle" style="display: block;" aria-modal="true" role="dialog">';
    formLogin += '<div class="modal-dialog modal-dialog-centered" style="max-width: 500px;min-width: 400px">';
    formLogin += '<form class="modal-content">';
    formLogin += '<div class="modal-header" style="justify-content: center;">';
    formLogin += '<h3 class="modal-title" id="modalTitle" >Login</h3>';
    formLogin += '</div>';
    formLogin += '<div class="modal-body" style="padding: 0px;">';
    formLogin += '<table class="table table-borderless login" style="margin-bottom: 0px; font-size: 20px;">';
    formLogin += '<tr>';
    formLogin += '<td style="width: 60px;padding-top: 15px;"><strong>Username:</strong></td>';
    formLogin += '<td><input class="form-control" type="text" name="username" autocomplete="username" required></td>';
    formLogin += '</tr>';
    formLogin += '<tr>';
    formLogin += '<td style="width: 60px;padding-top: 15px;"><strong>Password:</strong></td>';
    formLogin += '<td><input class="form-control" type="password" name="password" autocomplete="current-password"></td>';
    formLogin += '</tr>';
    formLogin += '<tr>';
    formLogin += '<td colspan="2" style="text-align: center;"><a href="/users" style="color: blue;">Quên tài khoản.</a></td>';
    formLogin += '</tr>';
    formLogin += '</table>';
    formLogin += '</div>';
    formLogin += '<div class="modal-footer" style="justify-content: center;">';
    formLogin += '<button id="login" type="button" class="btn btn-success w-25">Login</button>';
    formLogin += '</div>';
    formLogin += '</div>';
    formLogin += '</form>';
	formLogin += '</div>';

	formLogin += '<div class="modal-backdrop fade show"></div>';

    res.clearCookie('userId');
    res.send(formLogin);
}


module.exports.login = async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    user = await get.getUser(username,password);

    if(Object.keys(user).length !== 0) {
        res.cookie('userId', JSON.stringify(user.userId));
        // writeFile("/login", "POST", req.body, {user: user});
        res.send({user: user});
    } else {
        // writeFile("/login", "POST", req.body, {status: false});
        res.send({status: false});
    }
}

module.exports.getPassword = async (req,res) => {
    let userId_ = req.body.userId;

    let password = false;
    password = await get.getPassword(userId_);
    // writeFile("/getPassword", "POST", req.body, password);
    res.send(password);
}

module.exports.checkUsername = async (req,res) => {
    let username_ = req.body.username;

    let status = false;
    status = await get.checkUsername(username_);
    // writeFile("/checkUsername", "POST", req.body, {status: status});
    res.send({status: status});
}

module.exports.checkCode = async (req,res) => {
    let code_ = req.body.code;
    let type_ = req.body.type;

    let status = false;
    status = await get.checkCode(code_, type_);
    // writeFile("/checkCode", "POST", req.body, {status: status});
    res.send({status: status});
}

module.exports.checkTaxId = async (req,res) => {
    let taxId_ = req.body.taxId;

    let status = false;
    status = await get.checkTaxId(taxId_);
    // writeFile("/checkTaxId", "POST", req.body, {status: status});
    res.send({status: status});
}