function row(val1, val2){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="roleId" value="' + val2 + '"></td>';
    row += '</tr>';
    return row
}


$(document).ready(function() {
    let user = JSON.parse(localStorage.getItem('user'));
    let roles = [];
    function load() {
        let temp = {};
        // if(user.info) {
        //     let keyId = user.type + 'Id';
        //     temp[keyId] = user.info[keyId];
        // }
        
        axios.post('/getRoles',temp).then(res => {
            roles = res.data.roles;
            
            let rows = '';
            for(let role of roles) {
                rows += row(role.permission, role.roleId);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    $(document).on('focus change bulr', '#modal-create input[name=permission]', function() {

        if(roles.findIndex(role => role.permission === this.value) !== -1) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    })

    $(document).on('focus change bulr', '#modal-update input[name=permission]', function() {
        if(role.permission === this.value) {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
            return true;
        }
        if(roles.findIndex(role => role.permission === this.value) !== -1) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
        return true;
    })

    $('#create').click(function() {
        if(roles.findIndex(role => role.permission === $('#modal-create input[name=permission]').val()) !== -1) {
            $('#modal-create input[name=permission]').addClass('is-invalid');
        } else {
            axios.post('/createRole', {
                permission: $('#modal-create input[name=permission]').val()
            }).then((res) => {
                load();
                alert(res.data.status);
            })
        }
        
    })

    let role = {};
    $('#update').click(function() {
        
        role = roles.find(role => role.roleId.toString() === $('#content :checked').val());
        $('#modal-update input[name=roleId]').val(role.roleId);
        $('#modal-update input[name=permission]').val(role.permission);

    })

    $('#btn-update').click(function() {
        if(roles.findIndex(role => role.permission === $('#modal-update input[name=permission]').val()) === -1) {
            axios.post('/updateRole', {
                roleId: $('#modal-update input[name=roleId]').val(),
                permission: $('#modal-update input[name=permission]').val()
            }).then((res) => {
                load();
                alert(res.data.status);
            })
        }
    })
});