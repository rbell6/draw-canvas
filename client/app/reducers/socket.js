export default function socket(state={}, action) {
	switch(action.type) {
		case 'CREATE_SOCKET':
			return action.socket;
		default:
			return state;
	}
}