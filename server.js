const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { messageFormat, joiningUser, getCurrentUser, leavingUser, getUsersInRoom } = require('./functions/functions')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 5000
const admin = 'Admin'
const usersTyping = {}

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (client) => {
    client.on('joinRoom', ({ username, room }) => {
        const user = joiningUser(client.id, username, room)

        client.join(user.room)

        client.emit('message', messageFormat(admin, `Welcome to the ${room} room!`))

        client.broadcast.to(user.room).emit('message', messageFormat(admin, `${username} has joined the chat!`))

        io.to(user.room).emit('usersInRoom', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    client.on('userMessage', (msg) => {
        const user = getCurrentUser(client.id)
        io.to(user.room).emit('message', messageFormat(user.name, msg))
    })

    client.on('typing', ({ username, room }) => {
        usersTyping[client.id] = 1

        client.broadcast.to(room).emit('typing', {
            user: username,
            usersTyping: Object.keys(usersTyping).length
        })

        client.on('notTyping', () => {
            delete usersTyping[client.id]

            client.broadcast.to(room).emit('notTyping', (Object.keys(usersTyping).length))
        })
    })

    client.on('disconnect', () => {
        const user = leavingUser(client.id)
        
        if (user) {
            io.to(user.room).emit('message', messageFormat(admin, `${user.name} has left the chat...`))

            io.to(user.room).emit('usersInRoom', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})