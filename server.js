const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})