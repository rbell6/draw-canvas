'use strict';

let Game = require('../../models/Game');
let User = require('../../models/User');
let _ = require('lodash');
let EventEmitter = require('events');
let UserCollection = require('../../models/userCollection');
let GameCollection = require('../../models/gameCollection');

let userCollection = new UserCollection();
let gameCollection = new GameCollection();
let userSockets = new Map();

// Notify all of the users when a game is added/removed
function notifyUsersOfGamesChange() {
	// TODO use a user socket map
	// userCollection.notifyAll('update:gameList', gameCollection.getAll().map(game => game.toJSON()));
}
gameCollection.on('add', notifyUsersOfGamesChange);
gameCollection.on('remove', notifyUsersOfGamesChange);

module.exports = opts => {
	let app = opts.app;
	let io = opts.io;

	app.get('/api/gameList', function(req, res) {
		res.send(gameCollection.getAll());
	});

	// Join a game
	app.post('/api/game/:gameId', joinGame);
	function joinGame(req, res) {
		let userId = _.get(req, 'body.user.id');
		let gameId = req.params.gameId;
		let game = gameCollection.get({id: gameId});
		let user = userCollection.get({id: userId});
		if (game) {
			if (!_.find(game.get('users'), {id: userId})) {
				game.addUser(user);
				// user.addGame(game);
			}
			res.send(game.toJSON());
		} else {
			// Game not found
		}
	}

	app.post('/api/game', createGame); 
	function createGame(req, res) {
		let userId = _.get(req, 'body.user.id');
		let user = userCollection.get({id: userId});
		let game = new Game({
			name: req.body.name,
			host: user
		});
		gameCollection.add(game);
		res.send(game.toJSON());
	}

	// app.post('/api/game', function(req, res) {
	// 	let gameId = _.get(req, 'body.id');
	// 	let userId = _.get(req, 'body.user.id');
	// 	let user = userCollection.get({id: userId});
	// 	// TODO remove this (join game is above)
	// 	if (gameId) {
	// 		// Join game
	// 		let game = gameCollection.get({id: gameId});
	// 		if (game) {
	// 			if (!_.find(game.users, {id: userId})) {
	// 				game.addUser(user);
	// 			}
	// 			res.send(game);
	// 		} else {
	// 			// Game not found
	// 		}
	// 	} else {
	// 		// Create game
	// 		let game = new Game({
	// 			name: req.body.name,
	// 			host: user
	// 		});
	// 		gameCollection.add(game);
	// 		userCollection.getAll().forEach(user => user.socket.emit('update:gameList', gameCollection.getAll()));
	// 		res.send(game);
	// 	}
	// });

	// Remove user from game
	app.delete('/api/game/user', function(req, res) {
		let gameId = _.get(req, 'query.gameId');
		let userId = _.get(req, 'query.userId');
		let user = userCollection.get({id: userId});
		let game = gameCollection.get({id: gameId});
		if (game.users.indexOf(user) > -1) {
			game.removeUser(user);
		}
		res.send();
	});

	io.on('connection', function(socket) {
		socket.on('saveUser', saveUser.bind(this, socket));
	});
	function saveUser(socket, user, cb) {
		let newUser = new User({
			name: user.name
		});
		userCollection.add(newUser);
		userSockets.set(newUser, socket);
		cb(newUser.toJSON());
	}


	// TESTING

/*
	let fakeSocket = new EventEmitter();

	io.emit('connection', fakeSocket);

	let user;
	fakeSocket.emit('saveUser', {
		name: 'harry potter'
	}, o => user = o);

	let game;
	createGame({
		body: {user: {id: user.id}, name: 'test game'}
	}, {
		send: g => game = g
	});

	joinGame({
		body: {user: {id: user.id}},
		params: {gameId: game.id}
	}, {
		send: () => {}
	})


	fakeSocket.emit('disconnect');

	console.log('g', game);

*/


};