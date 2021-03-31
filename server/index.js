
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user?.room).emit('message', { user: user?.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));



// const express = require('express')
// const socketio = require('socket.io')
// const http = require('http')
// const PORT = process.env.PORT || 5000
// const cors = require('cors')
// const router = require('./router')
// const { addUser, getUser, getUsersInRoom, removeUser } = require('./users')
// const app = express()

// const server = http.createServer(app)

// const io = socketio(server)

// app.use(router)
// app.use(cors())

// io.on('connect', socket => {
//     socket.on('join', ({ name, room }, callback) => {
//         const { error, user } = addUser({ id: socket.id, name, room })

//         if (error) {
//             return callback(error)
//         }


//         socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` })

//         socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` })

//         socket.join(user.room);

//         io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

//         callback()
//     })

//     socket.on('sendMessage', (message, callback) => {
//         const user = getUser(socket.id)
//         console.log(user)
//         io.to(user.room).emit('message', { user: user.name, text: message })
//         io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
//         callback();
//     })

//     socket.on('disconnect', () => {
//         const user = removeUser(socket.id)

//         if (user) {
//             io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` })
//         }
//     })
// })


// server.listen(PORT, () => {
//     console.log(`Serve s running on ${PORT}`)
// })