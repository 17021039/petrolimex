const express = require('express');
const controller = require("../controllers/controller.js");
let router = express.Router();


router.get('/', controller.show);
router.get('/bills', controller.createBill);
router.get('/clients', controller.clients);
router.get('/grossContracts', controller.grossContracts);
router.get('/drivers', controller.drivers);
router.get('/gasStations', controller.gasStations);
router.get('/products', controller.products);
router.get('/roles', controller.roles);
router.get('/users', controller.users);
router.get('/subcontracts', controller.subcontracts);
router.get('/contractDrivers', controller.contractDrivers);
router.get('/transports', controller.transports);

router.post('/bills', controller.createBill);
router.post('/clients', controller.clients);
router.post('/grossContracts', controller.grossContracts);
router.post('/subcontracts', controller.subcontracts);
module.exports = router;