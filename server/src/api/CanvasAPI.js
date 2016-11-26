'use strict';

let Games = require('../Games');
let _ = require('lodash');
let UserSockets = require('../UserSockets');

class CanvasAPI {
	constructor(opts) {
		this.app = opts.app;
		this.io = opts.io;

		this.onCanvasChange = this.onCanvasChange.bind(this);

		this.io.on('connection', socket => {
			socket.on('change:canvas', this.onCanvasChange);
		});
	}

	onCanvasChange(opts) {
		let game = Games.find(game => game.id === opts.gameId);
		let activeRound = _.get(game, 'activeRound');
		if (opts.userId && activeRound && opts.userId === activeRound.get('drawerId')) {
			game.get('users').forEach(user => {
				// We don't need to notify the user that made this change
				if (user.id === opts.userId) { return; }
				
				let socket = UserSockets.get(user);
				if (socket) {
					socket.emit(`change:canvas:${game.id}`, opts.lines, opts.aspectRatio);
				}
			});
		}
	}
}

module.exports = opts => {
	return new CanvasAPI(opts);
}