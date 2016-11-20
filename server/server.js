'use strict';

let express = require('express');
let socketIO = require('socket.io');
let path = require('path');

let PORT = process.env.PORT || 3007;
let buildDir  = path.resolve(__dirname, './public');

let app = express();
let http = require('http');
let server = http.createServer(app);
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let io = socketIO(server);

// Bootstrap the game
require('./src')({
	app: app,
	io: io
});

app.use('/static/', express.static(buildDir));
app.all('/*', (req, res) => res.sendFile('index.html', {root: buildDir}));

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});