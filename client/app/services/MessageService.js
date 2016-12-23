import Message from '../../../models/Message';
import EventEmitter from '../../../models/EventEmitter';
import UserService from './UserService';
import _ from 'lodash';

export default class MessageService extends EventEmitter {
	constructor(game, socket, dispatchAddMessage) {
		super();
		this.game = game;
		this.socket = socket;
		this.dispatchAddMessage = dispatchAddMessage;
		this.onReceiveMessage = this.onReceiveMessage.bind(this);
		this.socket.on(`gameMessage:${game.id}`, this.onReceiveMessage);
	}

	destroy() {
		this.socket.off(`gameMessage:${game.id}`, this.onReceiveMessage);
	}

	addMessage(message) {
		this.socket.emit('gameMessage', {
			gameId: this.game.id,
			message: message
		});
	}

	onReceiveMessage(params) {
		// if (params.wordIsCorrect) {
		// 	this.game.emit('change:usersWithPoints');
		// 	if (params.userId === UserService.get().id) {
		// 		this.emit('userGuessedCorrectWord');
		// 	}
		// }
		this.dispatchAddMessage({
			id: params.id,
			text: params.text,
			isChecked: params.wordIsCorrect,
			userId: params.userId
		});
	}
}