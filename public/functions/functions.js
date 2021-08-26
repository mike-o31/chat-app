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

const userJoining = (id, name, room) => {
    const user = { id, name, room }

    users.push(user)

    return user
}

const getCurrentUser = (id) => users.find((user) => user.id === id)

const userLeaving = (id) => {
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0]
    }
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = {  messageFormat, userJoining, getCurrentUser, userLeaving, getUsersInRoom }