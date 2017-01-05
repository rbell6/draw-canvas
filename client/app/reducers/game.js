import brush from './brush';
import messages from './messages';

let defaultRound = {
	drawerId: null,
	name: 'Round',
	index: 0,
	word: null,
	percentOfTimeInitiallySpent: 0, // [0,1]
	userPoints: {} // {userId: points}
};

function rounds(state=[], action) {
	switch(action.type) {
		case 'RECEIVE_ROUNDS':
			return action.rounds.map(round => Object.assign({}, defaultRound, round));
		default:
			return state;
	}
}

export default function game(state={}, action) {
	// Nested reducers
	state = Object.assign({}, state, {
		brush: brush(state.brush, action),
		messages: messages(state.messages, action),
		rounds: rounds(state.rounds, action)
	});

	switch(action.type) {
		case 'RECEIVE_GAME':
			let {
				id,
				name,
				hostId,
				userIds,
				// rounds,
				numRounds,
				isStarted,
				isCanceled,
				isEnded,
				gameTime,
				gameState
			} = action.game;
			return Object.assign({}, state, {
				id,
				name,
				hostId,
				userIds,
				// rounds,
				numRounds,
				isStarted,
				isCanceled,
				isEnded,
				gameTime,
				gameState
			});
		case 'SET_GAME_NAME':
			return Object.assign({}, state, {
				name: action.name
			});
		case 'RESET_GAME':
			return {};
		default:
			return state;
	}
}