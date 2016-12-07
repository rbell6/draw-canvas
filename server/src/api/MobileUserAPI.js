'use strict';

let _ = require('lodash');
let express = require('express');
let router = express.Router();
let User = require('../../../models/User');
let Users = require('../Users');
let UserSockets = require('../UserSockets');
let UserMobileLinkIds = require('../UserMobileLinkIds');
let userMiddleware = require('../middleware/userMiddleware');

class MobileUserAPI {
	constructor(router, io) {
		this.router = router;
		this.io = io;

		this.onGetUser = this.onGetUser.bind(this);
		this.onGetLink = this.onGetLink.bind(this);

		router.get('/link', userMiddleware, this.onGetLink);
		router.get('/:mobileLinkId', this.onGetUser);
	}

	onGetUser(req, res) {
		let mobileLinkId = req.params.mobileLinkId;
		if (mobileLinkId) {
			let user;
			UserMobileLinkIds.forEach((_linkId, _user) => {
				if (_linkId === mobileLinkId) {
					user = _user;
					return false;
				}
			});
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

	onGetLink(req, res) {
		let user = req.user;
		if (UserMobileLinkIds.has(user)) {
			res.send(UserMobileLinkIds.get(user));
			return;
		}
		let linkId = this.generateRandomLinkId(4);
		UserMobileLinkIds.forEach(usedLinkId => {
			if (linkId === usedLinkId) {
				res.status(500).send('Error while creating mobile link id');
				return;
			}
		});
		UserMobileLinkIds.set(user, linkId);
		res.send(linkId);
	}

	generateRandomLinkId(length) {
		let linkId = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var j=0; j<length; j++) {
			linkId += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return linkId;
	}
}

module.exports = io => {
	return new MobileUserAPI(router, io);
}