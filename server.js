// const io = require('socket.io')(8000);
var PORT = process.env.PORT || 3000; // take port from heroku or for loacalhost
var express = require("express");
const multer = require('multer');
const path = require('path');
var app = express(); // express app which is used boilerplate for HTTP
var http = require("http").Server(app);
var io = require("socket.io")(http);
const users = [];
const usersObj = {};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp_uploads/');
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + extname);
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('temp_uploads'));
app.use(express.static('public'));
app.use(express.json());


// app.get('/land',function(req,res){
//     res.sendFile(__dirname+'/landing.html');
// })
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.array('files', 5), (req, res) => {
    // Handle the uploaded files here
    const files = req.files; // An array of uploaded files

    // Respond with information about the uploaded files
    const response = files.map((file) => {
        return {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        };
    });

    res.json(response);
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

// class objectStore {
//     constructor() {
//         this.objArr;
//     }

//     addObj(obj) {
//         this.objArr.push(obj);
//         return 'obj added';
//     }

//     removeObj(obj) {
//         const index = this.objArr.indexOf(obj);
//         if (index !== -1) {
//             array.splice(index, 1);
//             console.log('obj deleted');
//         }
//         return 'obj deleted';
//     }

//     getAll(){
//         return this.objArr;
//     }

// }


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

    socket.on('file', (message) => {
        let user = getUser(users, socket.id);

        // console.log(user);
        socket.broadcast.to(user.room).emit('addFile', { users: users, position: 'left', fileName: message.fileName,url:message.url, name: user[socket.id] })
        // console.log('img server');
    });

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
            let user = getUser(users, socket.id);
            // users.forEach((ele) => {
            //     if (ele.id === socket.id) {
            //         // console.log(ele);
            //         user = ele;
            //     }
            // })
            // console.log('disconnected' + user[socket.id]);
            const index = users.indexOf(user);
            if (index !== -1) {
                users.splice(index, 1);
            }
            if (usersObj.hasOwnProperty(socket.id)) {
                delete usersObj[socket.id];
            }
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
