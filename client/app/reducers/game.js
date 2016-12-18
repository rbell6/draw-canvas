export default function game(state={}, action) {
	switch(action.type) {
		case 'SET_GAME':
			let {
				id,
				name,
				hostId,
				userIds,
				rounds,
				numRounds
			} = action.game;
			return Object.assign({}, state, {
				id,
				name,
				hostId,
				userIds,
				rounds,
				numRounds
			});
		case 'SET_GAME_NAME':
			return Object.assign({}, state, {
				name: action.name
			});
		default:
			return state;
	}
}