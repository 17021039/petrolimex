const express = require('express');
const app = express();
const path = require("path");

const bodyParser = require('body-parser');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// pug
app.set('view engine', 'pug');
app.set('views','./views');

// router
const router = require('./router/router.js');
const { route } = require('./router/router.js');
const port = 6060;

// Set static folder
// app.use(express.static('public'));
app.use('/',express.static(path.join(__dirname)));

app.use('/', router);


app.listen(port, () => {console.table('Connect successfull port ' + port)});

