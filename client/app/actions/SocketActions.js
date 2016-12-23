import io from 'socket.io-client';

function _createSocket(socket) {
	return {
		type: 'CREATE_SOCKET',
		socket
	};
}

export function createSocket() {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let socket = io();
			socket.on('saveUserSocket', () => {
				dispatch(_createSocket(socket));
				resolve(socket);
			});
		});
	};
}