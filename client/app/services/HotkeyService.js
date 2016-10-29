import EventEmitter from '../../../models/EventEmitter';

const ENTER_KEY = 13;

class HotkeyService extends EventEmitter {
	constructor() {
		super();
		window.addEventListener('keydown', e => {
			if (String.fromCharCode(e.keyCode).toLowerCase() === 'z' && e.metaKey) {
				this.emit('undo');
			} else if (e.keyCode === ENTER_KEY) {
				this.emit('enter');
			}
		});
	}
}

export default new HotkeyService();