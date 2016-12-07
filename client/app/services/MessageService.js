import Message from '../../../models/Message';
import EventEmitter from '../../../models/EventEmitter';
import UserService from './UserService';
import SocketService from './SocketService';
import _ from 'lodash';

export default class MessageService extends EventEmitter {
	constructor(game) {
		super();
		this.game = game;
		this.onAddMessage = this.onAddMessage.bind(this);
		SocketService.on(`gameMessage:${game.id}`, this.onAddMessage);
	}

	destroy() {
		SocketService.off(`gameMessage:${game.id}`, this.onAddMessage);
	}

	addMessage(message) {
		SocketService.emit('gameMessage', {
			gameId: this.game.id,
			message: message
		});
	}

	onAddMessage(params) {
		if (params.wordIsCorrect) {
			this.game.emit('change:usersWithPoints');
			if (params.userId === UserService.get().id) {
				this.emit('userGuessedCorrectWord');
			}
		}
		this.game.get('messages').add(new Message({
			text: params.text,
			isChecked: params.wordIsCorrect,
			user: this.game.get('users').find(user => user.id === params.userId)
		}));
	}
}