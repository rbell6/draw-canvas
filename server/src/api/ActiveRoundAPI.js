'use strict';

let UserSockets = require('../UserSockets');
let MobileUserSockets = require('../MobileUserSockets');
let RoundStartTimes = require('../RoundStartTimes');
let WordService = require('../WordService');
let Games = require('../Games');
let words = WordService.get();
let Round = require('../../../models/Round');
let _ = require('lodash');
let express = require('express');
let router = express.Router();
const initialDelayTime = 1000;

class ActiveRoundAPI {

	constructor(router) {
		this.router = router;
		this._roundTimeoutIds = new Map(); // {Round: timeoutId}
	
		// Get all rounds
		router.get('/:gameId/:userId', (req, res) => {
			let gameId = req.params.gameId;
			let userId = req.params.userId;
			let game = Games.find(game => game.id === gameId);
			res.send(this._roundsJSON(game, userId));
		});
	}

	userGuessedCorrectWord(user, game) {
		// If someone has already guessed the correct answer and they type it again then do nothing
		if (game.activeRound.get('userPoints')[user.id]) { return; }
		if (game.activeRound.get('drawerId') === user.id) { return; }

		let points = this.getPoints(game);
		game.activeRound.addUserPoints(user, points);
		UserSockets.notifyUsers(game.get('users'), `change:activeRoundPoints:${game.activeRound.id}`, game.activeRound.get('userPoints'));
		if (game.activeRound.numUsersWithPoints() === game.get('users').length-1) {
			clearTimeout(this._roundTimeoutIds.get(game.activeRound));
			// Give it a couple seconds before sending everyone to the next round
			setTimeout(() => {
				this.createNextRound(game);
			}, 2000);
		}
		return points;
	}

	_roundsJSON(game, userId) {
		let roundsJSON = game.get('rounds').toJSON();
		if (!roundsJSON.length) {
			return [];
		}
		// In the current round, we only want to send the word with the drawer
		let currentRoundJSON = roundsJSON[roundsJSON.length-1];
		if (currentRoundJSON.drawerId !== userId) {
			currentRoundJSON.word = null;
		}
		currentRoundJSON.percentOfTimeInitiallySpent = (Date.now()-RoundStartTimes.get(game))/game.get('gameTime');
		return roundsJSON;
	}

	startGame(game) {
		// Give everyone a second before beginning
		setTimeout(() => {
			this.createNextRound(game);
		}, initialDelayTime);
	}

	createNextRound(game) {
		if (game.get('rounds').length === game.get('numRounds')) {
			this.endGame(game);
		}
		RoundStartTimes.set(game, Date.now());
		let params = this.createNextRoundParams(game);
		if (game.activeRound) {
			this._roundTimeoutIds.delete(game.activeRound);
		}
		game.get('rounds').add(new Round(params));
		game.get('users').forEach(user => {
			let socket = UserSockets.get(user);
			if (socket) {
				socket.emit(`change:rounds:${game.id}`, this._roundsJSON(game, user.id));
			}
			let mobileSocket = MobileUserSockets.get(user);
			if (mobileSocket) {
				mobileSocket.emit(`change:rounds:${game.id}`, this._roundsJSON(game, user.id));
				mobileSocket.emit(`this is mobile`);
			}
		});
		let timeoutId = setTimeout(() => {
			this.createNextRound(game);
		}, game.get('gameTime'));
		this._roundTimeoutIds.set(game.activeRound, timeoutId);
	}

	endGame(game) {
		game.get('users').forEach(user => {
			let socket = UserSockets.get(user);
			if (socket) {
				socket.emit(`endGame:${game.id}`);
			}
			let mobileSocket = MobileUserSockets.get(user);
			if (mobileSocket) {
				mobileSocket.emit(`endGame:${game.id}`);
			}
		});	
		Games.remove(game);
		UserSockets.notifyAll('change:gameList', Games.toJSON());
	}

	createNextRoundParams(game) {
		let newRoundIndex = game.get('rounds').length;
		let users = game.get('users');
		let drawer = users.getAtIndex(newRoundIndex%users.length);
		let drawerId = _.get(drawer, 'id');
		return {
			drawerId: drawerId,
			word: _.sample(words).toLowerCase(),
			percentOfTimeInitiallySpent: 0,
			name: `Round ${newRoundIndex+1}`
		};
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
		let numUsersWithPointsInActiveRound = game.activeRound.numUsersWithPoints();
		let numOtherGuessingUsers = game.get('users').length-2;
		if (numOtherGuessingUsers < 1) {
			// If there is only one guesser, then just use 60
			points += 60;
		} else {
			points += 60*(numOtherGuessingUsers-numUsersWithPointsInActiveRound)/numOtherGuessingUsers;
		}

		return points;
	}

}

module.exports = () => {
	return new ActiveRoundAPI(router);
}