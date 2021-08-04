const moment = require('moment')

const users = []

const messageFormat = (name, message) => {
   return {
       name: name,
       message: message,
       time: moment().format('h:mm a')
   }
}

const joiningUser = (id, name, room) => {
    const user = users.push(id, name, room)

    return user
}

const getCurrentUser = (id) => {
    const userIndex = users.find((user) => user.id === id)

    return userIndex
}

module.exports = {  messageFormat, joiningUser, getCurrentUser }