import SocketService from './SocketService';
import UserService from './UserService';
import EventEmitter from '../../../models/EventEmitter';
import LineCollection from '../../../models/LineCollection';

export default class CanvasService extends EventEmitter {
	constructor(game) {
		super();
		this.game = game;
		this._onCanvasChange = this._onCanvasChange.bind(this);
		SocketService.on(`change:canvas:${this.game.id}`, this._onCanvasChange);
	}

	destroy() {
		SocketService.off(`change:canvas:${this.game.id}`, this._onCanvasChange);
	}

	emitCanvasChange(lines, aspectRatio) {
		SocketService.emit('change:canvas', {
			gameId: this.game.id,
			userId: UserService.get().id,
			lines: lines,
			aspectRatio: aspectRatio
		});
	}

	_onCanvasChange(lines, aspectRatio) {
		this.emit(`change:canvas:${this.game.id}`, {
			lines: LineCollection.fromJSON(lines), 
			aspectRatio: aspectRatio
		});
	}

}
