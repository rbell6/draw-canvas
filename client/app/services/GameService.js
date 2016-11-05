import GameCollection from '../../../models/GameCollection';
import Game from '../../../models/Game';
import User from '../../../models/User';
import EventEmitter from '../../../models/EventEmitter';
import _ from 'lodash';
import axios from 'axios';
import SocketService from './SocketService';

class GameService extends EventEmitter {
	constructor() {
		super();
		SocketService.on('change:gameList', gameList => this._onGameListChange(gameList));
		SocketService.on('change:game', game => this._onGameChange(game));
		SocketService.on('leaveGame', () => this._onLeaveGame());
		SocketService.on('startGame', () => this._onStartGame());
	}

	_onGameListChange(gameList) {
		this.emit('change:gameList', GameCollection.fromJSON(gameList));
	}

	_onGameChange(game) {
		this.emit('change:game', Game.fromJSON(game));
	}

	_onLeaveGame() {
		this.emit('leaveGame');
	}

	_onStartGame() {
		this.emit('startGame');
	}

	getAll() {
		return axios.get('/api/game').then(res => GameCollection.fromJSON(res.data));
	}

	getById(id) {
		return axios.get(`/api/game/${id}`).then(res => {
			if (res.data) {
				return Game.fromJSON(res.data)
			}
			return null;
		});
	}

	save(game) {
		return axios.post('/api/game', game.toJSON()).then(res => Game.fromJSON(res.data));
	}

	delete(game) {
		return axios.delete(`/api/game/${game.id}`).then(res => Game.fromJSON(res.data));
	}

	joinGame(game) {
		return axios.post(`/api/game/${game.id}`).then(res => Game.fromJSON(res.data));
	}

	leaveGame(game) {
		return axios.delete(`/api/game/${game.id}/user`);
	}

	updateGameName(game, name) {
		return axios.post('/api/game/name', {
			gameId: game.id,
			gameName: name
		});
	}

	startGame(game) {
		return axios.post('/api/game/start', {
			gameId: game.id
		});
	}
}

// let GameService = {
// 	add: function(game) {
// 		console.log('g', game.toJSON());
// 		return axios.post('/api/game', game.toJSON());
// 		// this.getAll().add(game);
// 		// this.save();
// 	},
// 	remove: function(game) {
// 		this.getAll().remove(game);
// 		this.save();
// 	},
// 	save: function() {
// 		window.localStorage.setItem('gameCollection', JSON.stringify(this.getAll().toJSON()));
// 	},
// 	getAll: function() {
// 		if (!this._gameCollection) {
// 			this._gameCollection = new GameCollection();
// 			let gameCollectionString = window.localStorage.getItem('gameCollection');
// 			let gameCollectionJSON;
// 			if (gameCollectionString) {
// 				gameCollectionJSON = JSON.parse(gameCollectionString);
// 				gameCollectionJSON.forEach(gameJSON => this._gameCollection.add(Game.fromJSON(gameJSON)));
// 			}
// 		}
// 		return this._gameCollection;
// 	},
// 	getGameList: () => {
// 		return axios.get('/api/gameList').then(res => res.data);
// 	},
// 	getById: function(id) {
// 		return this.getAll().find({id: id});
// 	},
// 	_gameCollection: null
// };

export default new GameService();