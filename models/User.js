'use strict';

let _ = require('lodash');
let Model = require('./Model');

module.exports = class User extends Model {
	static defaults() {
		return {
			connected: true,
			name: '',
			mobileUserConnected: false
		};
	}

	toJSON() {
		var json = super.toJSON();
		return _.omit(json, ['socket', 'game']);
	}
}
