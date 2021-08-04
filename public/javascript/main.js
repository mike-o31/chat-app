const socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const userList = document.getElementById('users')
const roomName = document.getElementById('room-name')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) =>{
    displayUsers(users)
    displayRoom(room)
})

socket.on('message', (msg) => {
    displayMessage(msg)

    chatMessage.scrollTop = chatMessage.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const userMessage = e.target.elements.message.value

    socket.emit('userMessage', userMessage)

    e.target.elements.message.value = ''
    e.target.elements.message.focus
})

const displayMessage = (msg) => {
    const newMessage = document.createElement('div')
    newMessage.classList.add('new-message')
    newMessage.innerHTML = `<p class="message-data">${msg.name} <span>${msg.time}</span></p><p>${msg.message}</p>`
    chatMessage.appendChild(newMessage)
}

const displayUsers = (users) => {
    userList.innerHTML = `${users.map((user) => `<li>${user.name}</li>`).join('')}`
}

const displayRoom = (room) => {
    roomName.innerText = room
}

