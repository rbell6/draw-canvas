export default function user(state={}, action) {
	state.name = state.name || '';
	switch(action.type) {
		case 'SET_USER_NAME':
			return Object.assign({}, state, {
				name: action.name,
				isFetching: false
			});
		case 'REQUEST_USER':
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});
		case 'RECEIVE_USER':
			return Object.assign({}, state, {
				id: action.user.id,
				name: action.user.name,
				mobileUserConnected: action.user.mobileUserConnected,
				isFetching: false,
				didInvalidate: false,
				lastUpdated: action.receivedAt
			});
		default:
			return state;
	}
}