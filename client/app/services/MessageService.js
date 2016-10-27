/*

	For now this is a mock service. In the future it will send/receive messages via a websocket

*/
import Message from '../models/Message';
import UserService from './UserService';
import _ from 'lodash';

export default class MessageService {
	constructor(game) {
		this.game = game;
	}

	addMessage(params) {
		setTimeout(() => {
			let wordIsCorrect = this.wordIsCorrect();
			if (wordIsCorrect) {
				// If someone has already guessed the correct answer and they type it again then do nothing
				if (this.game.activeRound.get('userPoints')[UserService.get().id]) { return; }
				params = Object.assign({}, params, {
					text: '',
					wordIsCorrect: true,
					points: this.getPoints()
				});
			}
			this.onAddMessage(params);
		}, 10);
	}

	// Fake it for now
	wordIsCorrect() {
		return _.random(1,10) > 7;
	}

	getPoints() {
		let percentTimeLeftInRound = 1-((Date.now()-window._serverGame.activeRound.startTime)/this.game.get('gameTime'));
		return Math.round(percentTimeLeftInRound*100);
	}	

	onAddMessage(params) {
		if (params.wordIsCorrect) {
			this.game.activeRound.get('userPoints')[UserService.get().id] = params.points;
			this.game.emit('change:usersWithPoints');
		}
		this.game.get('messages').add(new Message({
			text: params.text,
			isChecked: params.wordIsCorrect,
			user: this.game.get('users').find(user => user.id === params.userId)
		}));
	}
}