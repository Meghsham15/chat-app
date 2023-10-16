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

function appendImg(url,user,position){
    let messageEle = document.createElement('div');
    let nameEle = document.createElement('p');
    let imgEle = document.createElement('img');
    nameEle.innerText = user + ' - ' + getCurrentTime();
    imgEle.setAttribute('src', url);
    messageEle.append(imgEle);
    messageEle.append(nameEle);
    messageEle.classList.add('message');
    messageEle.classList.add(position);
    chatContainer.append(messageEle);
}

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
    let previewImg = document.getElementById('previewImg');


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
    // chat operations - 
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


    // img Operation - 
    const imageInput = document.getElementById('imageInput');
    let imgContainer = document.getElementById('imgContainer');
    const canvas = document.getElementById('canvas');
    const targetSizeInBytes = 100 * 1024; // Target size in bytes (100KB)
    // let imgSend = document.getElementById('imgSend');
    // let imgForm = document.getElementById('imgForm');
    let dataUrl;
    let chat = document.getElementById('chat');
       // Listen for changes in the file input
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    // dataUrl = e.target.result;
                    previewImg.src = e.target.result;
                    imgContainer.style.display = 'flex'
                    imgContainer.style.zIndex = '1';
                    chat.classList.add('blur');
                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = function () {
                        let width = img.width;
                        let height = img.height;
                        let quality = 0.7; // Initial quality value (adjust as needed)

                        // Resize and compress the image iteratively until it meets the target size
                        const compressAndResize = () => {
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);

                            // Convert the canvas content to a data URL with the current quality setting
                            const resizedImageData = canvas.toDataURL('image/jpeg', quality);

                            // Calculate the size of the data URL in bytes
                            const sizeInBytes = resizedImageData.length * 0.75;

                            if (sizeInBytes > targetSizeInBytes && quality > 0.1) {
                                // If the current size exceeds the target size and quality is still acceptable, reduce quality and resize again
                                quality -= 0.1;
                                compressAndResize();
                            } else {
                                dataUrl = resizedImageData;
                                // The image meets the target size or quality has reached its minimum acceptable value
                                // Use the resizedImageData as needed (e.g., send it to the server or display it)
                                // console.log('Resized and Compressed Image Data URL:', resizedImageData);
                            }
                        };

                        compressAndResize();
                    };
                };
                reader.readAsDataURL(file);
                };

        }
    );

    imgContainer.addEventListener('submit', (e)=> {
        e.preventDefault();
        appendImg(dataUrl,'You','right');
        imgContainer.style.display = 'none';
        imgContainer.style.zIndex = '-1';
        chat.classList.remove('blur');
        socket.emit('send-img',dataUrl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            
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

socket.on('image-display', (data) => {
    appendImg(data.message, data.name ,data.position);
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



