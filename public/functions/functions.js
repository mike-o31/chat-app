const moment = require('moment')

const users = []

const messageFormat = (name, message, room) => {
   return {
       name: name,
       message: message,
       time: moment().format('MM/DD/YYYY, h:mm A'),
       room: room
   }
}

const joiningUser = (id, name, room) => {
    const user = { id, name, room }

    users.push(user)

    return user
}

const getCurrentUser = (id) => {
    return users.find((user) => user.id === id)
}

const leavingUser = (id) => {
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0]
    }
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {  messageFormat, joiningUser, getCurrentUser, leavingUser, getUsersInRoom }