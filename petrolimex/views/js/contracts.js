function row(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10){
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
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="contractId" value="' + val10 + '"></td>';
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
                rows += row(contract.name, contract.code, contract.client.name, contract.signedDate, contract.startDate, contract.expiredDate, contract.debtCeiling, contract.creditRemain, contract.status, contract.contractId);
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
                let str = '<option value="' + client.clientId + '">' + client.name + '</option>';
                $('#modal-contract select[name=clientId]').append(str);
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
            name: $('#modal-contract input[name=name]').val(),
            code: $('#modal-contract input[name=code]').val(),
            clientId: $('#modal-contract select[name=clientId]').val(),
            signedDate: $('#modal-contract input[name=signedDate]').val(),
            startDate: $('#modal-contract input[name=startDate]').val(),
            expiredDate: $('#modal-contract input[name=expiredDate]').val(),
            debtCeiling: $('#modal-contract input[name=debtCeiling]').val()
            // status: $('select[name=status]').val()
        }).then((res) => {
            load();
            alert(res.data.status);
        })
    })

    $('#update').click(function() {
        axios.post('/getContracts', {
            contractId: $('#content :checked').val()
        }).then(res => {
            let contract = res.data.contracts[0];
            $('#modal-update input[name=contractId]').val(contract.contractId);
            $('#modal-update input[name=name]').val(contract.name);
            $('#modal-update input[name=code]').val(contract.code);
            $('#modal-update input[name=client-name]').val(contract.client.name);
            $('#modal-update input[name=signedDate]').val(contract.signedDate);
            $('#modal-update input[name=signedDate]').attr(contract.signedDate);
            $('#modal-update input[name=startDate]').val(contract.startDate);
            $('#modal-update input[name=expiredDate]').val(contract.expiredDate);
            $('#modal-update input[name=debtCeiling]').val(contract.debtCeiling);
            $('#modal-update input[name=status]').val(contract.status);

            if(contract.status === 'destroy')
                $('#customSwitch1').attr('checked', true);
        })

    })

    $('#btn-update').click(function() {
        axios.post('/updateContract', {
            name: $('#modal-update input[name=name]').val(),
            destroy: $('#customSwitch1')[0].checked,
            contractId: $('#modal-update input[name=contractId]').val()
        }).then(res => {
            load();
            alert(res.data.status);
        })

    })

    $('#destroy').click(function() {
        axios.post('/destroyContract', {
            destroy: true,
            contractId: $('#content :checked').val()
        }).then(res => {
            load();
            alert(res.data.status);
        })

    })

    $('#active').click(function() {
        axios.post('/destroyContract', {
            destroy: false,
            contractId: $('#content :checked').val()
        }).then(res => {
            load();
            alert(res.data.status);
        })

    })


});