'use strict';

let Games = require('../Games');
let _ = require('lodash');
let express = require('express');
let router = express.Router();
let UserSockets = require('../UserSockets');

class CanvasAPI {
	constructor(router, io, userAPI) {
		this.router = router;
		this.io = io;
		this.userAPI = userAPI;

		this.io.on('connection', socket => {
			socket.on('change:canvas', this.onCanvasChange.bind(this, socket));
		});
	}

	onCanvasChange(socket, opts) {
		let game = Games.find(game => game.id === opts.gameId);
		let user = this.userAPI.getUserForSocket(socket);
		let activeRound = _.get(game, 'activeRound');
		if (user && activeRound && user.id === activeRound.get('drawerId')) {
			game.activeRound.set('lines', opts.lines);
			game.activeRound.set('aspectRatio', opts.aspectRatio);
			game.get('users').forEach(user => {
				let socket = UserSockets.get(user);
				if (socket) {
					socket.emit(`change:canvas:${game.id}`, opts.lines, opts.aspectRatio);
				}
			});
		}
	}
}

module.exports = (io, userAPI) => {
	return new CanvasAPI(router, io, userAPI);
}