import axios from 'axios';

function _requestUserList() {
	return {
		type: 'REQUEST_USER_LIST'
	};
}

function _receiveUserList(userList) {
	return {
		type: 'RECEIVE_USER_LIST',
		userList: userList,
		receivedAt: Date.now()
	};
}

export function streamUserList(socket) {
	return dispatch => {
		axios.get('/api/user/all')
			.then(res => res.data)
			.then(userList => dispatch(_receiveUserList(userList)));
		socket.on('change:userList', userList => dispatch(_receiveUserList(userList)));
	}
}