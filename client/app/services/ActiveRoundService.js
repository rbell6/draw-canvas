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
		SocketService.on(`change:rounds:${game.id}`, rounds => this._onRoundsChange(rounds));
	}

	getRounds(game) {
		return axios.get(`/api/rounds/${game.id}/${UserService.get().id}`).then(res => this._onRoundsChange(res.data));
	}

	_onRoundsChange(rounds) {
		if (!rounds.length) { return; }
		this.game.set('rounds', RoundCollection.fromJSON(rounds));
	}

}
