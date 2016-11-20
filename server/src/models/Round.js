'use strict';

let Model = require('./Model');
let Collection = require('./Collection');

module.exports = class Round extends Model {
	
	static defaults() {
		return {
			drawerId: null,
			name: 'Round',
			index: 0,
			word: null,
			percentOfTimeInitiallySpent: 0, // [0,1]
			userPoints: {} // {userId: points}
		};
	}

}
