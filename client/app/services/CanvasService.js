import EventEmitter from '../../../models/EventEmitter';
import LineCollection from '../../../models/LineCollection';

export default class CanvasService extends EventEmitter {
	constructor(game, socket) {
		super();
		this.game = game;
		this.socket = socket;
		this._onCanvasChange = this._onCanvasChange.bind(this);
		this.socket.on(`change:canvas:${this.game.id}`, this._onCanvasChange);
	}

	destroy() {
		this.socket.off(`change:canvas:${this.game.id}`, this._onCanvasChange);
	}

	emitCanvasChange(lines, aspectRatio) {
		this.socket.emit('change:canvas', {
			gameId: this.game.id,
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
