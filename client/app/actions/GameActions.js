import axios from 'axios';

export function setGameName(name) {
	return {
		type: 'SET_GAME_NAME',
		name
	};
}

function _receiveGame(game) {
	return {
		type: 'RECEIVE_GAME',
		game
	};
}

function _leaveGame() {
	return {
		type: 'LEAVE_GAME'
	};
}

export function createGame(name) {
	return dispatch => {
		return axios.post('/api/game')
			.then(res => res.data);
	};
}

export function startGame(id) {
	return dispatch => {
		return axios.post(`/api/game/${id}/start`)
			.then(res => res.data);
	};
}

export function streamGame(socket, id) {
	return dispatch => {
		socket.on(`change:game:${id}`, game => dispatch(_receiveGame(game)));
		return axios.get(`/api/game/${id}`)
			.then(res => res.data)
			.then(game => dispatch(_receiveGame(game)));
	};
}

export function unstreamGame(socket, id) {
	return dispatch => {
		dispatch(_leaveGame());
		socket.off(`change:game:${id}`);
	};
}

export function joinGame(id) {
	return dispatch => {
		axios.post(`/api/game/${id}`);
	};
}

export function cancelGame(id) {
	return dispatch => {
		axios.delete(`/api/game/${id}`);
	};
}

export function leaveGame(id) {
	return dispatch => {
		axios.delete(`/api/game/${id}/user`);
	};
}

export function saveGameName(id, name) {
	return dispatch => {
		return axios.post(`/api/game/${id}/name`, {
			gameName: name
		});
	};
}

