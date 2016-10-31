import io from 'socket.io-client';

class SocketService {
	constructor() {
		this.socket = io();
	}

	emit(msg, data, cb) {
		this.socket.emit(msg, data, cb);
	}

	on(msg, cb) {
		this.socket.on(msg, cb);
	}
}

export default new SocketService();