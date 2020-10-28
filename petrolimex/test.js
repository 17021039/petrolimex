require('dotenv').config();

const get = require('./controllers/get.js');
const getObj = require('./controllers/getObj.js');
const search = require('./controllers/search.js');
const update = require('./controllers/update.js');
const create = require('./controllers/creating.js');
// const creating = require('./controllers/creating.js');

async function print() {
    // let status = await create.createDriver(1,'driver.13','Nguyễn Văn D', '187324234', '30A-441.65', 'avatar', '0324362554', 'đường Cầu Giấy, quận Cầu Giấy, Hà Nội', 'active', 'driver13', '12345678', 'driver', 4);
    // console.log(status);
    // console.log(JSON.stringify(await search.reportCreditDriver(1, new Date('2020-10-02'), new Date('2020-11-24')),null,3));
    console.log(await update.updateDividedContracts([
        {
          dividedContractId: '1',
          creditLimit: 300000000,
          max_transaction: 1000000
        },
        {
          dividedContractId: '2',
          creditLimit: 200000000,
          max_transaction: 1000000
        },
        {
          dividedContractId: '3',
          creditLimit: 200000000,
          max_transaction: 1000000
        }
      ]));
}



print();

// JSON.stringify(,null,1)
// creating.createBill('11', '75A-145.19', '1', '5', '1', 10, '2020-09-19T22:45', 'active');