'use strict';

let Collection = require('./Collection');
let User = require('./User');

module.exports = class UserCollection extends Collection {
	add(user) {
		super.add(user);
		user.on('change:connected', this.onChangeConnected.bind(this, user));
	}

	// Remove a user when they become disconnected
	onChangeConnected(user, e) {
		if (!e.newValue) {
			this.remove(user);
		}
	}

	notifyAll(event, data) {
		this.getAll().forEach(user => user.notify(event, data));
	}

	static fromJSON(json) {
		let userCollection = new UserCollection();
		json.forEach(user => userCollection.add(new User(user)));
		return userCollection;
	}
}
