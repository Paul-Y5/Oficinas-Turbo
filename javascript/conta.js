var vm = function() {

    var self = this

    self.Username = ko.observable('')
    self.PhoneNumber = ko.observable('')
    self.Email = ko.observable('')
    self.Adress = ko.observable('')
    self.Cars = ko.observableArray([])
    self.PendingOrders = ko.observableArray([])

    self.initiate = function() {
        var user = JSON.parse(localStorage.getItem('activeAccount'))
        
        self.Username = ko.observable(user.Username)
        self.PhoneNumber = ko.observable(user.PhoneNumber)
        self.Email = ko.observable(user.Email)
        self.Adress = ko.observable(user.Adress)
        self.Cars = ko.observableArray(user.Cars)
        self.PendingOrders = ko.observableArray(user.PendingOrders)

        console.log("Active User:", user)
        console.log("VM initialized. . .")
    }

    self.initiate()
}

$(document).ready(function() {
    var viewModel = new vm()
    ko.applyBindings(viewModel)

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })
})