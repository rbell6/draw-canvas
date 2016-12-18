'use strict';

class UserSockets extends Map {
	notifyUsers(users, message, data) {
		users.forEach(user => {
			let socket = this.get(user);
			if (socket) {
				socket.emit(message, data);
			}
		});
	}

	notifyAll(message, data) {
		this.forEach(socket => {
			socket.emit(message, data);
		});
	}

	allUsers() {
		let users = [];
		this.forEach((socket, user) => {
			users.push(user);
		});
		return users;
	}
}

module.exports = new UserSockets();