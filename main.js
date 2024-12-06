function submitRegistrationForm(){

    handleSubmitRegistrationForm()
}

async function handleSubmitRegistrationForm() {
    let url = `http://localhost:3000/register`;
    let user = {
        'username' : document.getElementById('username').value,
        'password' : document.getElementById('password').value,
        'email' : document.getElementById('email').value,
    }
    console.log(user)
    var xhr = $.post(url, user, function(){
        console.log('connected')
    })

    xhr.then(function(data){
        console.log(data)
    })
}

async function login() {
    let url = `http://localhost:3000/login`;
    let user = {
        'username' : document.getElementById('username').value,
        'password' : document.getElementById('password').value,
        'email' : document.getElementById('email').value,
    }
    console.log(user)
    var xhr = $.post(url, user, function(){
        console.log('connected')
    })

    xhr.then(function(data){
        console.log((data))
        setCookie('token', data.token, 1);
        setCookie('username', data.username, 1);
        
    })
}



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
let lgUsername = null;
let token = null;

function initAppLogin(){
    if (checkCookie('username')) { 
        lgUsername = checkCookie('username') 
    }
    if (checkCookie('token')) { 
        token = checkCookie('token') 
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
        console.log(data)
        document.getElementById('root').innerHTML += `<h4>Welcome ${getCookie('username')}</h4>`;
        document.getElementById('root').innerHTML += data;
        
    })

    xhr.fail(function(data){
        document.getElementById('root').innerHTML = `<span class="alert alert-danger">Forbidden resource ${data.status}</span>`
    })
}

if (getCookie('username')) {
    document.getElementById('notification').innerHTML = `<h5>Welcome ${getCookie('username')}</h5>`
}