import GameCollection from '../models/GameCollection';
import Game from '../models/Game';
import User from '../models/User';
import _ from 'lodash';

let GameService = {
	add: function(game) {
		this.getAll().add(game);
		this.save();
	},
	save: function() {
		window.localStorage.setItem('gameCollection', JSON.stringify(this.getAll().toJSON()));
	},
	getAll: function() {
		if (!this._gameCollection) {
			this._gameCollection = new GameCollection();
			let gameCollectionString = window.localStorage.getItem('gameCollection');
			let gameCollectionJSON;
			if (gameCollectionString) {
				gameCollectionJSON = JSON.parse(gameCollectionString);
				gameCollectionJSON.forEach(gameJSON => this._gameCollection.add(Game.fromJSON(gameJSON)));
			}
		}
		return this._gameCollection;
	},
	getById: function(id) {
		return this.getAll().find({id: id});
	},
	_gameCollection: null
};

export default GameService;