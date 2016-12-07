import User from '../../../models/User';
import SocketService from './SocketService';
import axios from 'axios';

class UserService {
	constructor() {
		this._user = null;
	}

	save(user) {
		return axios.post('/api/user', {username: user.get('name')})
			.then(res => this._setUser(res.data))
			.then(() => SocketService.initialize())
			.then(() => this._setMobileUserConnected())
			.then(() => this._user);
	}

	get() {
		return this._user;
	}

	fetch() {
		if (this._user) {
			return Promise.resolve(this._user);
		}
		return axios.get('/api/user')
			.then(res => this._setUser(res.data))
			.then(() => SocketService.initialize())
			.then(() => this._setMobileUserConnected())
			.then(() => this._user);
	}

	fetchMobile(mobileId) {
		if (this._user) {
			return Promise.resolve(this._user);
		}
		return axios.get(`/api/mobile-user/${mobileId}`)
			.then(res => this._setUser(res.data))
			.then(() => SocketService.initialize())
			.then(() => this._setMobileUserConnected())
			.then(() => this._user);
	}

	forceDisconnectMobileUser() {
		SocketService.emit('forceDisconnectMobileUser');
	}

	_setUser(userData) {
		if (!userData) { throw 'No user found'; }
		this._user = new User(userData);
		return this._user;
	}

	_setMobileUserConnected() {
		axios.get('/api/user/mobile-user-connected').then(res => {
			this._user.set('mobileUserConnected', res.data);
		});
		SocketService.on('mobileUserConnected', () => {
			this._user.set('mobileUserConnected', true);
		});
		SocketService.on('mobileUserDisconnected', () => {
			this._user.set('mobileUserConnected', false);
		});
	}
}

export default new UserService();