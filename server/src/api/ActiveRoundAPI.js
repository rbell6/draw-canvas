'use strict';

let UserSockets = require('../UserSockets');
let MobileUserSockets = require('../MobileUserSockets');
let RoundStartTimes = require('../RoundStartTimes');
let WordService = require('../WordService');
let Games = require('../Games');
let words = WordService.get();
let userMiddleware = require('../middleware/userMiddleware');
let Round = require('../../../models/Round');
let _ = require('lodash');
let express = require('express');
let router = express.Router();
const interRoundDelayTime = 2000;

class ActiveRoundAPI {

	constructor(router) {
		this.router = router;
		this._roundTimeoutIds = new Map(); // {Round: timeoutId}
	
		// Get all rounds
		router.get('/:gameId', userMiddleware, (req, res) => {
			let gameId = req.params.gameId;
			let user = req.user;
			let game = Games.find(game => game.id === gameId);
			res.send(this._roundsJSON(game, user.id));
		});
	}

	userGuessedCorrectWord(user, game) {
		// If someone has already guessed the correct answer and they type it again then do nothing
		if (game.activeRound.get('userPoints')[user.id]) { return; }
		if (game.activeRound.get('drawerId') === user.id) { return; }

		let points = this.getGuesserPoints(game);
		game.activeRound.addUserPoints(user, points);
		UserSockets.notifyUsers(game.get('users'), `change:activeRoundPoints:${game.activeRound.id}`, game.activeRound.get('userPoints'));
		if (game.activeRound.numUsersWithPoints() === game.get('users').length-1 && this.timeLeftInActiveRound(game) > 0) {
			clearTimeout(this._roundTimeoutIds.get(game.activeRound));
			this.createNextRound(game);
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
		this.createNextRound(game);
	}

	createNextRound(game) {
		// First we want to give the drawer points for the round that is about to end
		this.awardDrawerPoints(game);
		if (game.get('rounds').length === game.get('numRounds')) {
			this.endGame(game);
			return;
		}
		// Give it a couple seconds before sending everyone to the next round
		setTimeout(() => {
			this._createNextRound(game);
		}, interRoundDelayTime);
	}

	_createNextRound(game) {
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

	awardDrawerPoints(game) {
		let drawer = game.activeRoundDrawer;
		if (drawer) {
			let points = this.getDrawerPoints(game);
			game.activeRound.addUserPoints(drawer, points);
			UserSockets.notifyUsers(game.get('users'), `change:activeRoundPoints:${game.activeRound.id}`, game.activeRound.get('userPoints'));
		}
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
			name: `Round ${newRoundIndex+1}`,
			index: newRoundIndex
		};
	}

	timeLeftInActiveRound(game) {
		let timeElapsed = Date.now()-RoundStartTimes.get(game);
		return game.get('gameTime')-timeElapsed;
	}

	getGuesserPoints(game) {
		// You always get at least 40
		let points = 40;

		// +15 if you guess the correct word in the first half of the round
		// let percentTimeLeftInRound = 1-((Date.now()-RoundStartTimes.get(game))/game.get('gameTime'));
		// if (percentTimeLeftInRound > 0.5) {
		// 	points += 15;
		// }

		// +up to 60 depending on how many guessed correctly before you
		let numUsersWithPointsInActiveRound = game.activeRound.numUsersWithPoints();
		let numOtherGuessingUsers = game.get('users').length-2;
		if (numOtherGuessingUsers < 1) {
			// If there is only one guesser, then just use 60
			points += 60;
		} else {
			points += Math.round(60*(numOtherGuessingUsers-numUsersWithPointsInActiveRound)/numOtherGuessingUsers);
		}

		return points;
	}

	getDrawerPoints(game) {
		let points = 0;
		let numCorrectGuessers = game.activeRound.numUsersWithPoints();
		let numTotalGuessers = game.get('users').length-1;
		let percentCorrectGuessers = numCorrectGuessers/numTotalGuessers;
		if (percentCorrectGuessers > 0.8) {
			points = 100;
		} else if (percentCorrectGuessers > 0.6) {
			points = 85;
		} else if (percentCorrectGuessers > 0.35) {
			points = 75;
		} else if (percentCorrectGuessers > 0) {
			points = 65;
		}
		return points;
	}

}

module.exports = () => {
	return new ActiveRoundAPI(router);
}