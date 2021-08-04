const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { messageFormat, joiningUser, getCurrentUser } = require('./functions/functions')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 5000
const admin = 'Admin'

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (client) => {
    client.on('joinRoom', ({ username, room }) => {
        const user = joiningUser(client.id, username, room)

        client.emit('message', messageFormat(admin, 'Welcome to the Group Chat!'))

        client.broadcast.emit('message', messageFormat(admin, `${username} has joined the chat!`))
    })

    client.on('userMessage', (msg) => {
        const user = getCurrentUser(client.id)
        io.emit('message', messageFormat(user, msg))
    })

    client.on('disconnect', () => {
        io.emit('message', messageFormat(admin, 'A user has disconnected'))
    })
})

server.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})