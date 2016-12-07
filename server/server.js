'use strict';

let express = require('express');
let socketIO = require('socket.io');
let path = require('path');
let _ = require('lodash');
let PORT = process.env.PORT || 3007;
let ENV = process.env.NODE_ENV || 'development';
let buildDir  = path.resolve(__dirname, './public');

let app = express();
let http = require('http');
let server = http.createServer(app);
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let io = socketIO(server);
let sessionMiddleware = require('./src/middleware/sessionMiddleware');
let forceSSLMiddleware = require('./src/middleware/forceSSLMiddleware');

app.use(cookieParser());
app.use(sessionMiddleware);
io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next));

if (ENV === 'production') {
	app.use(forceSSLMiddleware);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let activeRoundAPI = require('./src/api/ActiveRoundAPI')();
let userAPI = require('./src/api/UserAPI')(io);
app.use('/api/rounds', activeRoundAPI.router);
app.use('/api/canvas', require('./src/api/CanvasAPI')(io).router);
app.use('/api/message', require('./src/api/MessageAPI')(io, userAPI, activeRoundAPI).router);
app.use('/api/user', userAPI.router);
app.use('/api/mobile-user', require('./src/api/MobileUserAPI')(io).router);
app.use('/api/game', require('./src/api/GameAPI')(activeRoundAPI).router);

app.get('/favicon.ico', (req, res) => res.sendFile('img/favicon.ico', {root: buildDir}));
app.use('/static/', express.static(buildDir));
app.all('/*', (req, res) => res.sendFile('index.html', {root: buildDir}));

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});