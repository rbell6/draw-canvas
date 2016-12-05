import io from 'socket.io-client';
import _ from 'lodash';

class SocketService {
	constructor() {
		this._onInitialize = [];
	}

	initialize() {
		return new Promise((resolve, reject) => {
			this.socket = io();
			this._onInitialize.forEach(fn => fn());
			this.on('saveUserSocket', () => resolve());
		});
	}

	onInitialize(cb) {
		this._onInitialize.push(cb);
	}

	emit(msg, data, cb) {
		this.socket.emit(msg, data, cb);
	}

	on(msg, cb) {
		this.socket.on(msg, cb);
	}

	off(msg, cb) {
		this.socket.off(msg, cb);
	}
}

export default new SocketService();