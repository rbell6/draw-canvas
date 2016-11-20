'use strict';

let EventEmitter = require('./EventEmitter');
let _ = require('lodash');

module.exports = class Collection extends EventEmitter {

	constructor() {
		super();
		this._collection = [];
	}

	add(item) {
		if (this.find({id: item.id})) { return; }
		this._collection.push(item);
		this.emit('add', item);
	}

	get(item) {
		return _.find(this._collection, collectionItem => collectionItem.id === item.id);
	}

	getAtIndex(index) {
		return this._collection[index];
	}

	getAll() {
		return this._collection;
	}

	map(fn) {
		return this.getAll().map(fn);
	}

	find(params) {
		return _.find(this.getAll(), params);
	}

	forEach(fn) {
		return this.getAll().forEach(fn);
	}

	remove(item) {
		_.remove(this._collection, collectionItem => collectionItem.id === item.id);
		this.emit('remove', item);
	}

	removeAll() {
		this._collection.length = 0;
	}

	get length() {
		return this._collection.length;
	}

	reverse() {
		return this._collection.slice().reverse();
	}

	toJSON() {
		return this._collection.map(item => {
			if (item && _.isFunction(item.toJSON)) {
				item = item.toJSON();
			}
			return item;
		});
	}

}
