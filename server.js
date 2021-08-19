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

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = joiningUser(socket.id, username, room)

        socket.join(user.room)

        socket.emit('message', messageFormat(admin, `Welcome to the ${room} room!`))

        socket.broadcast.to(user.room).emit('message', messageFormat(admin, `${username} has joined the chat!`))

        io.to(user.room).emit('usersInRoom', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on('userMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', messageFormat(user.name, msg))
    })

    socket.on('typing', ({ username, room }) => {
        usersTyping[socket.id] = 1

        socket.broadcast.to(room).emit('typing', {
            user: username,
            usersTyping: Object.keys(usersTyping).length
        })

        socket.on('notTyping', () => {
            delete usersTyping[socket.id]

            socket.broadcast.to(room).emit('notTyping', (Object.keys(usersTyping).length))
        })
    })

    socket.on('disconnect', () => {
        const user = leavingUser(socket.id)
        
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