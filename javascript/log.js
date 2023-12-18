function registerUser() {
    username = $('#usernameSignUp').val()
    password = $('#passwordSignUp').val()
    password2 = $('#password2SignUp').val()
    phonenumber = $('#phoneNumberSignUp').val()
    email = $('#emailSignUp').val()
    adress = $('#adressSignUp').val()
    
    var users = getUsers()
    
    if (username == '' || password == '' || password2 == '' || phonenumber == '' || email == '' || adress == '') {
        alert('Missing parameter')
        return false 
    }
    
    if (password != password2) {
        alert("Passwords don't match")
        return false
    }

    var newUser = {
        'Username' : username,
        'Password' : password,
        'PhoneNumber' : phonenumber,
        'Email' : email,
        'Adress' : adress,
        'Cars': [],
        'PendingOrders': []
    }

    var user = getUserByUsername(username)
    if (user != undefined) {
        alert('Já existe este username registrado')
        return false
    }
    else {
        users.push(newUser)
        setUsers(users)
        return true
    }
}

function removeUser(u) {
    us = getUsers()
    newUsers = removeItem(us,u)
    setUsers(newUsers)
}

function validateSignIn() {
    var username = $('#usernameSignIn').val()
    var password = $('#passwordSignIn').val()

    var u = getUserByUsername(username)

    if (u == undefined) {
        alert('Usuário não registrado')
        return false
    }

    if (u.Password != password) {
        alert('Password incorreta')
        return false
    }

    localStorage.setItem('activeAccount', JSON.stringify(u))
    return true
}

function singOut() {
    localStorage.setItem('activeAccount', null)
}

// Getters and setters
function getActiveAccount(){
    return JSON.parse(localStorage.getItem('activeAccount'))
}

function getUsers() { 
    var users = localStorage.getItem('users')
    
    if (users == null) {
        setUsers([])
        return []
    }

    else {
        return JSON.parse(users)
    }
}

function getUserByUsername(u) { 
    // Returns undefined is no users with said username are found
    return getUsers().filter(value => {return value.Username == u})[0]
}

function setUsers(newUsersList) {
    localStorage.setItem('users',JSON.stringify(newUsersList))
}

// Helper functions
function isInArray(item,array) {
    return JSON.stringify(array).includes(JSON.stringify(item))
}

function compareArrays(a,b) {
    return a.length === b.length && JSON.stringify(a) == JSON.stringify(b)
}

function removeItem(arr, item) {
    return arr.filter(function (element) { 
        return !compareArrays(item,element) 
    })
}

$(document).ready(function(){

    $('#signInForm').on('submit', event => {
        if (!validateSignIn()) {
        event.preventDefault()
        event.stopPropagation()
        }

        form.classList.add('was-validated')
    })

    $('#signUpForm').on('submit', event => {
        if (!registerUser()) {
        event.preventDefault()
        event.stopPropagation()
        }
  
        form.classList.add('was-validated')
    })
})