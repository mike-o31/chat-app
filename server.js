const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (client) => {
    client.emit('message', 'Welcome to the Group Chat!')

    client.broadcast.emit('message', 'A user has joined the chat!')

    client.on('userMessage', (msg) => {
        io.emit('message', msg)
    })

    client.on('disconnect', () => {
        io.emit('message', 'A user has disconnected')
    })
})

server.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})