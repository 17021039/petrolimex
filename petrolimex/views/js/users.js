function row(val1, val2, val3, val4, val5){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="userId" value="' + val5 + '"></td>';
    row += '</tr>';
    return row
}


$(document).ready(function() {
    let user = JSON.parse(localStorage.getItem('user'));
    
    function load() {
        let temp = {};
        // if(user.info) {
        //     let keyId = user.type + 'Id';
        //     temp[keyId] = user.info[keyId];
        // }
        
        axios.post('/getUsers',temp).then(res => {
            let users = res.data.users;
            
            let rows = '';
            for(let user of users) {
                rows += row(user.username, user.password, user.type, user.role.permission, user.userId);
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

    $(document).on('focus change bulr', '#modal-update input[name=password]', function() {
        if(user_.password === this.value) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }

    })



    $('#create').click(function() {
        axios.post('/checkUsername', {username: $('#modal-create input[name=username]').val()})
        .then(res => {
            if(res.data.status) {
                $('#modal-create input[name=username]').addClass('is-invalid');
            } else {
                axios.post('/createUser', {
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

    let user_ = {};
    $('#update').click(function() {
        axios.post('/getRoles', {}).then((res) => {
            let roles = res.data.roles;
            $('#modal-update select[name=roleId] option').remove();
            for(let role of roles) {
                let str = '<option value="' + role.roleId + '">' + role.permission + '</option>';
                $('#modal-update select[name=roleId]').append(str);
            }
        }).then(() => {
            axios.post('/getusers', {
                userId: $('#content :checked').val()
            }).then(res => {
                user_ = res.data.users[0];
                $('#modal-update input[name=username]').val(user_.username);
                $('#modal-update input[name=password]').val(user_.password);
                $('#modal-update input[name=type]').val(user_.type);
                $('#modal-update input[name=userId]').val(user_.userId);
                $('#modal-update select[name=roleId]').val(user_.roleId);
    
            })
        })

    })

    $('#btn-update').click(function() {
        if(user_.password === $('#modal-update input[name=password]').val()) {
            $('#modal-update input[name=password]').removeClass('is-valid');
            $('#modal-update input[name=password]').addClass('is-invalid');
        } else {
            axios.post('/updateUser', {
                userId: $('#modal-update input[name=userId]').val(),
                password: $('#modal-update input[name=password]').val(),
                roleId: $('#modal-update select[name=roleId]').val()
            }).then((res) => {
                load();
                alert(res.data.status);
            })
        }
        

    })
});