const express = require('express');
const controller = require("../controllers/controller.js");
let router = express.Router();


router.get ('/', controller.show);
router.get ('/', controller.show);


module.exports = router;