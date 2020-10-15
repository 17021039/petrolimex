const get = require('./controllers/get.js');
const getObj = require('./controllers/getObj.js')
// const creating = require('./controllers/creating.js');

async function print() {
    console.log(JSON.stringify(await getObj.getDividedContracts({clientId: 1}),null,2));
}

print();

// JSON.stringify(,null,1)
// creating.createBill('11', '75A-145.19', '1', '5', '1', 10, '2020-09-19T22:45', 'active');