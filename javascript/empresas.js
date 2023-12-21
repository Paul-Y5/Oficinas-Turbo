var vm = function() {

    var self = this

    self.Name = ko.observable('')
    self.Email = ko.observable('')
    self.OpeningDate = ko.observable('')
    self.Adress = ko.observable('')
    self.City = ko.observable('')
    self.Coords = ko.observable('')
    self.Extra = ko.observable('')
    self.Orders = ko.observableArray([])
    self.Cars = ko.observableArray([])

    self.initiate = function () {
        var currentShop = getActiveAccount()

        self.Name(currentShop.Name)
        self.Email(currentShop.Email)
        self.OpeningDate(currentShop.OpeningDate)
        self.Adress(currentShop.Adress)
        self.City(currentShop.City)
        self.Coords(currentShop.Coords)
        self.Extra(currentShop.Extra)
        self.Orders(getOrdersByShop(self.Name()))
        self.Cars(currentShop.Cars)

        console.log('Current Shop', currentShop)
        console.log('VM initialized. . .')
    }

    self.initiate()
}

var viewModel = new vm()

function checkInCar(n,order) {
    var shop = getShopByName(n)

    var cars = shop.Cars
    cars.push(order.Car)

    updateShop(n,shop)

    viewModel.initiate()
}

function updateShop(name,newData){
    var shops = getShops()

    shops = shops.map(element => {
        if (element.Username == username) {
            return newData
        }
        else {
            return element
        }
    })

    var activeShop = getActiveAccount()

    if (activeShop.Name == name) {
        localStorage.setItem('activeShop',JSON.stringify(newData))
    }

    setShops(shops)
}

function registerShop() {
    var Name = $('#inputNome').val()
    var Email = $('#inputEmail').val()
    var OpeningDate = $('#inputData').val()
    var Adress = $('#inputEndereco').val()
    var City = $('#inputCidade').val()
    var Coords = $('#inputCoordenadas').val()

    var shops = getShops()
    
    if (Name == '' || Email == '' || OpeningDate == '' || Adress == '' || City == '' || Coords == '' ) {
        alert('Missing parameter')
        return false 
    }
    
    var newShop = {
        'Name':Name,
        'Email':Email,
        'OpeningDate':OpeningDate,
        'Adress':Adress,
        'City':City,
        'Coords':Coords,
        'Orders':[],
        'Cars':[],
    }

    if (getShopByName(Name) != undefined) {
        alert('Já existe este username registrado')
        return false
    }
    else {
        signIn(newShop)
        shops.push(newShop)
        setShops(shops)
        return true
    }
}

function updateShop(name,newData){
    var shops = getUsers()

    shops = shops.map(element => {
        if (element.Name == name) {
            return newData
        }
        else {
            return element
        }
    })

    var activeShop = getActiveAccount()

    if (activeShop.Name == name) {
        localStorage.setItem('activeShop',JSON.stringify(newData))
    }

    setShops(shops)
}

function getActiveAccount(){
    var user = JSON.parse(localStorage.getItem('activeShop'))

    if (user == null) {
        localStorage.setItem('activeShop','{}')
        return {}
    }
    else {
        return user
    }
}

function signIn(s) {
    viewModel.initiate()
    localStorage.setItem('activeShop', JSON.stringify(s))
}

function signOut() {
    viewModel.initiate()
    localStorage.setItem('activeShop', '{}')
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

function getAllCars() {
    var users = getUsers()
    var cars = []
    users.forEach(element => {
        element.Cars.forEach(element => {
            cars.push(element)
        })
    })

    return cars
}

function getOrdersByShop(n) {
    var users = getUsers()
    var orders = []

    users.forEach(element => {
        element.Orders.forEach(element => {
            if (element.Shop.Name == n) {
                orders.push(element)
            }
        })
    })

    return orders
}

function getShopByName(n) { 
    // Returns undefined is no shops with said name are found
    return getShops().filter(value => {return value.Name == n})[0]
}

function setShops(newShopsList) {
    localStorage.setItem('shops',JSON.stringify(newShopsList))
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

    ko.applyBindings(viewModel)

    $('#franchiseSignUp').on('submit', event => {
        if (!registerShop()) {
        event.preventDefault()
        event.stopPropagation()
        }

        event.target.classList.add('was-validated')
    })

    $('#signInForm').on('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        var shop = getShopByName($('#nameSignIn').val())
        if (shop == undefined) {
            alert('Oficina não registrada')
        }
        else {
            signIn(shop)
            currentPath = window.location.href.substring(0,location.href.length-16)
            location.replace(currentPath + 'empresas.html')
        }

        event.target.classList.add('was-validated')
    })

})