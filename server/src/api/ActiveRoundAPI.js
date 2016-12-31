'use strict';

let UserSockets = require('../UserSockets');
let MobileUserSockets = require('../MobileUserSockets');
let RoundStartTimes = require('../RoundStartTimes');
let WordService = require('../WordService');
let Games = require('../Games');
let userMiddleware = require('../middleware/userMiddleware');
let Round = require('../../../models/Round');
let _ = require('lodash');
let express = require('express');
let router = express.Router();
const roundStartDelayTime = 2000;

class ActiveRoundAPI {

	constructor(router) {
		this.router = router;
		this._roundTimeoutIds = new Map(); // {Round: timeoutId}
		this.wordService = new WordService();

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
		this.notifyUsersOfRoundsChange(game);
		// UserSockets.notifyUsers(game.get('users'), `change:activeRoundPoints:${game.activeRound.id}`, game.activeRound.get('userPoints'));
		if (game.activeRound.numUsersWithPoints() === game.get('users').length-1 && this.timeLeftInActiveRound(game) > 0) {
			clearTimeout(this._roundTimeoutIds.get(game.activeRound));
			this.endRound(game);
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
		if (!game.get('isEnded') && currentRoundJSON.drawerId !== userId) {
			currentRoundJSON.word = null;
		}
		if (RoundStartTimes.get(game)) {
			currentRoundJSON.percentOfTimeInitiallySpent = (Date.now()-RoundStartTimes.get(game))/game.get('gameTime');
		}
		return roundsJSON;
	}

	startGame(game) {
		this.createNextRound(game, {roundStartDelayTime: roundStartDelayTime});
	}

	endRound(game) {
		this.awardDrawerPoints(game);
		if (game.get('rounds').length === game.get('numRounds')) {
			this.endGame(game);
		} else {
			this.createNextRound(game);
		}
	}

	createNextRound(game, opts) {
		opts = opts || {};
		
		let params = this.createNextRoundParams(game);
		if (game.activeRound) {
			this._roundTimeoutIds.delete(game.activeRound);
		}
		game.get('rounds').add(new Round(params));
		this.notifyUsersOfRoundsChange(game);

		setTimeout(() => {
			this.startRound(game);
		}, opts.roundStartDelayTime || roundStartDelayTime);
	}

	startRound(game) {
		RoundStartTimes.set(game, Date.now());
		game.activeRound.set('started', true);
		this.notifyUsersOfRoundsChange(game);
		let timeoutId = setTimeout(() => {
			this.endRound(game);
		}, game.get('gameTime'));
		this._roundTimeoutIds.set(game.activeRound, timeoutId);
	}

	awardDrawerPoints(game) {
		let drawer = game.activeRoundDrawer;
		if (drawer) {
			let points = this.getDrawerPoints(game);
			game.activeRound.addUserPoints(drawer, points);
			this.notifyUsersOfRoundsChange(game);
			// UserSockets.notifyUsers(game.get('users'), `change:activeRoundPoints:${game.activeRound.id}`, game.activeRound.get('userPoints'));
		}
	}

	endGame(game) {
		game.set('isEnded', true);
		this.notifyUsersOfRoundsChange(game);
		UserSockets.notifyUsers(game.get('users'), `change:game:${game.id}`, game.toJSON());

		// game.get('users').forEach(user => {
		// 	let socket = UserSockets.get(user);
		// 	if (socket) {
		// 		socket.emit(`endGame:${game.id}`);
		// 	}
			// let mobileSocket = MobileUserSockets.get(user);
			// if (mobileSocket) {
			// 	mobileSocket.emit(`endGame:${game.id}`);
			// }
		// });	
		// Games.remove(game);
		// UserSockets.notifyAll('change:gameList', Games.toJSON());
	}

	notifyUsersOfRoundsChange(game) {
		game.get('users').forEach(user => {
			let socket = UserSockets.get(user);
			if (socket) {
				socket.emit(`change:rounds:${game.id}`, this._roundsJSON(game, user.id));
			}
		});
	}

	createNextRoundParams(game) {
		let newRoundIndex = game.get('rounds').length;
		let users = game.get('users');
		let drawer = users.getAtIndex(newRoundIndex%users.length);
		let drawerId = _.get(drawer, 'id');
		return {
			drawerId: drawerId,
			word: this.wordService.getWord(),
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