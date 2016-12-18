import axios from 'axios';

export function setGameName(name) {
	return {
		type: 'SET_GAME_NAME',
		name
	};
}

function _setGame(game) {
	return {
		type: 'SET_GAME',
		game
	};
}

export function createGame(name) {
	return dispatch => {
		return axios.post('/api/game')
			.then(res => res.data)
			// .then(game => {
			// 	dispatch(_setGame(game));
			// 	return game;
			// });
	}
}

export function fetchGame(id) {
	return dispatch => {
		return axios.get(`/api/game/${id}`)
			.then(res => res.data)
			.then(game => {
				dispatch(_setGame(game));
				return game;
			});
	}
}