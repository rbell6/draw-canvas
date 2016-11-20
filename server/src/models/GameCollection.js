'use strict';

let Collection = require('./Collection');
let Game = require('./Game');
let User = require('./User');

class GameCollection extends Collection {
	static fromJSON(json) {
		let gameCollection = new GameCollection();
		json.forEach(game => gameCollection.add(Game.fromJSON(game)));
		return gameCollection;
	}
}

module.exports = GameCollection;
