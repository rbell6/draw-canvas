export default function game(state={}, action) {
	switch(action.type) {
		case 'SET_GAME_NAME':
			return Object.assign({}, state, {
				name: action.name
			});
		default:
			return state;
	}
}