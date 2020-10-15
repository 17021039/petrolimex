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
        
        axios.post('/getgasStations',temp).then(res => {
            let gasStations = res.data.gasStations;
            
            let rows = '';
            for(let gasStation of gasStations) {
                rows += row(gasStation.name, gasStation.code, gasStation.address, gasStation.location, gasStation.workingTime);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    

});