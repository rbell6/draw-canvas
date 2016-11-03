'use strict';

let Collection = require('./Collection');
let Line = require('./Line');

module.exports = class LineCollection extends Collection {
	add(line) {
		super.add(line);
		line.on('change', e => this.emit('change'));
	}

	last() {
		return this.getAtIndex(this.length-1);
	}

	static fromJSON(json) {
		let lineCollection = new this();
		json.forEach(lineJSON => {
			lineCollection.add(Line.fromJSON(lineJSON));
		}); 
		return lineCollection;
	}
}