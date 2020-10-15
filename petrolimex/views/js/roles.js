function row(val1){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
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
        
        axios.post('/getRoles',temp).then(res => {
            let roles = res.data.roles;
            
            let rows = '';
            for(let role of roles) {
                rows += row(role.permission);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

});