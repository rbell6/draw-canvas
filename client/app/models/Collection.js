import EventEmitter from './EventEmitter';
import _ from 'lodash';

export default class Collection extends EventEmitter {

	constructor() {
		super();
		this._collection = [];
	}

	add(item) {
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

	remove(item) {
		this._collection = _.remove(this._collection, collectionItem => collectionItem.id === item.id);
		this.emit('remove', item);
	}

	removeAll() {
		this._collection.length = 0;
	}

	get length() {
		return this._collection.length;
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
