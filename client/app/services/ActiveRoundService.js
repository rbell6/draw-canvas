/*

	For now this is a mock service. In the future it will send/receive messages via a websocket

*/

import _ from 'lodash';
import UserService from './UserService';

const initialDelayTime = 1000;
const words = [
	'pizza',
	'fence',
	'pumpkin',
	'doorknob',
	'ladder',
	'girl',
	'boy',
	'apple'
];

export default class ActiveRoundService {
	constructor(game) {
		this.game = game;
		setTimeout(() => {
			this.createNextRound();
		}, initialDelayTime);
	}

	createNextRound() {
		if (this.game.get('activeRoundIndex')+1<this.game.get('numRounds')) {
			_.set(window, '_serverGame.activeRound.startTime', Date.now()); // TODO make this a private param on the game on the server
			this.onActiveRoundChange(this.createNextRoundParams());
			setTimeout(() => {
				this.createNextRound();
			}, this.game.get('gameTime'));
		}
	}

	createNextRoundParams() {
		let newRoundIndex = this.game.get('activeRoundIndex')+1;
		let users = this.game.get('users');
		// let drawerId = users.getAtIndex(newRoundIndex%users.length).id;
		let drawerId = users.getAtIndex(1).id;
		return {
			drawerId: drawerId,
			word: drawerId === UserService.get().id ? _.sample(words) : null,
			percentOfTimeInitiallySpent: 0,
		};
	}

	onActiveRoundChange(e) {
		this.game.createRound({
			drawer: this.game.get('users').find(user => user.id === e.drawerId),
			word: e.word,
			percentOfTimeInitiallySpent: e.percentOfTimeInitiallySpent,
		});
	}
}
