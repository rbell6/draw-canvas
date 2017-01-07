'use strict';

let Games = require('../Games');
let _ = require('lodash');
let express = require('express');
let router = express.Router();
let UserSockets = require('../UserSockets');
let Message = require('../../../models/Message');

class MessageAPI {
	constructor(router, io, userAPI, activeRoundAPI) {
		this.router = router;
		this.io = io;
		this.userAPI = userAPI;
		this.activeRoundAPI = activeRoundAPI;

		this.io.on('connection', socket => {
			socket.on('gameMessage', this.onMessageReceived.bind(this, socket));
		});
	}

	onMessageReceived(socket, opts) {
		let user = this.userAPI.getUserForSocket(socket);
		let game = Games.find(game => game.id === opts.gameId);
		if (!user || !game) { return; }
		let activeRound = _.get(game, 'activeRound');
		let message = opts.message;
		let messageId = user.id + Date.now();
		let res;
		if (user.id) {
			let wordIsCorrect = game.activeRound && game.activeRound.wordIsCorrect(message);
			if (wordIsCorrect) {
				let points = this.activeRoundAPI.userGuessedCorrectWord(user, game);
				res = {
					text: '',
					wordIsCorrect: true,
					points: points,
					userId: user.id,
					id: messageId
				};
			} else {
				res = {
					text: message,
					wordIsCorrect: false,
					userId: user.id,
					id: messageId
				};
			}
			game.get('messages').add(new Message({
				text: res.text,
				user: user,
				isChecked: res.wordIsCorrect
			}));
			UserSockets.notifyUsers(game.get('users'), `gameMessage:${game.id}`, res);
		}
	}
}

module.exports = (io, userAPI, activeRoundAPI) => {
	return new MessageAPI(router, io, userAPI, activeRoundAPI);
}