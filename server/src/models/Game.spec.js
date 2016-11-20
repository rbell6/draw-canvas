'use strict';
describe('Game', () => {
	var Game = require('./Game');
	var User = require('./User');
	var EventEmitter = require('events');
	var hostSocket = new EventEmitter();
	var host = new User({
		name: 'Mr. Host',
		socket: hostSocket
	});
	var game;

	beforeEach(() => {
		game = new Game({
			host: host
		});
	});

	it('should remove users when they are disconnected', () => {
		var socket = new EventEmitter();
		var user = new User({
			name: 'bilbo',
			socket: socket
		});
		expect(game.get('users').length).toEqual(1); // host
		game.addUser(user);
		expect(game.get('users').length).toEqual(2);
		socket.emit('disconnect');
		expect(game.get('users').length).toEqual(1);
	});

});