function table(rows) {
    return '<table class="table table-striped table-bordered" style="background-color: #89888885;">' + rows + '</table>';
}

function rowHeader(name, headers = []){
    let row = '<thead class="thead-dark" style="text-align:center;">';
    if(typeof(name) === 'string')
        row += '<tr> <td style="background-color: #62C1F8; font-size: 30px;" colspan="' + headers.length + '"><strong>' + name + '</strong></td></tr>';
    else {
        row += '<tr>';
        for(let temp of name) {
            row += '<td style="background-color: #62C1F8; font-size: 30px;" colspan="' + temp[1] + '"><strong>' + temp[0] + '</strong></td>'
        }
        row += '</tr>';
    }
    row += '<tr>';
    for(let header of headers) {
        row += '<th>' + header + '</th>';
    }
    row += '</tr></thead>';
    return row;
}

function row(vals = []){
    let row = '<tr>';
    for(let val of vals) {
        row += '<td>' + val + '</td>';
    }
    row += '</tr>';
    return row;
}

axios.post('/reportCreditDriver', {
    driverId: 1,
    startDate: new Date('2020-10-02'),
    finalDate: new Date('2020-11-24')
}).then(res => {
    let data = res.data;
    let content = '';
    let rows = rowHeader('Driver',['Name', 'Code']);
    rows += '<tbody>';
    rows += row([data.driver.name, data.driver.code]);
    rows += '</tbody>';
    content += table(rows);
    rows = rowHeader([['Contract',3],['Divided contract',4],['Bill',1]],['Contract', 'Code', 'Status', 'Code', 'Credit limit', 'Credit remain', 'Max transaction','Sum transaction']);
    rows += '<tbody>';
    for(let creditDriver of data.creditDrivers) {
        rows += row([creditDriver.contract.name, creditDriver.contract.code, creditDriver.contract.status, creditDriver.dividedContract.code, creditDriver.dividedContract.creditLimit, creditDriver.dividedContract.creditRemain, creditDriver.dividedContract.max_transaction, creditDriver.sumTransaction]);
    }
    rows += '</tbody>';
    content += table(rows);
    $('#container').append('<div style="border: 4px solid black;border-radius: 40px; padding: 20px; background-color: #E6FBB7;min-width: 840px;margin-top: 10px;margin-bottom: 10px;">'+ content + '</div>');
})

axios.post('/reportCreditClient', {
    clientId: 1,
    startDate: new Date('2020-10-02'),
    finalDate: new Date('2020-11-24')
}).then(res => {
    let data = res.data;
    let content = '';
    let rows = rowHeader('Client',['Name', 'Code', 'Address', 'TaxId', 'Max payment limit', 'DebtCeiling remain']);
    rows += '<tbody>';
    rows += row([data.client.name, data.client.code, data.client.address, data.client.taxId, data.client.max_payment_limit, data.client.debtCeiling_remain]);
    rows += '</tbody>';
    content += table(rows);
    rows = rowHeader('Contract',['Name', 'Code', 'Signed date', 'Start date', 'Expired date', 'debtCeiling', 'Credit remain', 'Status', 'Sum transaction']);
    rows += '<tbody>';
    for(let contract of data.contracts) {
        rows += row([contract.name, contract.code, contract.signedDate, contract.startDate, contract.expiredDate, contract.debtCeiling, contract.creditRemain, contract.status, contract.bills.sumTransaction]);
    }
    rows += '</tbody>';
    content += table(rows);
    $('#container').append('<div style="border: 4px solid black;border-radius: 40px; padding: 20px; background-color: #E6FBB7;min-width: 840px;margin-top: 10px;margin-bottom: 10px;">'+ content + '</div>');
    
})


axios.post('/statisticBills', {
    driverId: 1,
    clientId: 1,
    gasStationId: 4,
    productId: 1,
    startDate: new Date('2020-10-02'),
    endDate: new Date('2020-11-24')
}).then(res => {
    let bills = res.data.bills;
    bills = bills.map(bill => {
        let date = new Date(bill.transactionDate);
        let str = date.toLocaleDateString().split('/');
        str.unshift(str.splice(1,1))
        bill.transactionDate = date.toLocaleTimeString() + " " + str.join('/');
        return bill;
    })
    let rows = rowHeader('Bills',['Driver', 'Contract', 'Gas station', 'Product', 'Quantity', 'Total', 'Transaction date', 'Status']);
    rows += '<tbody>';
    for(let bill of bills) {
        rows += row([bill.driver.name, bill.contract.name, bill.gasStation.name, bill.product.name, bill.quantity, bill.total, bill.transactionDate, bill.status]);
    }
    rows += '</tbody>';
    $('#container').append('<div style="border: 4px solid black;border-radius: 40px; padding: 20px; background-color: #E6FBB7;min-width: 800px;;margin-top: 10px;margin-bottom: 10px;">'+ table(rows) + '</div>');
})





// ===========================================================================================================
$(document).ready(function() {
    let oldPassword = '';

    $('#update').click(function() {
        let user = JSON.parse(localStorage.getItem('user'));
        $('#modal-update input[name=userId]').val(user.userId);
        axios.post('/getPassword', {
            userId: user.userId
        }).then(res => {
            oldPassword = res.data.password;
        })

    })

    $(document).on('focus change bulr keyup', '#modal-update input[name=password]', function() {

        if(oldPassword === this.value) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }

        if($('#modal-update input[name=repassword]').val() !== this.value) {
            $('#modal-update input[name=repassword]').removeClass('is-valid');
            $('#modal-update input[name=repassword]').addClass('is-invalid');
        } else {
            $('#modal-update input[name=repassword]').removeClass('is-invalid');
            $('#modal-update input[name=repassword]').addClass('is-valid');
        }

    })

    $(document).on('keyup change bulr', '#modal-update input[name=repassword]', function() {

        if($('#modal-update input[name=password]').val() !== this.value) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    })

    $('#btn-update').click(function() {
        if($('#modal-update input[name=password]').val() !== '' && $('#modal-update input[name=repassword]').hasClass('is-valid')) {
            axios.post('/updateUser', {
                userId: $('#modal-update input[name=userId]').val(),
                password: $('#modal-update input[name=repassword]').val()
            }).then((res) => {
                alert(res.data.status);
            })
        } else {
            alert('Nhập vào chưa hợp lệ');
        }
    })
})