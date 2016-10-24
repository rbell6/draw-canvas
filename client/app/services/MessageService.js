/*

	For now this is a mock service. In the future it will send/receive messages via a websocket

*/
import Message from '../models/Message';

export default class MessageService {
	constructor(game) {
		this.game = game;
	}

	addMessage(params) {
		setTimeout(() => {
			this.onAddMessage(params);
		}, 10);
	}

	onAddMessage(params) {
		this.game.get('messages').add(new Message({
			text: params.text,
			user: this.game.get('users').find(user => user.id === params.userId)
		}));
	}
}