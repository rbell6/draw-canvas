export default class EventEmitter {
	constructor() {
		this._registeredEvents	= {};
	}

	on(event, cb) {
		this._registeredEvents[event] = this._registeredEvents[event] || [];
		this._registeredEvents[event].push(cb);
	}

	emit(event) {
		let cbs = this._registeredEvents[event];
		if (cbs && cbs.length) {
			cbs.forEach(cb => cb({type: event}));
		}
	}
}