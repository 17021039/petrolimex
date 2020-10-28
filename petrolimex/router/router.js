const express = require('express');
const controller = require("../controllers/controller.js");
let router = express.Router();


// =====================================================================
// Các hàm login
router.get('/formLogin', controller.formLogin);
router.post('/login', controller.login);


// =====================================================================
// Các hàm gọi trang

router.get('/', controller.show);
router.get('/bills', controller.bills);
router.get('/clients', controller.clients);
router.get('/contracts', controller.contracts);
router.get('/drivers', controller.drivers);
router.get('/gasStations', controller.gasStations);
router.get('/products', controller.products);
router.get('/roles', controller.roles);
router.get('/users', controller.users);
router.get('/dividedContracts',controller.dividedContracts);

// =====================================================================
// các hàm lấy

router.post('/getBills', controller.getBills);
router.post('/statisticBills', controller.statisticBills);
router.post('/getClients', controller.getClients);
router.post('/reportCreditClient', controller.reportCreditClient);
router.post('/getContracts', controller.updateStatusContracts, controller.getContracts);
router.post('/getDrivers', controller.getDrivers);
router.post('/reportCreditDriver', controller.reportCreditDriver);
router.post('/getGasStations', controller.getGasStations);
router.post('/getProducts', controller.getProducts);
router.post('/getRoles', controller.getRoles);
router.post('/getUsers', controller.getUsers);
router.post('/getDividedContracts',controller.getDividedContracts);

router.post('/getPassword', controller.getPassword);

router.post('/transaction', controller.updateStatusContracts, controller.transaction);

router.get('/getToCreateContract', controller.getToCreateContract);

router.post('/getClients_Contracts', controller.updateStatusContracts, controller.getClients_Contracts);
router.post('/getToCreateDividedContract', controller.getToCreateDividedContract);

// =====================================================================
// các hàm kiểm tra

router.post('/checkUsername', controller.checkUsername);
router.post('/checkCode', controller.checkCode);
router.post('/checkTaxId', controller.checkTaxId);

// =====================================================================
// các hàm tạo


router.post('/createClient', controller.createClient);
router.post('/createDriver', controller.createDriver);
router.post('/createGasStation', controller.createGasStation);
router.post('/createProduct', controller.createProduct);
router.post('/createRole', controller.createRole);
router.post('/createUser', controller.createUser);

router.post('/createBill', controller.createBill);

router.post('/createContract', controller.createContract);

router.post('/createDividedContract', controller.createDividedContract);

// =====================================================================
// các hàm update

router.post('/updateClient', controller.updateClient);
router.post('/updateContract', controller.updateContract);
router.post('/destroyContract', controller.destroyContract);
router.post('/updateDriver', controller.updateDriver);
router.post('/updateGasStation', controller.updateGasStation);
router.post('/updateProduct', controller.updateProduct);
router.post('/updateRole', controller.updateRole);
router.post('/updateUser', controller.updateUser);
router.post('/updateDividedContract',controller.updateDividedContract);

module.exports = router;