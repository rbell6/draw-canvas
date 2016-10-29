'use strict';

let util = require('./util');
let _ = require('lodash');
let Model = require('./Model');

module.exports = class User extends Model {
	static defaults() {
		return {
			connected: true,
			name: ''
		};
	}

	toJSON() {
		var json = super.toJSON();
		return _.omit(json, ['socket', 'game']);
	}
}
