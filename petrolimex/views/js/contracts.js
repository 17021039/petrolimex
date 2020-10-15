function row(val1, val2, val3, val4, val5, val6, val7, val8, val9){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
    row += '<td>' + val6 + '</td>';
    row += '<td>' + val7 + '</td>';
    row += '<td>' + val8 + '</td>';
    row += '<td>' + val9 + '</td>';
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
        
        axios.post('/getContracts',temp).then(res => {
            let contracts = res.data.contracts;
            
            let rows = '';
            for(let contract of contracts) {
                rows += row(contract.name, contract.code, contract.client.name, contract.signedDate, contract.startDate, contract.expiredDate, contract.debtCeiling, contract.creditRemain, contract.status);
            }

            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();
    
    let data;
    $('#start').click(function() {

        axios.get('/getToCreateContract').then((res) => {
            data = res.data;
            for(let client of data.clients) {
                let str = '<option value="' + client.clientId + '">' + client.name;
                $('select[name=clientId]').append(str);
            }
            $('#number_remain').val(data.clients[0].debtCeiling_remain);
            $('#number').attr('max', data.clients[0].debtCeiling_remain);


        })
        
    })
    

    $('#clientId').on('change', function() {
        let clientId = parseInt(this.value);
        for(client of data.clients) {
            if(client.clientId === clientId){
                $('#number').attr('max',client.debtCeiling_remain);
                $('#number_remain').val(client.debtCeiling_remain);
                break;
            }
        }
        
    })
    
    $('#create').click(function() {
        axios.post('/createContract', {
            name: $('input[name=name]').val(),
            code: $('input[name=code]').val(),
            clientId: $('select[name=clientId]').val(),
            signedDate: $('input[name=signedDate]').val(),
            startDate: $('input[name=startDate]').val(),
            expiredDate: $('input[name=expiredDate]').val(),
            debtCeiling: $('input[name=debtCeiling]').val(),
            status: $('select[name=status]').val()
        }).then((res) => {
            load();
            alret(res.data.status);
        })
    })

});