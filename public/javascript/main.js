const socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const userList = document.getElementById('users')
const roomName = document.getElementById('room-name')
const typingMessage = document.querySelector('.typing-message')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })

socket.on('usersInRoom', ({ room, users }) =>{
    displayUsers(users)
    displayRoom(room)
})

socket.on('message', (msg) => {
    displayMessage(msg)

    chatMessage.scrollTop = chatMessage.scrollHeight
})

socket.once('dbOutput', (storedMessages) => {
    if (storedMessages.length) {
        storedMessages.forEach((message) => {
            displayMessage(message)
            chatMessage.scrollTop = chatMessage.scrollHeight
        })
    }
})

socket.on('typing', ({ user, usersTyping }) => {
    typingMessage.innerHTML = usersTyping === 1 ? `<span><strong>${user}</strong></span> is typing...` : `Multiple people are typing...`
})

socket.on('notTyping', (usersTyping) => {
    if (!usersTyping) {
        typingMessage.innerHTML = ''
    }
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const userMessage = e.target.elements.message.value

    socket.emit('userMessage', userMessage)
    socket.emit('notTyping')

    e.target.elements.message.value = ''
    e.target.elements.message.focus
})

chatForm.addEventListener('input', (e) => {
    e.preventDefault()

    socket.emit('typing', { username, room })

    if (e.target.value === '') {
        socket.emit('notTyping')
    }
})

const displayMessage = (msg) => {
    const newMessage = document.createElement('div')
    newMessage.classList.add('new-message')
    newMessage.innerHTML = `<p class="message-data"><strong>${msg.name}</strong> <span>${msg.time}</span></p><p>${msg.message}</p>`
    chatMessage.insertBefore(newMessage, typingMessage)
}

const displayUsers = (users) => {
    userList.innerHTML = `${users.map((user) => `<li><strong>${user.name}</strong></li>`).join('')}`
}

const displayRoom = (room) => {
    roomName.innerText = room
}
