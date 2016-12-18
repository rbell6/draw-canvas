import io from 'socket.io-client';

export default function socket(state={}, action) {
	switch(action.type) {
		case 'CREATE_SOCKET':
			return io();
		default:
			return state;
	}
}