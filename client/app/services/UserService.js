import User from '../../../models/User';
import SocketService from './SocketService';

let UserService = {
	save: function(user) {
		this._user = user;
		window.localStorage.setItem('user', JSON.stringify(this._user.toJSON()));
		return new Promise((resolve, reject) => {
			SocketService.emit('saveUser', this._user.toJSON(), resolve);
		});
	},
	_user: null,
	get: function() {
		if (!this._user) {
			if (this.localUserJSON) {
				this._user = new User(this.localUserJSON);
			}
		}
		return this._user;
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