'use strict';

let Games = require('../Games');
let _ = require('lodash');
let express = require('express');
let router = express.Router();
let UserSockets = require('../UserSockets');
let RoundStartTimes = require('../RoundStartTimes');

class MessageAPI {
	constructor(router, io, userAPI) {
		this.router = router;
		this.io = io;
		this.userAPI = userAPI

		this.io.on('connection', socket => {
			socket.on('gameMessage', this.onMessageReceived.bind(this, socket));
		});
	}

	onMessageReceived(socket, opts) {
		let user = this.userAPI.getUserForSocket(socket);
		let game = Games.find(game => game.id === opts.gameId);
		let activeRound = _.get(game, 'activeRound');
		let message = opts.message;
		let res;
		if (user.id && activeRound) {
			let wordIsCorrect = game.activeRound.wordIsCorrect(message);
			if (wordIsCorrect) {
				// If someone has already guessed the correct answer and they type it again then do nothing
				if (game.activeRound.get('userPoints')[user.id]) { return; }
				if (game.activeRound.get('drawerId') === user.id) { return; }

				let points = this.getPoints(game);
				game.activeRound.addUserPoints(user, points);
				UserSockets.notifyUsers(game.get('users'), `change:activeRoundPoints:${game.activeRound.id}`, game.activeRound.get('userPoints'));
				res = {
					text: '',
					wordIsCorrect: true,
					points: points,
					userId: user.id
				};
			} else {
				res = {
					text: message,
					wordIsCorrect: false,
					userId: user.id
				};
			}
			UserSockets.notifyUsers(game.get('users'), `gameMessage:${game.id}`, res);
		}
	}

	getPoints(game) {
		// You always get at least 25
		let points = 25;

		// +15 if you guess the correct word in the first half of the round
		let percentTimeLeftInRound = 1-((Date.now()-RoundStartTimes.get(game))/game.get('gameTime'));
		if (percentTimeLeftInRound > 0.5) {
			points += 15;
		}

		// +up to 60 depending on how many guessed correctly before you
		let numUsersWithPointsBeforeYou = game.activeRound.numUsersWithPoints();
		let numGameUsers = game.get('users').length;
		let numOtherGuessingUsers = numGameUsers-2;
		if (numOtherGuessingUsers < 1) {
			// If there is only one guesser, then just use 60
			points += 60;
		} else {
			points += 60*(numOtherGuessingUsers-numUsersWithPointsBeforeYou)/numOtherGuessingUsers;
		}

		return points;
	}
}

module.exports = (io, userAPI) => {
	return new MessageAPI(router, io, userAPI);
}