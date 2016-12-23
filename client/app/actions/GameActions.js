import axios from 'axios';

export function setGameName(name) {
	return {
		type: 'SET_GAME_NAME',
		name
	};
}

export function setBrushColor(color) {
	return {
		type: 'SET_BRUSH_COLOR',
		color
	};
}

export function setBrushSize(size) {
	return {
		type: 'SET_BRUSH_SIZE',
		size
	};
}

export function setBrushEraser() {
	return {
		type: 'SET_BRUSH_ERASER'
	};
}

function _receiveGame(game) {
	return {
		type: 'RECEIVE_GAME',
		game
	};
}

function _receiveRounds(rounds) {
	return {
		type: 'RECEIVE_ROUNDS',
		rounds
	};
}

export function resetGame() {
	return {
		type: 'RESET_GAME'
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

export function streamGame(socket, gameId) {
	return dispatch => {
		let dispatchReceiveGame = game => dispatch(_receiveGame(game));
		socket.on(`change:game:${gameId}`, dispatchReceiveGame);
		let unstreamGame = () => socket.off(`change:game:${gameId}`, dispatchReceiveGame);
		return axios.get(`/api/game/${gameId}`)
			.then(res => res.data)
			.then(game => dispatch(_receiveGame(game)))
			.then(() => unstreamGame);
	};
}

export function streamRounds(socket, gameId) {
	return dispatch => {
		let dispatchReceiveRounds = rounds => dispatch(_receiveRounds(rounds));
		socket.on(`change:rounds:${gameId}`, dispatchReceiveRounds);
		let unstreamRounds = () => socket.off(`change:rounds:${gameId}`, dispatchReceiveRounds);
		return axios.get(`/api/rounds/${gameId}`)
			.then(res => res.data)
			.then(rounds => dispatch(_receiveRounds(rounds)))
			.then(() => unstreamRounds);
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

export function addMessage(message) {
	return {
		type: 'ADD_MESSAGE',
		message
	};
}

