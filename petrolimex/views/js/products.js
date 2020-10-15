function row(val1, val2, val3, val4){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
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
                rows += row(product.name, product.code, product.unit, product.price);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

});