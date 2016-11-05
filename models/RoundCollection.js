'use strict';

let Collection = require('./Collection');
let Round = require('./Round');

module.exports = class RoundCollection extends Collection {
	currentRound() {
		return this.getAtIndex(this.length-1);
	}

	static fromJSON(json) {
		let roundCollection = new RoundCollection();
		json.forEach(round => roundCollection.add(new Round(round)));
		return roundCollection;
	}

	static toJSON() {
		return this.getAll().map(round => round.toJSON());
	}
}