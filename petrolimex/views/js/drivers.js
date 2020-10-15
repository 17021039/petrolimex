function row(val1, val2, val3, val4, val5, val6, val7, val8, val9){
    let row = '<tr class"content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
    row += '<td>' + val6 + '</td>';
    row += '<td>' + val7 + '</td>';
    row += '<td>' + val8 + '</td>';
    row += '<td>' + val9 + '</td>';
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
        
        axios.post('/getDrivers',temp).then(res => {
            let drivers = res.data.drivers;
            
            let rows = '';
            for(let driver of drivers) {
                rows += row(driver.name, driver.code, driver.client.name, driver.residentId, driver.avatar, driver.plate, driver.phone, driver.address, driver.status);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    
    
    

});