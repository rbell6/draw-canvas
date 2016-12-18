import axios from 'axios';

function _requestGameList() {
	return {
		type: 'REQUEST_GAME_LIST'
	};
}

function _receiveGameList(gameList) {
	return {
		type: 'RECEIVE_GAME_LIST',
		gameList: gameList,
		receivedAt: Date.now()
	};
}

export function streamGameList(socket) {
	return dispatch => {
		axios.get('/api/game')
			.then(res => res.data)
			.then(gameList => dispatch(_receiveGameList(gameList)));
		socket.on('change:gameList', gameList => dispatch(_receiveGameList(gameList)));
	}
}