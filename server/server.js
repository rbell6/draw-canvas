'use strict';

let express = require('express');
let socketIO = require('socket.io');
let path = require('path');

let PORT = process.env.PORT || 3007;
let ENV = process.env.NODE_ENV || 'development';
let buildDir  = path.resolve(__dirname, './public');

let app = express();
let http = require('http');
let server = http.createServer(app);
let bodyParser = require('body-parser');

let forceSSL = (req, res, next) => {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};
if (ENV === 'production') {
	app.use(forceSSL);
}

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