'use strict';

let Model = require('./Model');

module.exports = class Brush extends Model {
	static defaults() {
		return {
			color: 'blue',
			size: 20,
			name: 'blue'
		};
	}
}