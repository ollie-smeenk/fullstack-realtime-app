require('dotenv').config();
const express = require('express');
const http = require('http');
const session = require('express-session');
const passport = require('./auth');
const cors = require('cors');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');
const { startPolling } = require('./sockets');


const app = express();
const server = http.createServer(app);


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());


app.use(session({
secret: process.env.SESSION_SECRET || 'dev-secret',
resave: false,
saveUninitialized: false,
cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());


// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/fail' }), (req, res) => {
// on success, redirect to frontend app home
res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});
app.get('/auth/fail', (req, res) => res.status(401).send('Auth failed'));


app.use('/api', apiRoutes);


const io = new Server(server, {
cors: { origin: true }
});


io.on('connection', (socket) => {
console.log('socket connected', socket.id);
});


// start polling and emit to clients
startPolling(io);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Backend listening on', PORT));
