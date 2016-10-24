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
			this.onAddMessage(params);
		}, 10);
	}

	// Fake it for now
	wordIsCorrect() {
		return _.random(1,10) > 7;
	}	

	onAddMessage(params) {
		let wordIsCorrect = this.wordIsCorrect();
		if (wordIsCorrect) {
			this.game.activeRound.get('correctUsers').add(UserService.get());
			this.game.emit('add:correctUsers');
		}
		this.game.get('messages').add(new Message({
			text: wordIsCorrect ? '' : params.text,
			isChecked: wordIsCorrect,
			user: this.game.get('users').find(user => user.id === params.userId)
		}));
	}
}