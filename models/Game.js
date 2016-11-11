'use strict';

let Round = require('./Round');
let util = require('./util');
let _ = require('lodash');
let Model = require('./Model');
let Collection = require('./Collection');
let User = require('./User');
let UserCollection = require('./UserCollection');
let RoundCollection = require('./RoundCollection');
let MessageCollection = require('./RoundCollection');

module.exports = class Game extends Model {
	constructor(data) {
		super(data);
		this.set('host', data.host);
		this.get('users').on('add', this.emit.bind(this, 'change'));
		this.get('users').on('remove', this.emit.bind(this, 'change'));
		this.get('users').add(data.host);
		this._previousDrawerIds = [];
		this._currentUserIndex = -1;

		// TODO remove
		// if (!this.get('users').find(user => user.get('name') === 'bilbo')) {
		// 	this.get('users').add(new User({
		// 		name: 'bilbo'
		// 	}));
		// }
		// if (!this.get('users').find(user => user.get('name') === 'frank')) {
		// 	this.get('users').getAll().unshift(new User({
		// 		name: 'frank'
		// 	}));
		// }
	}

	static defaults() {
		return {
			host: null,
			users: new UserCollection(),
			rounds: new Collection(),
			numRounds: 10,
			name: 'Untitled Game',
			messages: new Collection(),
			gameTime: 60000
		};
	}

	get activeRound() {
		return this.get('rounds').getAtIndex(this.get('rounds').length-1);
	}

	get activeRoundName() {
		return this.activeRound ? this.activeRound.get('name') : '';
	}

	get activeRoundDrawerName() {
		let drawer;
		if (this.activeRound) {
			drawer = this.get('users').find(user => user.id === this.activeRound.get('drawerId'));
		}
		if (drawer) {
			return drawer.get('name');
		}
		return '';
	}

	// [{user: User, points: Number}, ...]
	get usersWithPoints() {
		let rounds = this.get('rounds');
		return this.get('users').map(user => {
			let totalPoints = 0;
			rounds.forEach(round => {
				totalPoints += round.get('userPoints')[user.id] || 0;
			});
			return {user: user, points: totalPoints};
		}).sort((a, b) => b.points - a.points);
	}

	_getNextUser() {
		this._currentUserIndex++;
		if (this._currentUserIndex === this.get('users').length) {
			this._currentUserIndex = 0;
		}
		return this.get('users').getAtIndex(this._currentUserIndex);
	}

	_getNextRandomUser() {
		let allUsers = this.get('users').getAll();
		let nextDrawers = allUsers.filter(user => this._previousDrawerIds.indexOf(user.id) < 0);
		if (!nextDrawers.length) {
			nextDrawers = allUsers;
			this._previousDrawerIds = [];
		}
		let nextDrawer = _.sample(nextDrawers);
		this._previousDrawerIds.push(nextDrawer.id);
		return nextDrawer;
	}

	addUser(user) {
		this.get('users').add(user);
	}

	removeUser(user) {
		this.get('users').remove(user);
	}

	hostName() {
		return this.get('host').get('name');
	}

	numUsers() {
		return this.get('users').length;
	}

	userIsHost(user) {
		return this.get('host').id === user.id;
	}

	static fromJSON(json) {
		let gameJSON = _.extend(json, {
			host: new User(json.host),
			users: UserCollection.fromJSON(json.users),
			rounds: RoundCollection.fromJSON(json.rounds),
			messages: MessageCollection.fromJSON(json.messages)
		});
		return new this(gameJSON);
	}
}
