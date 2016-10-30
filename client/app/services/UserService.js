import User from '../../../models/User';
import SocketService from './SocketService';
import axios from 'axios';

let UserService = {
	save: function(user) {
		return new Promise((resolve, reject) => {
			SocketService.emit('saveUser', user.toJSON(), userData => {
				this._user = new User(userData);
				window.localStorage.setItem('user', JSON.stringify(this._user.toJSON()));
				resolve(this._user);
			});
		});
	},
	_user: null,
	get: function() {
		return this._user;
	},
	fetch: function() {
		let userId = _.get(this.localUserJSON, 'id');
		if (userId) {
			return axios.get(`/api/user/${userId}`).then(res => {
				if (res.data.id) {
					this._user = new User(res.data);
				}
			});
		}
		return Promise.resolve();
	},
	get localUserJSON() {
		let userString = window.localStorage.getItem('user');
		if (userString) {
			return JSON.parse(userString);
		}
		return null;
	}
};

export default UserService;