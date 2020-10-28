axios.post('/reportCreditDriver', {
    driverId: 1,
    startDate: new Date('2020-10-02'),
    finalDate: new Date('2020-11-24')
}).then(res => {
    $('body').append('<p>' + JSON.stringify(res.data, null , 4) + '</p></br>')
})

axios.post('/reportCreditClient', {
    clientId: 1,
    startDate: new Date('2020-10-02'),
    finalDate: new Date('2020-11-24')
}).then(res => {
    $('body').append('<p>' + JSON.stringify(res.data, null , 4) + '</p></br>')
})

axios.post('/statisticBills', {
    driverId: 1,
    clientId: 1,
    gasStationId: 4,
    productId: 1,
    startDate: new Date('2020-10-02'),
    endDate: new Date('2020-11-24')
}).then(res => {
    $('body').append('<p>' + JSON.stringify(res.data, null , 4) + '</p></br>')
})

axios.post('/getPassword', {
    userId: 1
}).then(res => {
    $('body').append('<p>' + JSON.stringify(res.data, null , 4) + '</p></br>')
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