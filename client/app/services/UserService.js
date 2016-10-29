import User from '../../../models/User';

let UserService = {
	save: function() {
		window.localStorage.setItem('user', JSON.stringify(this._user.toJSON()));
	},
	_user: null,
	get: function() {
		if (!this._user) {
			let userString = window.localStorage.getItem('user');
			let userJSON;
			if (userString) {
				userJSON = JSON.parse(userString);
			}
			this._user = new User(userJSON);
		}
		return this._user;
	}
};

export default UserService;