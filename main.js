function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
function checkCookie(cname) {
    let ck = getCookie(cname);
    if (ck != "") {
        return ck;
    } 
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function submitRegistrationForm(){

    handleSubmitRegistrationForm()
}

async function handleSubmitRegistrationForm() {
    let url = `http://localhost:3000/register`;
    if (document.getElementById('username').value == '' 
        || document.getElementById('password').value == '' ) {
            alert('Oops. Please enter values'); return;
    }
    let user = {
        'username' : document.getElementById('username').value,
        'password' : document.getElementById('password').value,
        'email' : document.getElementById('email').value,
    }

    var xhr = $.post(url, user, function(){
        console.log('connected')
    })

    xhr.then(function(data){
        console.log(data);
        document.getElementById('username').value = ''
        document.getElementById('password').value = ''
        document.getElementById('email').value = ''
        document.getElementById('notification').innerHTML = data.message
    })
}

async function login() {
    let url = `http://localhost:3000/login`;
    let user = {
        'username' : document.getElementById('username').value,
        'password' : document.getElementById('password').value,
        'email' : document.getElementById('email').value,
    }

    var xhr = $.post(url, user, function(){
        console.log('connected')
    })

    xhr.then(function(data){
        console.log(data)
        setCookie('token', data.token, 1);
        setCookie('username', data.username, 1);
        setCookie('userid', data.id, 1);
        document.getElementById('root').innerHTML = `<h4>Welcome ${data.username}</h4>`;
        let btn = document.getElementById('logoutBtn')
        btn.style.display = 'block'
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

    })
    xhr.fail(function(data){
        document.getElementById('root').innerHTML 
            = `<span class="alert alert-danger">Invalid Credentials  ${data.status}</span>`
    })
}

let lgUsername = null;
let token = null;
let userid = null;

function initAppLogin(){
    if (checkCookie('username')) { 
        lgUsername = checkCookie('username') 
    }
    if (checkCookie('token')) { 
        token = checkCookie('token') 
    }
    if (checkCookie('userid')) { 
        userid = checkCookie('userid') 
    }
}
function logOut(){
    setCookie('token', '', -5);
    setCookie('username', '', -5);
    document.getElementById('root').innerHTML = 'Goodbye';   
}


async function getProtectedRoute() {
    let url = `http://localhost:3000/protected`;
    let xhr = $.ajax({ 
        url: url, 
        headers: { 'Authorization': `Bearer ${getCookie('token')}`} 
    }); 

    xhr.then(function(data){

        document.getElementById('root').innerHTML = `<h4>Welcome ${getCookie('username')}</h4>`;
        document.getElementById('root').innerHTML += data;
        
    })

    xhr.fail(function(data){
        document.getElementById('root').innerHTML = `<span class="alert alert-danger">Forbidden resource ${data.status}</span>`
    })
}

if (getCookie('username')) {
    document.getElementById('root').innerHTML = `<h4>Welcome ${getCookie('username')}</h4>`;
    let btn = document.getElementById('logoutBtn')
    btn.style.display = 'block'
}



function showRegister(){

    let hiddenElem = document.querySelectorAll('.register-hide');
    hiddenElem.forEach((el) => {
        el.style.display = 'block'
    })
    logOut()
    document.getElementById('root').innerHTML = '';
    let logBtn = document.getElementById('loginBtn')
        logBtn.style.display = 'none'
}