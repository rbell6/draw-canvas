import EventEmitter from './EventEmitter';
import _ from 'lodash';

export default class Model extends EventEmitter {

	constructor(data) {
		super(data);
		this._data = _.invoke(this, 'constructor.defaults') || {};
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

}
