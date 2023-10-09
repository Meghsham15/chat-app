// const { json } = require("express");

// script.js
import { myFunction } from "./htmlObj.js";
let app = document.getElementById('app');
app.innerHTML = myFunction().landing;

const socket = io(); // Initialize Socket.io
// let socket ; // Initialize Socket.io
let enterChatButton = document.getElementById('enterChat');
let chatContainer;
let form;
let messageInput ;
let submitButton;
let emojiPickerButton;
enterChatButton.addEventListener('click',function(){
    enterChat();
});

function append(message, user, position) {
    if (user === null) {
        let messageEle = document.createElement('div');
        messageEle.innerText = message;
        messageEle.classList.add('message')
        messageEle.classList.add(position);
        chatContainer.append(messageEle);
    }
    if (user !== null) {
        let messageEle = document.createElement('div');
        let nameEle = document.createElement('p');
        messageEle.innerText = message;
        nameEle.innerText = user + ' - ' + getCurrentTime();
        messageEle.append(nameEle);
        messageEle.classList.add('message')
        messageEle.classList.add(position);
        chatContainer.append(messageEle);
    }
};

function enterChat() {
    const name = document.getElementById('name').value;
    const roomId = document.getElementById('roomId').value;
    let data = {
        name : name,
        room:roomId
    }
    socket.emit('new-user-joined', data);
    app.innerHTML = myFunction().chat;
    form = document.getElementById('send-container');
    submitButton = document.getElementById('submit');
    messageInput = document.getElementById('messageInput');
    emojiPickerButton = document.getElementById('emojiButton');
    chatContainer = document.querySelector('.container');
    let emojiBox =  document.querySelector('emoji-picker');


    // Scroll to the bottom with smooth animation
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });


    messageInput.addEventListener('click',function(){
        emojiBox.classList.add('displayNone');
    })

    emojiPickerButton.addEventListener('click',function(){
        emojiBox.classList.toggle('displayNone');
    })

    emojiBox.addEventListener('emoji-click', event =>{
        let emoji = event.detail.unicode;
         console.log(event.detail.unicode);
        messageInput.value+=emoji;

    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        emojiBox.classList.add('displayNone');
        let message = messageInput.value;
        if (message === '@users') {
            append(message, 'You', 'right');
            socket.emit('displayUsers',message);
            messageInput.value = '';
        } else {
            append(message, 'You', 'right');
            socket.emit('send', message)
            messageInput.value = '';
        }
         // Scroll to the bottom with smooth animation
        chatContainer.scrollTop = chatContainer.scrollHeight;
        chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        // console.log(message);
    });
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${ampm}`;
}


// console.log(name);






socket.on('message', (data) => {
    append(data.message, data.name ,data.position)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
});


// socket.on('user-joined', (name) => {
//     append(`${name} Joined the chat  - ${getCurrentTime()}`, null, 'center');
// })

// socket.on('receive', (data) => {
//     append(data.message, data.name, 'left')
// })



// socket.on('users', (data) => {
//     let users = data.users;
//     let message =[];
//     users.forEach(ele=>{
//         message.push(Object.values(ele)[0])
//     })
//     append("Users online - "+JSON.stringify(message),null,'center');
    
// });

// socket.on('userDisconnect', (data) => {
//     append("User disconnected - "+data.name,null,'center');
    
// });



