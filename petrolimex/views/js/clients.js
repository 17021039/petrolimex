function row(val1, val2, val3, val4, val5){
    let row = '<tr class"content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
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
        
        axios.post('/getClients',temp).then(res => {
            let clients = res.data.clients;
            
            let rows = '';
            for(let client of clients) {
                rows += row(client.name, client.code, client.address, client.taxId, client.max_payment_limit);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    

});