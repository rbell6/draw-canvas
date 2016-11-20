'use strict';

let Model = require('./Model');
let Brush = require('./Brush');

module.exports = class Line extends Model {
	static defaults() {
		return {
			points: [],
			brush: new Brush()
		};
	}

	addPoint(point) {
		this.get('points').push(point);
		this.emit('change');
	}

	startingPoint() {
		return this.get('points')[0];
	}

	static fromJSON(json) {
		return new this({
			points: json.points,
			brush: new Brush(json.brush)
		});
	}
}