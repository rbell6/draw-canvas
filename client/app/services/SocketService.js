import io from 'socket.io-client';

class SocketService {
	constructor() {
		this.socket = io();
	}

	emit(msg, data, cb) {
		this.socket.emit(msg, data, cb);
	}
}

export default new SocketService();