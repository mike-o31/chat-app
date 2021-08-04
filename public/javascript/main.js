const socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })

socket.on('message', (msg) => {
    console.log(msg)

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