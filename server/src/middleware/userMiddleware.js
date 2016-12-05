'use strict';

let _ = require('lodash');
let Users = require('../Users');

function userMiddleware(req, res, next) {
	let userId = _.get(req, 'session.user.id');
	if (!userId) {
		res.status(400).send('Failed to find user id from the session');
		return;
	}
	let user = Users.get({id: userId});
	if (!user) {
		res.status(404).send('Failed to find user with id=' + userId);
		return;
	}
	req.user = user;
	next();
}

module.exports = userMiddleware;