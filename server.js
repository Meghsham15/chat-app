// const io = require('socket.io')(8000);
var PORT = process.env.PORT || 3000; // take port from heroku or for loacalhost
var express = require("express");
var app = express(); // express app which is used boilerplate for HTTP
var http = require("http").Server(app);
var io = require("socket.io")(http);
const cors = require('cors');
const users = [];
const usersObj = {};
app.use(express.static(__dirname + '/public'));


// app.get('/land',function(req,res){
//     res.sendFile(__dirname+'/landing.html');
// })
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/trail', function (req, res) {
    res.sendFile(__dirname + '/trail.html');
});

function getUser(users, socketId) {
    let user;
    users.forEach((ele) => {
        if (ele.id === socketId) {
            // console.log(ele);
            user = ele;
        }
    });
    return user;
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
// function getUser(socketId){
//     users.forEach((ele)=>{
//         if(ele.id === socketId ){
//             // console.log(ele);
//             return JSON.stringify(ele);
//         }
//     })
// }
// const corsOptions = {
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
// };

// io.use(cors(corsOptions));
io.on('connection', (socket) => {
    socket.on('new-user-joined', (req) => {
        // console.log("name- " + name);
        let user = {};
        socket.join(req.room);
        user[socket.id] = req.name;
        user['id'] = socket.id;
        user['room'] = req.room;
        user.joinTime = getCurrentTime();
        usersObj[socket.id] = {
            name: req.name,
            time: getCurrentTime(),
            room: req.room
        }
        users.push(user);
        // console.log(users);
        let data = {
            name: null,
            message: `${req.name} joined`,
            position: 'center'
        };
        socket.broadcast.to(req.room).emit('message', data);
    });


    socket.on('send', (message) => {
        let user = getUser(users, socket.id);
        // users.forEach((ele) => {
        //     if (ele.id === socket.id) {
        //         // console.log(ele);
        //         user = ele;
        //     }
        // })

        // console.log(user);
        socket.broadcast.to(user.room).emit('message', { users: users, position: 'left', message: message, name: user[socket.id] })
    })

    socket.on('send-img', (message) => {
        let user = getUser(users, socket.id);

        // console.log(user);
        socket.broadcast.to(user.room).emit('image-display', { users: users, position: 'left', message: message, name: user[socket.id] })
        // console.log('img server');
    })

    socket.on('displayUsers', (message) => {
        let user = getUser(users, socket.id);
        // users.forEach((ele) => {
        //     if (ele.id === socket.id) {
        //         // console.log(ele);
        //         user = ele;
        //     }
        // })
        let names = [];
        Object.values(usersObj).forEach(ele => {
            if (user.room === ele.room) {
                names.push(ele.name);
            }
        })
        // console.log(user);
        socket.emit('message', { users: users, position: 'center', message: JSON.stringify(names), name: null })
    });

    socket.on('disconnect', () => {
        if (users.length !== 0) {
            let user = getUser(users,socket.id);
            // users.forEach((ele) => {
            //     if (ele.id === socket.id) {
            //         // console.log(ele);
            //         user = ele;
            //     }
            // })
            // console.log('disconnected' + user[socket.id]);
            io.to(user.room).emit('message', { users: users, position: 'center', message: "User disconnected - " + user[socket.id], name: null });
        }
    })

    // socket.on('disconnect', () => {
    //     console.log('A user disconnected.');

    //     // Notify other users about the disconnection
    //     io.emit('user-disconnected', 'A user has left the chat.');
    //   });


});

http.listen(PORT, function () {
    console.log("server started");
});
