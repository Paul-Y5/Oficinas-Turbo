function registerUser() {
    userName = $('#').value()
    userPassword = $('#').value()
    users = getUsers()

    userInfo = users.filter(function(element){return !(element.Name == 'username')})
    if (userInfo.stringify() == '[]') {return false}
    
    if (userInfo.Name == undefined) {
        return false
    }
    if (userInfo.Password != userPassword){
        return false
    }
    users.push()
    setUsers(users)
}

function removeUser(u) {
    users = getUsers()
    newUsers = removeItem(users,u)
    setUsers(newUsers)
}

function validateLogIn() {
    username = $('#').value()
    userPW = $('#').value()

    
}

function getUsers() { 
    return JSON.parse(localStorage.getItem('users'))
}

function setUsers(newUsersList) {
    localStorage.setItem('users',JSON.stringify(newUsersList))
}

// Helper functions
function compareArrays(a,b) {
    return a.length === b.length && JSON.stringify(a) == JSON.stringify(b)
}

function removeItem(arr, item) {
    return arr.filter(function (element) { 
        return !compareArrays(item,element) 
    })
}