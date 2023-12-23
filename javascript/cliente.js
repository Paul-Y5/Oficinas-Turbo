var vm = function() {

    var self = this

    //User Info

    self.Username = ko.observable('')
    self.PhoneNumber = ko.observable('')
    self.Email = ko.observable('')
    self.Adress = ko.observable('')
    self.Cars = ko.observableArray([])
    self.Orders = ko.observableArray([])
    self.Password = ko.observable('')
    self.Shops = ko.observableArray([])

    //Nao sei
    self.selectedCar = ko.observable('')
    self.selectedShop = ko.observable('')

    self.initiate = function() {
        var user = getActiveAccount()
        var shops = getShops()

        self.Shops(shops)
        self.Username(user.Username)
        self.PhoneNumber(user.PhoneNumber)
        self.Email(user.Email)
        self.Adress(user.Adress)
        self.Cars(user.Cars)
        self.Orders(user.Orders)
        self.Password(user.Password)

        console.log("Active User:", user)
        console.log("VM initialized. . .")
    }

    self.updateInfo = function (){
        var newInfo = {
            'Username' : self.Username(),
            'Password' : self.Password(),
            'PhoneNumber' : self.PhoneNumber(),
            'Email' : self.Email(),
            'Adress' : self.Adress(),
            'Cars': self.Cars(),
            'PendingOrders': self.Orders()
        }

        updateUser(getActiveAccount().Username,newInfo)
        alert("Informacao alterada com sucesso")
    }

    self.initiate()
}

var viewModel = new vm()

function removeUser(u) {
    us = getUsers()
    newUsers = removeItem(us,u)
    setUsers(newUsers)
}

function addCar(username){
    var user = getUserByUsername(username)
    if (user == undefined ){
        console.log(user)
        return false
    }

    var kms = $('#kmsInput').val()
    var year = $('#yearInput').val()
    var model = $('#modelInput').val()
    var mat = $('#matInput').val()

    newCar = {
        'model':model,
        'kms':kms,
        'year':year,
        'mat':mat
    }

    user.Cars.push(newCar)

    updateUser(username,user)
    return true
}

// Update User
function updateUser(username,newData){
    var users = getUsers()

    users = users.map(element => {
        if (element.Username == username) {
            return newData
        }
        else {
            return element
        }
    })

    var activeUser = getActiveAccount()

    if (activeUser.Username == username) {
        localStorage.setItem('activeAccount',JSON.stringify(newData))
    }

    setUsers(users)
}

// Login/Register
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
        'Orders': []
    }

    if (getUserByUsername(username) != undefined) {
        alert('Já existe este username registrado')
        return false
    }
    else {
        signIn(newUser)
        users.push(newUser)
        setUsers(users)
        return true
    }
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

    signIn(u)
    return true
}

function signIn(u) {
    viewModel.initiate()
    localStorage.setItem('activeAccount', JSON.stringify(u))
}

function signOut() {
    viewModel.initiate()
    localStorage.setItem('activeAccount', '{}')
}

// Getters and setters
function getActiveAccount(){
    var user = JSON.parse(localStorage.getItem('activeAccount'))

    if (user == null) {
        localStorage.setItem('activeAccount','{}')
        return {}
    }
    else {
        return user
    }
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

function getShops() {
    var shops = localStorage.getItem('shops')
    
    if (shops == null) {
        setShops([])
        return []
    }
    
    else {
        return JSON.parse(shops)
    }
}

function getUserByUsername(u) { 
    // Returns undefined is no users with said username are found
    return getUsers().filter(value => {return value.Username == u})[0]
}

function setUsers(newUsersList) {
    localStorage.setItem('users',JSON.stringify(newUsersList))
}

function setShops(newShopsList) {
    localStorage.setItem('shops',JSON.stringify(newShopsList))
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

function toggleFileUpload() {
  var typeMarcInputValue = $("#TypeMarcInput").val();
  $("#fileUploadContainer").toggle(typeMarcInputValue == 2);
}

$(document).ready(function(){
    
    ko.applyBindings(viewModel)

    $('#signInForm').on('submit', event => {
        if (!validateSignIn()) {
        event.preventDefault()
        event.stopPropagation()
        }

        event.target.classList.add('was-validated')
    })

    $('#signUpForm').on('submit', event => {
        if (!registerUser()) {
        event.preventDefault()
        event.stopPropagation()
        }
        
        event.target.classList.add('was-validated')
    })

    $('#addVehicle').on('submit', event => {
        var activeAccount = getActiveAccount()

        if (!addCar(activeAccount.Username)) {
        event.preventDefault()
        event.stopPropagation()
        }

        event.target.classList.add('was-validated')
    })

    $('#userInfoForm').on('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        viewModel.updateInfo()
    })

    $('#marcacaoForm').on('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        if (!event.target.checkValidity()) {
            event.target.classList.add('was-validated')
        }

        var user = getActiveAccount()

        newOrder = {
            'Car': viewModel.selectedCar(),
            'Date': $('#dateInput').val(),
            'Description': $('#descriptionInput').val(),
            'Status': 'Pending',
            'Type':'Normal',
            'Shop': viewModel.selectedShop()
        }

        user.Orders.push(newOrder)
        updateUser(user.Username,user)

        alert('Order done sucessfully')

        currentPath = window.location.href.substring(0,location.href.length-23)
        location.replace(currentPath + 'cliente.html')
        
    })

    $('#orcamentoForm').on('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        if (!event.target.checkValidity()) {
            event.target.classList.add('was-validated')
        }

        var user = getActiveAccount()

        newOrder = {
            'Car': viewModel.selectedCar(),
            'Description': $('#descriptionInput').val(),
            'Status': 'Pending',
            'Type':'Orcamento',
            'PartsType': $('#partsTypeInput').val()
        }

        user.Orders.push(newOrder)
        updateUser(user.Username,user)

        alert('Order done sucessfully')

        currentPath = window.location.href.substring(0,location.href.length-19)
        location.replace(currentPath + 'cliente.html')
    })
})
