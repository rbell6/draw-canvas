'use strict';

let _ = require('lodash');
let express = require('express');
let router = express.Router();
let User = require('../../../models/User');
let Users = require('../Users');
let UserSockets = require('../UserSockets');

class UserAPI {
	constructor(router, io) {
		this.router = router;
		this.io = io;

		this.onGetUser = this.onGetUser.bind(this);
		this.onSaveUser = this.onSaveUser.bind(this);
		this.onSocketConnection = this.onSocketConnection.bind(this);

		router.get('/', this.onGetUser);
		router.post('/', this.onSaveUser);
		this.io.on('connection', this.onSocketConnection);
	}

	onGetUser(req, res) {
		let userId = _.get(req, 'session.user.id');
		if (userId) {
			let user = Users.get({id: userId});
			if (user) {
				res.send(user.toJSON());
				return;
			}
		}
		res.send();
	}

	onSaveUser(req, res) {
		let username = _.get(req, 'body.username');
		let newUser = new User({
			name: username
		});
		Users.add(newUser);
		req.session.user = newUser.toJSON();
		res.send(newUser.toJSON());
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

	onSocketConnection(socket) {
		let user = this.getUserForSocket(socket);
		if (user) {
			UserSockets.set(user, socket);
			socket.emit('saveUserSocket');
		}
		socket.on('disconnect', this.onSocketDisconnect.bind(this, socket));
	}

	onSocketDisconnect(socket) {
		let user = this.getUserForSocket(socket);
		if (user) {
			UserSockets.delete(user);
		}
	}
}

module.exports = io => {
	return new UserAPI(router, io);
}