import axios from 'axios';

function _setUserName(name) {
	return {
		type: 'SET_USER_NAME',
		name
	};
}

function _requestUser() {
	return {
		type: 'REQUEST_USER'
	};
}

function _receiveUser(user) {
	return {
		type: 'RECEIVE_USER',
		user: user,
		receivedAt: Date.now()
	};
}

export function fetchUser() {
  return dispatch => {
    dispatch(_requestUser())
    return axios.get('/api/user')
      .then(res => res.data)
      .then(user => dispatch(_receiveUser(user)))
  }
}

export function saveUserName(name) {
  return dispatch => {
    // dispatch(_requestUser())
    return axios.post('/api/user/name', {username: name})
      .then(res => res.data)
      .then(() => dispatch(_setUserName(name)));
  }
}