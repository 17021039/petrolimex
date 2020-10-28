function row(val1, val2, val3, val4, val5){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="productId" value="' + val5 + '"></td>';
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
        
        axios.post('/getProducts',temp).then(res => {
            let products = res.data.products;
            
            let rows = '';
            for(let product of products) {
                rows += row(product.name, product.code, product.unit, product.price, product.productId);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();


    $(document).on('focus change bulr', '#modal-create input[name=code]', function() {
        axios.post('/checkCode', {code: $(this).val(), type: 'product'})
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



    $('#create').click(function() {
        axios.post('/checkCode', {code: $('#modal-create input[name=code]').val(), type: 'product'})
        .then(res => {
            if(res.data.status) {
                $('#modal-create input[name=code]').addClass('is-invalid');
            } else {
                axios.post('/createProduct', {
                    name: $('#modal-create input[name=name]').val(),
                    code: $('#modal-create input[name=code]').val(),
                    unit: $('#modal-create input[name=unit]').val(),
                    price: $('#modal-create input[name=price]').val()
                }).then((res) => {
                    load();
                    alert(res.data.status);
                })
            }
        })
        
    })

    $('#update').click(function() {
        axios.post('/getProducts', {
            productId: $('#content :checked').val()
        }).then(res => {
            product = res.data.products[0];
            $('#modal-update input[name=productId]').val(product.productId);
            $('#modal-update input[name=name]').val(product.name);
            $('#modal-update input[name=code]').val(product.code);
            $('#modal-update input[name=unit]').val(product.unit);
            $('#modal-update input[name=price]').val(product.price);



        })

    })

    $('#btn-update').click(function() {
        axios.post('/updateProduct', {
            productId: $('#modal-update input[name=productId]').val(),
            name: $('#modal-update input[name=name]').val(),
            code: $('#modal-update input[name=code]').val(),
            unit: $('#modal-update input[name=unit]').val(),
            price: $('#modal-update input[name=price]').val()
        }).then((res) => {
            load();
            alert(res.data.status);
        })

    })
});