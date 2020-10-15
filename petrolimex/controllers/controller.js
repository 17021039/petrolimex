const get = require('./get.js');
const getObj = require('./getObj.js');
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
    res.render('bills', {
        messenger: 'Hello World',
    })
}

module.exports.getBills = async (req,res) => {
    let bills = await getObj.getBills(req.body);

    writeFile("/getBills", "POST", req.body, {bills: bills});
    res.send({bills: bills});
}

module.exports.transaction = async (req,res) => {
    let driverId_ = req.body.driverId;
    let driver = await get.getToCreateTransaction(driverId_);
    let products = await get.getProducts();
    // let gasStations = await get.getGasStations();

    writeFile("/transaction", "POST", req.body, {
        driver: driver,
        products: products
    });

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
    
    console.log(req.body);
    let status = "";
    status = await create.createBill(driverId_, contractId_, gasStationId_, productId_, quantity_, transactionDate_, status_);
    
    writeFile("/createBill", "POST", req.body, {status: status});
    
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

    writeFile("/getClients", "POST", req.body, {clients: clients});
    res.send({clients: clients});
}

//  =========================================================
module.exports.contracts = async (req,res) => {
    
    res.render('contracts', {
        messenger: 'Hello World'
    })
}

module.exports.getContracts = async (req,res) => {
    let contracts = await getObj.getContracts(req.body);
    
    writeFile("/getContracts", "POST", req.body, {contracts: contracts});
    res.send({contracts: contracts});
}

module.exports.getToCreateContract = async (req,res) => {
    let clients = await get.getToCreateContract();

    writeFile("/getToCreateContract", "GET", "", {clients: clients});
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
    
    writeFile("/createContract", "POST", req.body, {status: status});
    res.send({status: status});
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

    writeFile("/getDrivers", "POST", req.body, {drivers: drivers});
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
    let gasStations = await getObj.getGasStations(req.body);

    writeFile("/getGasStations", "POST", req.body, {gasStations: gasStations});
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
    let products = await getObj.getProducts(req.body);

    writeFile("/getProducts", "POST", req.body, {products: products});
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
    let roles = await getObj.getRoles(req.body);

    writeFile("/getRoles", "POST", req.body, {roles: roles});
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
    let users = await getObj.getUsers(req.body);

    writeFile("/getUsers", "POST", req.body, {users: users});
    res.send({users: users});
}




// =========================================================
module.exports.dividedContracts = async (req,res) => {

    res.render('dividedContracts', {
        messenger: 'Hello World'
    })
    
}

module.exports.getDividedContracts = async (req,res) => {
    let dividedContracts = await getObj.getDividedContracts(req.body);

    writeFile("/getDividedContracts", "POST", req.body, {dividedContracts: dividedContracts});
    res.send({dividedContracts: dividedContracts});
    
}

module.exports.getClients_Contracts = async (req,res) => {
    let clients_contracts = await get.getClients_Contracts(req.body.clientId);

    writeFile("/getClients_Contracts", "POST", req.body, {clients_contracts: clients_contracts});
    res.send({clients_contracts: clients_contracts});
}

module.exports.getToCreateDividedContract = async (req,res) => {
    let clientId_ = req.body.clientId;
    let contractId_ = req.body.contractId;
    let list = await get.getToCreateDividedContract(clientId_, contractId_);

    writeFile("/getToCreateDividedContract", "POST", req.body, list);
    res.send(list);
}

module.exports.createDividedContract = async (req,res) => {
    console.log(req.body);
    let status = '';
    status = await create.createDividedContract(req.body.insert);

    writeFile("/createDividedContract", "POST", req.body, {status: status});
    res.send({status: status});
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
        res.send({user: user});
    } else {
        res.send(false);
    }
    
    
}