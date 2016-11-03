'use strict';

let Model = require('./Model');
let User = require('./User');

module.exports = class Message extends Model {
	static defaults() {
		return {
			user: new User(),
			text: '',
			isChecked: false
		};
	}
}