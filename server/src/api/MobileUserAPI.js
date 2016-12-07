'use strict';

let _ = require('lodash');
let express = require('express');
let router = express.Router();
let User = require('../../../models/User');
let Users = require('../Users');
let UserSockets = require('../UserSockets');

class MobileUserAPI {
	constructor(router, io) {
		this.router = router;
		this.io = io;

		this.onGetUser = this.onGetUser.bind(this);

		router.get('/:userId', this.onGetUser);
	}

	onGetUser(req, res) {
		let userId = req.params.userId;
		if (userId) {
			let user = Users.get({id: userId});
			if (user) {
				// Save this user on the session
				req.session.user = user.toJSON();
				req.session.isMobile = true;
				res.send(user.toJSON());
				return;
			}
		}
		res.status(404).send('User not found');
	}
}

module.exports = io => {
	return new MobileUserAPI(router, io);
}