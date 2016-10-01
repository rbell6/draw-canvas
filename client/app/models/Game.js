'use strict';

import Round from './Round';
import util from './util';
import _ from 'lodash';
import Model from './Model';
import Collection from './Collection';

export default class Game extends Model {
	constructor(data) {
		super(data);
		this.set('host', data.host);
		this.get('users').on('add', this.emit.bind(this, 'change'));
		this.get('users').on('remove', this.emit.bind(this, 'change'));
		this.get('users').add(data.host);
	}

	static defaults() {
		return {
			id: util.guid(),
			host: null,
			users: new Collection(),
			rounds: new Collection(),
			activeRound: new Round(),
			name: 'Untitled Game'
		};
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
}
