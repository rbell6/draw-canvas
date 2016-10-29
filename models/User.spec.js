'use strict';
describe('User', () => {
	var User = require('./User');
	var Game = require('./Game');
	var EventEmitter = require('events');
	var user, socket;

	beforeEach(() => {
		socket = new EventEmitter();
		user = new User({
			name: 'Bob',
			socket: socket
		});
	});

	it('should disconnect when socket says so', () => {
		expect(user.get('connected')).toBeTruthy();
		socket.emit('disconnect');
		expect(user.get('connected')).toBeFalsy();
	});

	it('should notify a user when another user is added to its game', () => {
		var game = new Game({
			host: user
		});
		socket.on('game:change', () => {
			console.log('change');
		});
		var user2 = new User({
			name: 'Jim',
			socket: new EventEmitter()
		});
		game.addUser(user2);
		user2.addGame(game);
	});

});