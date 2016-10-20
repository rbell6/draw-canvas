'use strict';

import Round from './Round';
import util from './util';
import _ from 'lodash';
import Model from './Model';
import Collection from './Collection';
import User from './User';
import UserCollection from './UserCollection';
import RoundCollection from './RoundCollection';
import MessageCollection from './RoundCollection';

export default class Game extends Model {
	constructor(data) {
		super(data);
		this.set('host', data.host);
		this.get('users').on('add', this.emit.bind(this, 'change'));
		this.get('users').on('remove', this.emit.bind(this, 'change'));
		this.get('users').add(data.host);
		this._previousDrawerIds = [];
		this._currentUserIndex = -1;

		// TODO remove
		this.get('users').add(new User({
			name: 'bilbo'
		}));
	}

	static defaults() {
		return {
			host: null,
			users: new UserCollection(),
			rounds: new Collection(),
			numRounds: 10,
			activeRoundIndex: -1,
			name: 'Untitled Game',
			messages: new Collection(),
			gameTime: 6000
		};
	}

	get activeRound() {
		return this.get('rounds').getAtIndex(this.get('activeRoundIndex'));
	}

	get activeRoundName() {
		return this.activeRound ? this.activeRound.get('name') : '';
	}

	get activeRoundDrawerName() {
		return this.activeRound ? this.activeRound.get('drawer').get('name') : '';
	}

	advanceActiveRoundIndex() {
		this.set('activeRoundIndex', this.get('activeRoundIndex')+1);
	}

	createRound() {
		this.advanceActiveRoundIndex();
		this.get('rounds').add(new Round({
			drawer: this._getNextUser(),
			name: `Round ${this.get('activeRoundIndex')+1}`
		}));
		this.emit('change:activeRound');
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
		user.on('change:connected', this.onChangeConnected.bind(this, user));
	}

	hostName() {
		return this.get('host').get('name');
	}

	numUsers() {
		return this.get('users').length;
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
