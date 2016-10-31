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
	}

	_onGameListChange(gameList) {
		this.emit('change:gameList', GameCollection.fromJSON(gameList));
	}

	getAll() {
		axios.get('/api/game').then(res => this._onGameListChange(res.data));
	}

	save(game) {
		return axios.post('/api/game', game.toJSON());
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