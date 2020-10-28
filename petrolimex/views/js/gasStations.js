function row(val1, val2, val3, val4, val5, val6){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="gasStationId" value="' + val6 + '"></td>';
    row += '</tr>';
    return row
}


$(document).ready(function() {
    let user = JSON.parse(localStorage.getItem('user'));
    
    function load() {
        let temp = {};
        if(user.info) {
            let keyId = user.type + 'Id';
            temp[keyId] = user.info[keyId];
        }
        
        axios.post('/getgasStations',temp).then(res => {
            let gasStations = res.data.gasStations;
            
            let rows = '';
            for(let gasStation of gasStations) {
                rows += row(gasStation.name, gasStation.code, gasStation.address, gasStation.location, gasStation.workingTime, gasStation.gasStationId);
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
        axios.post('/checkCode', {code: $(this).val(), type: 'gasStation'})
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



    $('#create').click(function() {
        axios.post('/checkUsername', {username: $('#modal-create input[name=username]').val()})
        .then(res => {
            if(res.data.status && !create) {
                $('#modal-create input[name=username]').addClass('is-invalid');
                if(!create)
                    $('#modal-create input[name=code]').addClass('is-invalid');
            } else {
                axios.post('/createGasStation', {
                    name: $('#modal-create input[name=name]').val(),
                    code: $('#modal-create input[name=code]').val(),
                    address: $('#modal-create input[name=address]').val(),
                    location: $('#modal-create input[name=location]').val(),
                    workingTime: $('#modal-create input[name=workingTime]').val(),
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
        axios.post('/getGasStations', {
            gasStationId: $('#content :checked').val()
        }).then(res => {
            gasStation = res.data.gasStations[0];
            $('#modal-update input[name=gasStationId]').val(gasStation.gasStationId);
            $('#modal-update input[name=name]').val(gasStation.name);
            $('#modal-update input[name=code]').val(gasStation.code);
            $('#modal-update input[name=address]').val(gasStation.address);
            $('#modal-update input[name=location]').val(gasStation.location);
            $('#modal-update input[name=workingTime]').val(gasStation.workingTime);



        })

    })

    $('#btn-update').click(function() {
        axios.post('/updateGasStation', {
            gasStationId: $('#modal-update input[name=gasStationId]').val(),
            name: $('#modal-update input[name=name]').val(),
            // code: $('#modal-update input[name=code]').val(),
            address: $('#modal-update input[name=address]').val(),
            location: $('#modal-update input[name=location]').val(),
            workingTime: $('#modal-update input[name=workingTime]').val()
        }).then((res) => {
            load();
            alert(res.data.status);
        })

    })
    

});