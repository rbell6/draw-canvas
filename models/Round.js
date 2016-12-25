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
			userPoints: {}, // {userId: points}
			started: false
		};
	}

	wordIsCorrect(word) {
		return this.get('word').toLowerCase().replace(' ', '') === word.toLowerCase().replace(' ', '');
	}

	addUserPoints(user, points) {
		this.get('userPoints')[user.id] = points;
	}

	numUsersWithPoints() {
		return Object.keys(this.get('userPoints')).length;
	}

}
