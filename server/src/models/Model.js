'use strict';

let EventEmitter = require('./EventEmitter');
let _ = require('lodash');

module.exports = class Model extends EventEmitter {

	constructor(data) {
		data = data || {};
		data.id = data.id || Model.generateId();
		super(data);
		this._data = _.invoke(this, 'constructor.defaults');
		_.forOwn(data, (val, key) => {
			this.set(key, val);
		});
	}

	set(key, newValue) {
		var oldValue = this._data[key];
		if (oldValue === newValue) { return; }
		this._data[key] = newValue;
		var data = {
			property: key,
			newValue: newValue,
			oldValue: oldValue
		}
		this.emit('change', data);
		this.emit('change:' + key, data);
	}

	get(key) {
		return this._data[key];
	}

	get id() {
		return this._data.id;
	}

	toJSON() {
		var json = {};
		_.forOwn(this._data, (val, key) => {
			if (val && _.isFunction(val.toJSON)) {
				val = val.toJSON();
			}
			json[key] = val;
		});
		return json;
	}

	static defaults() {
		return {};
	}

	static generateId() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4());
	}

}
