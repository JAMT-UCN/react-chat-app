const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const passport = require("passport");
const session = require("express-session");
const socketio = require('socket.io');
const sessionSecret = require('sessionConfig').sessionSecret;

const users = require('./routes/api/Users');
const chats = require('./routes/api/Chats');
const messages = require('./routes/api/Messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//BodyParser Middleware
app.use(bodyParser.json());

//DB Congig
const db = require('./config/dbKeys').mongoURI;

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Initialize sessions
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    expires: new Date(Date.now() + 3600000)
}));

// Initialize passport
app.use(passport.initialize());
// Initialize passport session
app.use(passport.session());

//User Routes
app.use('/api/users', users);
app.use('/api/chats', chats);
app.use('/api/messages', messages);

// Testing connection with sockets
io.on('connection', socket => {
    socket.on('join', () => {
        console.log('User connected!');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected.');
    });
});

const port = require('./config/env').serverPORT;
server.listen(port, () => console.log(`Server started on port ${port}`));
