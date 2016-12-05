import User from '../../../models/User';
import SocketService from './SocketService';
import axios from 'axios';

let UserService = {
	save: function(user) {
		return axios.post('/api/user', {username: user.get('name')})
			.then(res => this._setUser(res.data))
			.then(() => SocketService.initialize())
			.then(() => this._user);
	},
	_user: null,
	get: function() {
		return this._user;
	},
	fetch: function() {
		if (this._user) {
			return Promise.resolve(this._user);
		}
		return axios.get('/api/user')
			.then(res => this._setUser(res.data))
			.then(() => SocketService.initialize())
			.then(() => this._user);
	},
	_setUser(userData) {
		if (!userData) { throw 'No user found'; }
		this._user = new User(userData);
		return this._user;
	}
};

export default UserService;