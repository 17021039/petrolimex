function row(val1, val2, val3, val4, val5, val6, val7){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
    row += '<td>' + val6 + '</td>';
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="clientId" value="' + val7 + '"></td>';
    row += '</tr>';
    return row
}


$(document).ready(function() {
    let user = JSON.parse(localStorage.getItem('user'));
    
    function load() {
        let temp = {};
        if(user.info) {
            let keyId = 'clientId';
            temp[keyId] = user.info[keyId];
        }
        
        axios.post('/getClients',temp).then(res => {
            let clients = res.data.clients;
            
            let rows = '';
            for(let client of clients) {
                rows += row(client.name, client.code, client.address, client.taxId, client.max_payment_limit, client.debtCeiling_remain, client.clientId);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    $('#start').click(function() {

        axios.post('/getRoles', {}).then((res) => {
            let roles = res.data.roles;
            $('#modal-create select[name=roleId] option').remove();
            for(let role of roles) {
                let str = '<option value="' + role.roleId + '">' + role.permission + '</option>';
                $('#modal-create select[name=roleId]').append(str);
            }
        })
        
    })

    $(document).on('focus change bulr', '#modal-create input[name=username]', function() {
        axios.post('/checkUsername', {username: $(this).val()})
        .then(res => {
            if(res.data.status) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        })
    })

    let create = false;
    $(document).on('focus change bulr', '#modal-create input[name=code]', function() {
        axios.post('/checkCode', {code: $(this).val(), type: 'client'})
        .then(res => {
            if(res.data.status) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
                create = false;
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
                create = true;
            }
        })
    })

    $(document).on('focus change bulr', '#modal-create input[name=taxId]', function() {
        axios.post('/checkTaxId', {taxId: $(this).val()})
        .then(res => {
            if(res.data.status) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
                create = true;
            }
        })
    })

    $(document).on('focus change bulr', '#modal-update input[name=taxId]', function() {
        if($(this).val() === client.taxId) {
            $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
                create = true;
                return true;
        }
        axios.post('/checkTaxId', {taxId: $(this).val()})
        .then(res => {
            if(res.data.status) {
                $(this).removeClass('is-valid');
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
                create = true;
            }
        })
        return true;
    })

    $('#create').click(function() {
        axios.post('/checkUsername', {username: $('#modal-create input[name=username]').val()})
        .then(res => {
            if(res.data.status && !create) {
                $('#modal-create input[name=username]').addClass('is-invalid');
                if(!create)
                    $('#modal-create input[name=code]').addClass('is-invalid');
            } else {
                axios.post('/createClient', {
                    name: $('#modal-create input[name=name]').val(),
                    code: $('#modal-create input[name=code]').val(),
                    taxId: $('#modal-create input[name=taxId]').val(),
                    address: $('#modal-create input[name=address]').val(),
                    max_payment_limit: $('#modal-create input[name=max_payment_limit]').val(),
                    username: $('#modal-create input[name=username]').val(),
                    password: $('#modal-create input[name=password]').val(),
                    roleId: $('#modal-create select[name=roleId]').val()
                }).then((res) => {
                    load();
                    alert(res.data.status);
                })
            }
        })
        
    })

    let client = {};
    $('#update').click(function() {
        axios.post('/getClients', {
            clientId: $('#content :checked').val()
        }).then(res => {
            client = res.data.clients[0];
            $('#modal-update input[name=name]').val(client.name);
            $('#modal-update input[name=code]').val(client.code);
            $('#modal-update input[name=clientId]').val(client.clientId);
            $('#modal-update input[name=taxId]').val(client.taxId);
            $('#modal-update input[name=address]').val(client.address);
            $('#modal-update input[name=max_payment_limit]').val(client.max_payment_limit);
            $('#modal-update input[name=max_payment_limit]').attr('min',client.max_payment_limit - client.debtCeiling_remain);



        })

    })

    $('#btn-update').click(function() {
        axios.post('/updateClient', {
            name: $('#modal-update input[name=name]').val(),
            // code: $('#modal-update input[name=code]').val(),
            clientId: $('#modal-update input[name=clientId]').val(),
            taxId: $('#modal-update input[name=taxId]').val(),
            address: $('#modal-update input[name=address]').val(),
            max_payment_limit: $('#modal-update input[name=max_payment_limit]').val()
        }).then((res) => {
            load();
            alert(res.data.status);
        })

    })

});