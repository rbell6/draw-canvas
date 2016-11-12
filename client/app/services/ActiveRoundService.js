import _ from 'lodash';
import UserService from './UserService';
import SocketService from './SocketService';
import RoundCollection from '../../../models/RoundCollection';
import EventEmitter from '../../../models/EventEmitter';
import axios from 'axios';

export default class ActiveRoundService extends EventEmitter {
	constructor(game) {
		super();
		this.game = game;
		this._onActiveRoundPointsChange = this._onActiveRoundPointsChange.bind(this);
		this._onRoundsChange = this._onRoundsChange.bind(this);
		this._onEndGame = this._onEndGame.bind(this);
		SocketService.on(`change:rounds:${game.id}`, this._onRoundsChange);
		SocketService.on(`endGame:${game.id}`, this._onEndGame);
	}

	destroy() {
		SocketService.off(`change:rounds:${game.id}`, this._onRoundsChange);
		SocketService.off(`endGame:${game.id}`, this._onEndGame);
		if (this.game.activeRound) {
			SocketService.off(`change:activeRoundPoints:${this.game.activeRound.id}`, this._onActiveRoundPointsChange);
		}
	}

	getRounds() {
		return axios.get(`/api/rounds/${this.game.id}/${UserService.get().id}`).then(res => this._onRoundsChange(res.data));
	}

	_onRoundsChange(rounds) {
		if (!rounds.length) { return; }
		this.game.set('rounds', RoundCollection.fromJSON(rounds));
		if (game.get('rounds').length > 1) {
			let prevRound = this.game.get('rounds').getAtIndex(this.game.get('rounds').length-1);
			SocketService.off(`change:activeRoundPoints:${prevRound.id}`, this._onActiveRoundPointsChange);
		}
		SocketService.on(`change:activeRoundPoints:${this.game.activeRound.id}`, this._onActiveRoundPointsChange);
	}

	_onActiveRoundPointsChange(points) {
		this.game.activeRound.set('userPoints', points);
	}

	_onEndGame() {
		this.emit('endGame');
	}

}
