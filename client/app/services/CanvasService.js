import SocketService from './SocketService';
import UserService from './UserService';
import EventEmitter from '../../../models/EventEmitter';
import LineCollection from '../../../models/LineCollection';

export default class CanvasService extends EventEmitter {
	constructor(game) {
		super();
		this.game = game;
		this._onCanvasChange = this._onCanvasChange.bind(this);
		SocketService.on(`change:canvas:${game.id}`, this._onCanvasChange);
	}

	emitCanvasChange(lines) {
		SocketService.emit('change:canvas', {
			gameId: this.game.id,
			userId: UserService.get().id,
			lines: lines
		});
	}

	_onCanvasChange(lines) {
		this.emit(`change:canvas:${this.game.id}`, LineCollection.fromJSON(lines));
	}

}