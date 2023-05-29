const path = require ('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require ('./utils/messages');
// calling formatMessage from messages.js file in utils folder to use it on line 23
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require ('./utils/users');

const app = express();
const server = http.createServer(app);
// creating a server method and passing our app
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatApp Admin';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);


    // whenever client connects it should this connection
    socket.emit('message', formatMessage(botName, 'Welcome to ChatApp!'));

    // Broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit(
        'message', 
        formatMessage(botName, `${user.username} has joined the chat`)
    );
    // broadcast.emit will notify the other users that new user is connected, connected user not going to see about their joining the chat

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers (user.room)
    })
    });
    console.log('New WS Connection...')




    // Listen for chatMessage on main.js
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser (socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnets
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', 
            formatMessage(botName, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers (user.room)
            })
        }

    });
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));