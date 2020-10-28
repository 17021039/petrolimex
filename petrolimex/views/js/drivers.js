
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
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="driverId" value="' + val10 + '"></td>';
    row += '</tr>';
    return row
}


$(document).ready(function() {
    let user = JSON.parse(localStorage.getItem('user'));
    let create = false;
    
    function load() {
        let temp = {};
        if(user.info) {
            if(user.type = 'client')
                temp['clientId'] = user.info['clientId'];
            if(user.type = 'driver')
                temp['driverId'] = user.info['driverId'];
        }
        
        axios.post('/getDrivers',temp).then(res => {
            let drivers = res.data.drivers;
            
            let rows = '';
            for(let driver of drivers) {
                rows += row(driver.name, driver.code, driver.client.name, driver.residentId, driver.avatar, driver.plate, driver.phone, driver.address, driver.status, driver.driverId);
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
            user = JSON.parse(localStorage.getItem('user'));
            $('#modal-create input[name=clientId]').val(user.info.clientId);
            $('#modal-create input[name=client-name]').val(user.info.name);
        })
        
    })

    $(document).on('focus change bulr', '#modal-create input[name=username]', function() {
        axios.post('/checkUsername', {username: $('#modal-create input[name=username]').val()})
        .then(res => {
            if(res.data.status) {
                $('#modal-create input[name=username]').removeClass('is-valid');
                $('#modal-create input[name=username]').addClass('is-invalid');
            } else {
                $('#modal-create input[name=username]').removeClass('is-invalid');
                $('#modal-create input[name=username]').addClass('is-valid');
            }
        })
    })

    $(document).on('focus change bulr', '#modal-create input[name=code]', function() {
        axios.post('/checkCode', {code: $('#modal-create input[name=code]').val(), type: 'driver'})
        .then(res => {
            if(res.data.status) {
                $('#modal-create input[name=code]').removeClass('is-valid');
                $('#modal-create input[name=code]').addClass('is-invalid');
            } else {
                $('#modal-create input[name=code]').removeClass('is-invalid');
                $('#modal-create input[name=code]').addClass('is-valid');
                create = true;
            }
        })
    })

    $('#create').click(function() {
        axios.post('/checkUsername', {username: $('#modal-create input[name=username]').val()})
        .then(res => {
            if(res.data.status && !create) {
                $('#modal-create input[name=username]').addClass('is-invalid');
                if(!create)
                    $('#modal-create input[name=code]').addClass('is-invalid');
            } else {
                axios.post('/createDriver', {
                    name: $('#modal-create input[name=name]').val(),
                    code: $('#modal-create input[name=code]').val(),
                    clientId: $('#modal-create input[name=clientId]').val(),
                    residentId: $('#modal-create input[name=residentId]').val(),
                    avatar: $('#modal-create input[name=avatar]').val(),
                    phone: $('#modal-create input[name=phone]').val(),
                    plate: $('#modal-create input[name=plate]').val(),
                    address: $('#modal-create input[name=address]').val(),
                    status: $('#modal-create select[name=status]').val(),
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

    $('#update').click(function() {
        axios.post('/getDrivers', {
            driverId: $('#content :checked').val()
        }).then(res => {
            let driver = res.data.drivers[0];
            $('#modal-update input[name=client-name]').val(driver.client.name);
            $('#modal-update input[name=name]').val(driver.name);
            $('#modal-update input[name=code]').val(driver.code);
            $('#modal-update input[name=driverId]').val(driver.driverId);
            $('#modal-update input[name=residentId]').val(driver.residentId);
            $('#modal-update input[name=avatar]').val(driver.avatar);
            $('#modal-update input[name=phone]').val(driver.phone);
            $('#modal-update input[name=plate]').val(driver.plate);
            $('#modal-update input[name=address]').val(driver.address);
            $('#modal-update select[name=status]').val(driver.status);


        })

    })

    $('#btn-update').click(function() {
        axios.post('/updateDriver', {
            name: $('#modal-update input[name=name]').val(),
            // code: $('#modal-update input[name=code]').val(),
            driverId: $('#modal-update input[name=driverId]').val(),
            residentId: $('#modal-update input[name=residentId]').val(),
            avatar: $('#modal-update input[name=avatar]').val(),
            phone: $('#modal-update input[name=phone]').val(),
            plate: $('#modal-update input[name=plate]').val(),
            address: $('#modal-update input[name=address]').val(),
            status: $('#modal-update select[name=status]').val()
        }).then((res) => {
            load();
            alert(res.data.status);
        })

    })
    

    // $('#report').click(function() {
    //     axios.post('/reportCreditDrivers', {
    //         driverId: $('#content :checked').val()
    //     }).then(res => {
    //         let driver = res.data.drivers[0];
    //         $('#modal-update input[name=client-name]').val(driver.client.name);
    //         $('#modal-update input[name=name]').val(driver.name);
    //         $('#modal-update input[name=code]').val(driver.code);
    //         $('#modal-update input[name=driverId]').val(driver.driverId);
    //         $('#modal-update input[name=residentId]').val(driver.residentId);
    //         $('#modal-update input[name=avatar]').val(driver.avatar);
    //         $('#modal-update input[name=phone]').val(driver.phone);
    //         $('#modal-update input[name=plate]').val(driver.plate);
    //         $('#modal-update input[name=address]').val(driver.address);
    //         $('#modal-update select[name=status]').val(driver.status);


    //     })

    // })
    

});