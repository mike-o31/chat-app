const { MongoClient } = require('mongodb')
const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { messageFormat, joiningUser, getCurrentUser, leavingUser, getUsersInRoom } = require('./public/functions/functions')
const password = require('./public/config/config')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 5000
const adminBot = 'AdminBot'
const databaseName = 'realtime-chat-app'
const uri = `mongodb+srv://Mike-O:${password}@cluster0.wt8rx.mongodb.net/${databaseName}?retryWrites=true&w=majority`
const client = new MongoClient(uri)
const usersTyping = {}

app.use(express.static(path.join(__dirname, 'public')))

const runServer = async () => {
    try {
        await client.connect()
        console.log('Connected to server...')

        io.on('connection', (socket) => {
            const database = client.db(databaseName)
            const chats = database.collection('chats')
            const chatRoomProjection = { room: 1 }


            chats.find().limit(200).sort({_id:1}).toArray((error, res) => {
                if (error) {
                    throw error
                }

                socket.on('joinRoom', ({ username, room }) => {
                    const user = joiningUser(socket.id, username, room)

                    socket.join(user.room)

                    socket.emit('message', messageFormat(adminBot, `Welcome to the ${room} room!`))

                    io.to(user.room).emit('dbOutput', res)
                    
                    socket.broadcast.to(user.room).emit('message', messageFormat(adminBot, `${username} has joined the chat!`))

                    io.to(user.room).emit('usersInRoom', {
                        room: user.room,
                        users: getUsersInRoom(user.room)
                    })
                })

                socket.on('userMessage', (msg) => {
                    const user = getCurrentUser(socket.id)

                    chats.insertOne(messageFormat(user.name, msg, user.room), () => {
                        io.to(user.room).emit('message', messageFormat(user.name, msg))
                    })
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
                        io.to(user.room).emit('message', messageFormat(adminBot, `${user.name} has left the chat...`))

                        io.to(user.room).emit('usersInRoom', {
                            room: user.room,
                            users: getUsersInRoom(user.room)
                        })
                    }
                })
            })
        })
    } catch (error) {
        console.log(error)
    }
}
runServer()

server.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})