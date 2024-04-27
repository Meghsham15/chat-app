// const { json } = require("express");

// script.js
import { myFunction } from "./htmlObj.js";
let app = document.getElementById('app');
app.innerHTML = myFunction().landing;
const audio = new Audio('sound/Notification.mp3');
const typeAudio = new Audio('sound/typing.mp3');
document.addEventListener("DOMContentLoaded", function () {
    // Hide preloader after 2 seconds (2000 milliseconds)
    setTimeout(function () {
        document.getElementById("loadingIndicator").style.display = "none";
    }, 2000);
});

const socket = io(); // Initialize Socket.io
// let socket ; // Initialize Socket.io
let imgPop = document.getElementById('imgPop');
let enterChatButton = document.getElementById('enterChat');
let wideImg = document.querySelector('#imgPop img');

let chatContainer;
let form;
let messageInput ;
let submitButton;
let emojiPickerButton;
let fileInput ;
let typingIndicator;
let bodyEle;
let seenIndicator;
// let fileCard ;
let fileLabel ;
let downloadButton;

let cross = document.querySelector('#imgPop p');
cross.addEventListener('click',function(){
    imgPop.style.display='none';
});
enterChatButton.addEventListener('click',async function(){
    document.getElementById('loadingIndicator').style.display = 'block';
    enterChat();
    await new Promise(resolve => setTimeout(resolve, 2000));
    document.getElementById('loadingIndicator').style.display = 'none';
});

function sendNoti(name,message) {
    if ('Notification' in window) {
        // Check if the Notification API is available in the user's browser.

        if (Notification.permission === 'granted') {
            // If permission is already granted, you can create and display a notification.
            const notification = new Notification(name, {
                body: message,
            });

            // Add a click event listener to the notification.
            notification.onclick = function () {
                // Function to run when the notification is clicked.
                console.log('Notification clicked. Your custom function can go here.');
            };
        } else if (Notification.permission !== 'denied') {
            // If permission is not denied, request permission from the user.
            Notification.requestPermission()
                .then((permission) => {
                    if (permission === 'granted') {
                        // Permission granted, create and display a notification.
                        const notification = new Notification(name, {
                            body: message,
                        });

                        // Add a click event listener to the notification.
                        // notification.onclick = function () {
                        //     // Function to run when the notification is clicked.
                        //     console.log('Notification clicked. Your custom function can go here.');
                        // };
                    }
                });
        }
    } else {
        console.log('Notification API is not supported in this browser.');
    }
}


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

function appendFile(name, url, user, position) {
    let fileCard = document.createElement('div');
    let innerDiv = document.createElement('div');
    let fileName = document.createElement('span');
    let downloadBtn = document.createElement('a');
    let nameEle = document.createElement('p');
    nameEle.innerText = user + ' - ' + getCurrentTime();
    fileCard.classList.add('file-card');
    fileCard.classList.add(position);
    fileName.classList.add('file-name');
    downloadBtn.classList.add('download-button');
    innerDiv.classList.add('innerDiv');
    fileName.innerText = name;
    downloadBtn.innerText = '⭳';
    downloadBtn.setAttribute('href', url);
    downloadBtn.setAttribute('download', name);
    downloadBtn.setAttribute('id', 'downloadButton');
    if(position==='right'){
        innerDiv.style.background = 'lightsteelblue';
    }
    innerDiv.append(fileName);
    innerDiv.append(downloadBtn);
    innerDiv.append(nameEle);
    fileCard.append(innerDiv);
    chatContainer.append(fileCard);
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
    let chatImg = document.querySelectorAll('.message img');
    for(let i=0;i<chatImg.length;i++){
        chatImg[i].addEventListener('click',function(){
        let src = chatImg[i].src;
        wideImg.setAttribute('src',src);
        imgPop.style.display = 'flex';
    });
    }
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
    fileInput = document.getElementById('fileInput');
    // fileCard = document.getElementById('fileCard');
    fileLabel = document.getElementById('fileLabel');
    downloadButton = document.getElementById('downloadButton');
    typingIndicator  = document.querySelector('.typing-indicator');
    seenIndicator  = document.querySelector('.seenIndicator');
    bodyEle = document.getElementById('main');
    
    seenIndicator.classList.add('visibleNot');


    // Scroll to the bottom with smooth animation
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // console.log();
     // ****************
     typingIndicator.classList.add('visibleNot');

     document.getElementById('messageInput').addEventListener('input',(e)=>{
        socket.emit('typing');
        
     });

     
     // $$$$$$$$

    // messageInput.addEventListener('input',(e)=>{
    //     console.log(e.target.value);
    // })
    
    fileInput.addEventListener('change', async(e) => {
        const formData = new FormData();
        const fileInputs = document.querySelectorAll('.fileInput');
        for (const input of fileInputs) {
            Array.from(input.files).forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        // console.log(formData);
        // const responseDiv = document.getElementById('response');
        // responseDiv.innerHTML = '';

        data.forEach(async (fileData, index) => {
            // const downloadLink = document.createElement('a');
            let url = `/uploads/${fileData.filename}`;
            let fileName = fileData.originalname;
            document.getElementById('loadingIndicator').style.display = 'block';
            appendFile(fileName,url,'You','right');
            socket.emit('file',{fileName:fileName,url:url});
            await new Promise(resolve => setTimeout(resolve, 2000));
            document.getElementById('loadingIndicator').style.display = 'none';
        });
    });

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
            seenIndicator.classList.add('visibleNot');
            append(message, 'You', 'right');
            socket.emit('displayUsers',message);
            messageInput.value = '';
        } else {
            seenIndicator.classList.add('visibleNot');
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
    let imgCross = document.querySelector("#imgContainer p");
    const canvas = document.getElementById('canvas');
    const targetSizeInBytes = 100 * 1024; // Target size in bytes (100KB)
    // let imgSend = document.getElementById('imgSend');
    // let imgForm = document.getElementById('imgForm');
    let dataUrl;
    let chat = document.getElementById('chat');
    imgCross.addEventListener('click',function(){
        imgContainer.style.display = 'none';
        chat.classList.remove('blur');
    });
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
                    imgContainer.style.background = '#b0c4de73';
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

    imgContainer.addEventListener('submit', async (e)=> {
        e.preventDefault();
        document.getElementById('loadingIndicator').style.display = 'block';
        appendImg(dataUrl,'You','right');
        imgContainer.style.display = 'none';
        imgContainer.style.zIndex = '-1';
        chat.classList.remove('blur');
        socket.emit('send-img',dataUrl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        document.getElementById('loadingIndicator').style.display = 'none';
            
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
    audio.play();
    // seenIndicator.classList.add('visibleNot');
    if(data.action ==='send'){
        sendNoti(data.name,data.message);
    }
  
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

socket.on('addFile', async (data) => {  
    // document.getElementById('loadingIndicator').style.display = 'block';
    appendFile(data.fileName,data.url,data.name,data.position);
    audio.play();
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

socket.on('image-display', (data) => {
    appendImg(data.message, data.name ,data.position);
    audio.play();
   
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

function removeIndicator(){
    typingIndicator.classList.add('visibleNot');
 }
 function addIndicator (name){
    typingIndicator.innerText = name +' typing'
    typingIndicator.classList.remove('visibleNot');
 }
 function displayTyping(name){
    
    addIndicator(name);
        setTimeout(()=>{
            removeIndicator()
        },2000);
 }

socket.on('userTyping', (data) => {
    typeAudio.play();
    displayTyping(data.name)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
});


socket.on('userSeen', (data) => {
    seenIndicator.classList.remove('visibleNot');
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
});


// Delete all the files stored in the server - 

function scheduleDailyTask(hour, minute, second, task) {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hour, minute, second, 0);

    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1); // If the target time has already passed today, schedule for the next day
    }

    const timeDiff = targetTime - now;

    setTimeout(() => {
        task(); // Execute the task when the specified time is reached
        // Schedule the task for the next day
        setInterval(task, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }, timeDiff);
}

function deleteAllServerFiles() {
    const serverUrl = 'http://localhost:3000'; // Replace with the actual URL of your server
    const deleteAllRoute = '/delete-all';

    // Combine the server URL and the delete-all route
    const deleteAllUrl = `${serverUrl}${deleteAllRoute}`;

    // Send a GET request to the delete-all route
    fetch('/deleteAll')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Change to response.json() if the route sends JSON response
        })
        .then((data) => {
            // Handle the response data here
            console.log('Response data:', data);
        })
        .catch((error) => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

scheduleDailyTask(23, 59, 0, deleteAllServerFiles);
// deleteAllServerFiles();


// window.addEventListener('beforeunload', function (e) {
//     // Display a confirmation message when the user tries to reload the page
//     e.preventDefault();
//     e.returnValue = 'All the chats will be deleted once reloaded'; // This is for legacy browsers
//  // For modern browsers
// });

// Optionally, you can remove the event listener to allow reloading when needed
// window.removeEventListener('beforeunload', yourFunctionName);



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



