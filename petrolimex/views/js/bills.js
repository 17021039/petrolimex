function row(val1, val2, val3, val4, val5, val6, val7, val8){
    let row = '<tr class"content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
    row += '<td>' + val6 + '</td>';
    row += '<td>' + val7 + '</td>';
    row += '<td>' + val8 + '</td>';
    row += '</tr>';
    return row
}

$(document).ready(function() {
    let user = JSON.parse(localStorage.getItem('user'));
    
    function load() {
        let temp = {};
        if(user.info) {
            let keyId = user.type + "Id";
            temp[keyId] = user.info[keyId];
        }
        
        axios.post('/getBills',temp).then(res => {
            let bills = res.data.bills;
            bills = bills.map(bill => {
                let date = new Date(bill.transactionDate);
                let str = date.toLocaleDateString().split('/');
                str.unshift(str.splice(1,1))
                bill.transactionDate = date.toLocaleTimeString() + " " + str.join('/');
                return bill;
            })
            let rows = '';
            for(let bill of bills) {
                rows += row(bill.driver.name, bill.contract.name, bill.gasStation.name, bill.product.name, bill.quantity, bill.total, bill.transactionDate, bill.status);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    $('#continue').click(function() {
        axios.post('/transaction', {driverId: $('#submit').val()}).then((res) => {
            let data = res.data;
            $('#driverId').val(data.driver.driverId);
            $('#name').val(data.driver.name);
            $('select[name=contractId] option').remove();
            
            $('select[name=productId] option').remove(); 

            for(let dividedContract of data.driver.dividedContracts) {
                let str = '<option value="' + dividedContract.contract.contractId + '">' + dividedContract.contract.name;
                $('select[name=contractId]').append(str);
            }
        
            $('input[name=gasStationId]').val(user.info.name);
            
            for(let product of data.products) {
                let str = '<option value="' + product.productId + '">' + product.name;
                $('select[name=productId]').append(str);
            }
        })
    })

    $('#create').click(function() {
        axios.post('/createBill', {
            driverId: $('input[name=driverId]').val(),
            contractId: $('select[name=contractId]').val(),
            gasStationId: user.info.gasStationId,
            productId: $('select[name=productId]').val(),
            quantity: $('input[name=quantity]').val(),
            transactionDate: $('input[name=transactionDate]').val(),
            status: $('select[name=status]').val()
        }).then(res => {
            load();
            alert(res.data.status);
        })
    })

});