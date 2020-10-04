const express = require('express');
const controller = require("../controllers/controller.js");
let router = express.Router();


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

router.get('/getBills', controller.getBills);
router.get('/getClients', controller.getClients);
router.get('/getContracts', controller.getContracts);
router.get('/getDrivers', controller.getDrivers);
router.get('/getGasStations', controller.getGasStations);
router.get('/getProducts', controller.getProducts);
router.get('/getRoles', controller.getRoles);
router.get('/getUsers', controller.getUsers);
router.get('/getDividedContracts',controller.getDividedContracts);


router.post('/transaction', controller.transaction);
router.post('/createBill', controller.createBill);

router.get('/getToCreateContract', controller.getToCreateContract);
router.post('/createContract', controller.createContract);

router.get('/getClients_Contracts', controller.getClients_Contracts);
router.post('/getToCreateDividedContract', controller.getToCreateDividedContract);
router.post('/createDividedContract', controller.createDividedContract);

module.exports = router;