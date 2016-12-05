'use strict';

let _ = require('lodash');
let express = require('express');
let router = express.Router();
let Game = require('../../../models/Game');
let Games = require('../Games');
let Users = require('../Users');
let UserSockets = require('../UserSockets');
let userMiddleware = require('../middleware/userMiddleware');

function gameMiddleware(req, res, next) {
	let gameId = _.get(req, 'params.gameId');
	if (!gameId) {
		res.status(400).send('You must provide a game id');
		return;
	}
	let game = Games.get({id: gameId});
	if (!game) {
		res.status(404).send('Failed to find game with id=' + gameId);
		return;
	}
	req.game = game;
	next();
}

class GameAPI {
	constructor(router, activeRoundAPI) {
		this.router = router;
		this.activeRoundAPI = activeRoundAPI;

		this.getAllGames = this.getAllGames.bind(this);
		this.getGameById = this.getGameById.bind(this);
		this.createGame = this.createGame.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.updateGameName = this.updateGameName.bind(this);
		this.startGame = this.startGame.bind(this);
		this.deleteGame = this.deleteGame.bind(this);
		this.removeUserFromGame = this.removeUserFromGame.bind(this);

		router.get('/', this.getAllGames);
		router.get('/:gameId', gameMiddleware, this.getGameById);
		router.post('/', userMiddleware, this.createGame); 
		router.post('/:gameId', userMiddleware, gameMiddleware, this.joinGame);
		router.post('/:gameId/name', userMiddleware, gameMiddleware, this.updateGameName);
		router.post('/:gameId/start', userMiddleware, gameMiddleware, this.startGame);
		router.delete('/:gameId', userMiddleware, gameMiddleware, this.deleteGame);
		router.delete('/:gameId/user', userMiddleware, gameMiddleware, this.removeUserFromGame);
	}

	getAllGames(req, res) {
		res.send(Games.getAll());
	}

	getGameById(req, res) {
		let game = req.game;
		res.send(game.toJSON());
	}

	createGame(req, res) {
		let user = req.user;
		let game = new Game({
			name: req.body.name,
			host: user
		});
		Games.add(game);
		UserSockets.notifyAll('change:gameList', Games.toJSON());
		res.send(game.toJSON());
	}

	joinGame(req, res) {
		let user = req.user;
		let game = req.game;
		if (!_.find(game.get('users'), {id: user.id})) {
			game.addUser(user);
			UserSockets.notifyUsers(game.get('users'), 'change:game', game);
			UserSockets.notifyAll('change:gameList', Games.toJSON());
		}
		res.send(game.toJSON());
	}

	updateGameName(req, res) {
		let user = req.user;
		let game = req.game;
		let gameName = _.get(req, 'body.gameName');
		// Only allow the host to update the game name
		if (game.get('host').id !== user.id) {
			res.status(403).send('You are not authorized to perform this action');
			return;
		}
		game.set('name', gameName);
		UserSockets.notifyUsers(game.get('users'), 'change:game', game.toJSON());
		UserSockets.notifyAll('change:gameList', Games.toJSON())
		res.send(game.toJSON());
	}

	startGame(req, res) {
		let user = req.user;
		let game = req.game;
		// Only allow the host to start the game
		if (game.get('host').id !== user.id) {
			res.status(403).send('You are not authorized to perform this action');
			return;
		}
		this.activeRoundAPI.startGame(game);
		UserSockets.notifyUsers(game.get('users'), 'startGame', game);
		res.send(game.toJSON());
	}

	deleteGame(req, res) {
		let game = req.game;
		let user = req.user;
		// Only allow the host to delete
		if (game.get('host').id !== user.id) {
			res.status(403).send('You are not authorized to perform this action');
			return;
		}
		Games.remove({id: game.id});
		UserSockets.notifyAll('change:gameList', Games.toJSON());
		UserSockets.notifyUsers(game.get('users'), 'leaveGame');
		res.send(game.toJSON());
	}

	removeUserFromGame(req, res) {
		let game = req.game;
		let user = req.user;
		if (game.get('users').find({id: user.id})) {
			game.removeUser(user);
			UserSockets.notifyUsers(game.get('users'), 'change:game', game);
		}
		res.send();
	}
}

module.exports = activeRoundAPI => {
	return new GameAPI(router, activeRoundAPI);
};