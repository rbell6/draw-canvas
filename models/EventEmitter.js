'use strict';

module.exports = class EventEmitter {
	constructor() {
		this._registeredEvents	= {};
	}

	on(event, cb) {
		this._registeredEvents[event] = this._registeredEvents[event] || [];
		this._registeredEvents[event].push(cb);
	}

	off(event, cb) {
		this._registeredEvents[event] = this._registeredEvents[event] || [];
		if (cb) {
			let index = this._registeredEvents[event].indexOf(cb);
			this._registeredEvents[event].splice(index, 1);
		} else {
			delete this._registeredEvents[events];
		}
	}

	emit(event, data) {
		let cbs = this._registeredEvents[event];
		if (cbs && cbs.length) {
			cbs.forEach(cb => cb({type: event, data: data}));
		}
	}
}