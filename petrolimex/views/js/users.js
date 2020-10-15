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
        
        axios.post('/getUsers',temp).then(res => {
            let users = res.data.users;
            
            let rows = '';
            for(let user of users) {
                rows += row(user.username, user.password, user.type, user.role.permission);
            }

            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

});