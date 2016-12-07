'use strict';
let EventEmitter = require('./EventEmitter');

module.exports = class CollectionNew extends Array {
	constructor() {
		super();
		this._eventEmitter = new EventEmitter();
	}

	emit(event, data) {
		return this._eventEmitter.emit(event, data);
	}

	on(event, cb) {
		return this._eventEmitter.on(event, cb);
	}

	off(event, cb) {
		return this._eventEmitter.off(event, cb);
	}

	push() {
		let items = Array.prototype.slice.call(arguments);
		super.push.apply(this, items);
		this.emit('add', items);
	}

	remove(item) {
		let index = -1;
		let itemToRemove;
		this.forEach((collectionItem, i) => {
			if (collectionItem.id === item.id) {
				index = i;
				itemToRemove = collectionItem;
				return false;
			}
		});
		if (index > -1) {
			this.splice(index, 1);
			this.emit('change');
			this.emit('remove', [itemToRemove]);
		}
	}

	removeAll() {
		this.length = 0;
		this.emit('change');
	}
};