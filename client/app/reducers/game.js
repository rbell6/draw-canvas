export default function game(state={}, action) {
	switch(action.type) {
		case 'RECEIVE_GAME':
			let {
				id,
				name,
				hostId,
				userIds,
				rounds,
				numRounds,
				isStarted,
				isCanceled
			} = action.game;
			return Object.assign({}, state, {
				id,
				name,
				hostId,
				userIds,
				rounds,
				numRounds,
				isStarted,
				isCanceled
			});
		case 'SET_GAME_NAME':
			return Object.assign({}, state, {
				name: action.name
			});
		case 'LEAVE_GAME':
			return {};
		default:
			return state;
	}
}