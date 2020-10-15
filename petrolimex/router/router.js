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
// các hàm tạo và lấy

router.post('/getBills', controller.getBills);
router.post('/getClients', controller.getClients);
router.post('/getContracts', controller.getContracts);
router.post('/getDrivers', controller.getDrivers);
router.post('/getGasStations', controller.getGasStations);
router.post('/getProducts', controller.getProducts);
router.post('/getRoles', controller.getRoles);
router.post('/getUsers', controller.getUsers);
router.post('/getDividedContracts',controller.getDividedContracts);


router.post('/transaction', controller.transaction);
router.post('/createBill', controller.createBill);

router.get('/getToCreateContract', controller.getToCreateContract);
router.post('/createContract', controller.createContract);

router.post('/getClients_Contracts', controller.getClients_Contracts);
router.post('/getToCreateDividedContract', controller.getToCreateDividedContract);
router.post('/createDividedContract', controller.createDividedContract);

module.exports = router;