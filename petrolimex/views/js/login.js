
$(document).ready(function() {
    if(document.cookie.indexOf('userId') === -1) {
        axios.get('/formLogin').then(res => {
            $('body').append('<div class="login"></div>');
            $('div.login').append(res.data);
        })
        
    }

    $(document).on('click', '#signOut, #changeAccount', function() {
        localStorage.removeItem('user');
        axios.get('/formLogin').then(res => {
            $('body').append('<div class="login"></div>');
            $('div.login').append(res.data);
        })
    })
    

    $(document).on('click', "#login",function() {
        let user = $('table.login').find('input');
        let obj = {};
        for(let i = 0; i < user.length; i++) {
            if(user[i.toString()].name) {
                obj[user[i.toString()].name] = user[i.toString()].value;
            }
        }
        axios.post('/login',obj).then(res => {
            if(res.data) {
                $('div.login').remove();
                localStorage.setItem('user', JSON.stringify(res.data.user));
            } else {
                $('div.login table > tr').before('<tr><td colspan="2" style="color:red;background-color:yellow;"><h4>Tài khoản không tồn tại hoặc username, password nhập sai.</h4></td></tr>');
            }
            
        });
    })

})
            