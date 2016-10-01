'use strict';

import Collection from './Collection';

export default class UserCollection extends Collection {
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
}
