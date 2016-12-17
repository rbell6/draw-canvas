'use strict';

let _ = require('lodash');
let express = require('express');
let router = express.Router();
let User = require('../../../models/User');
let Users = require('../Users');
let UserSockets = require('../UserSockets');
let MobileUserSockets = require('../MobileUserSockets');
let userMiddleware = require('../middleware/userMiddleware');

class UserAPI {
	constructor(router, io) {
		this.router = router;
		this.io = io;

		this.onGetUser = this.onGetUser.bind(this);
		this.onGetMobileUserConnected = this.onGetMobileUserConnected.bind(this);
		this.onSaveUserName = this.onSaveUserName.bind(this);
		this.onSocketConnection = this.onSocketConnection.bind(this);

		router.get('/', this.onGetUser);
		router.get('/mobile-user-connected', this.onGetMobileUserConnected);
		router.post('/name', userMiddleware, this.onSaveUserName);
		this.io.on('connection', this.onSocketConnection);
	}

	onGetUser(req, res) {
		let userId = _.get(req, 'session.user.id');
		let user;
		if (userId) {
			user = Users.get({id: userId});
		}
		if (!user) {
			user = new User();
			Users.add(user);
			req.session.user = user.toJSON();
		}
		res.send(user.toJSON());
	}

	onGetMobileUserConnected(req, res) {
		let userId = _.get(req, 'session.user.id');
		if (userId) {
			let user = Users.get({id: userId});
			if (user) {
				let mobileUserConnected = !!MobileUserSockets.get(user);
				res.send(mobileUserConnected);
				return;
			}
		}
		res.status(404).send('Mobile user connected not found.');
	}

	onSaveUserName(req, res) {
		let user = req.user;
		let username = _.get(req, 'body.username');
		user.set('name', username);
		res.send();
	}

	getUserForSocket(socket) {
		let userId = _.get(socket, 'request.session.user.id');
		if (!userId) {
			socket.emit('Failed to find user id from session');
			return;
		}
		let user = Users.get({id: userId});
		if (!user) {
			socket.emit('Failed to find user with id=' + userId);
			return;
		}
		return user;
	}

	isMobile(socket) {
		return _.get(socket, 'request.session.isMobile', false);
	}

	onSocketConnection(socket) {
		let user = this.getUserForSocket(socket);
		if (user) {
			if (this.isMobile(socket)) {
				MobileUserSockets.set(user, socket);
				let desktopSocket = UserSockets.get(user);
				if (desktopSocket) {
					desktopSocket.emit('mobileUserConnected');
				}
			} else {
				UserSockets.set(user, socket);
			}
			socket.emit('saveUserSocket');
		}
		socket.on('disconnect', this.onSocketDisconnect.bind(this, socket));
		socket.on('forceDisconnectMobileUser', this.forceDisconnectMobileUser.bind(this, socket));
	}

	onSocketDisconnect(socket) {
		let user = this.getUserForSocket(socket);
		if (user) {
			if (this.isMobile(socket)) {
				MobileUserSockets.delete(user);
				let desktopSocket = UserSockets.get(user);
				if (desktopSocket) {
					desktopSocket.emit('mobileUserDisconnected');
				}
			} else {
				UserSockets.delete(user);
			}
		}
	}

	forceDisconnectMobileUser(socket) {
		let user = this.getUserForSocket(socket);
		if (user) {
			let mobileSocket = MobileUserSockets.get(user);
			if (mobileSocket) {
				mobileSocket.emit('forceDisconnect');
			}
			MobileUserSockets.delete(user);
			mobileSocket.disconnect();
		}
	}
}

module.exports = io => {
	return new UserAPI(router, io);
}