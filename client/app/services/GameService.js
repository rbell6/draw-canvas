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
		this._registerSocketListeners = this._registerSocketListeners.bind(this);
		SocketService.onInitialize(this._registerSocketListeners);
	}

	_registerSocketListeners() {
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
			if (res.data && res.data !== '') {
				return Game.fromJSON(res.data)
			}
			return null;
		});
	}

	getFromUserId(userId) {
		return axios.get(`/api/game/userId/${userId}`).then(res => {
			if (res.data && res.data !== '') {
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
		return axios.post(`/api/game/${game.id}/name`, {
			gameName: name
		});
	}

	startGame(game) {
		return axios.post(`/api/game/${game.id}/start`, {
			gameId: game.id
		});
	}
}

export default new GameService();