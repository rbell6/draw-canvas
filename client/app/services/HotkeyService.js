import EventEmitter from '../models/EventEmitter';

class HotkeyService extends EventEmitter {
	constructor() {
		super();
		window.addEventListener('keydown', e => {
			if (String.fromCharCode(e.keyCode).toLowerCase() === 'z' && e.metaKey) {
				this.emit('undo');
			}
		});
	}
}

export default new HotkeyService();