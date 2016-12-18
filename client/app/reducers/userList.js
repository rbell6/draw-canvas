export default function userList(state=[], action) {
	switch(action.type) {
		case 'RECEIVE_USER_LIST':
			return action.userList.map(user => ({
				id: user.id,
				name: user.name
			}));
		default:
			return state;
	}
}