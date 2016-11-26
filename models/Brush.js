'use strict';

let Model = require('./Model');

class Brush extends Model {
	static defaults() {
		return {
			color: 'blue',
			size: this.sizes.M,
			name: 'blue'
		};
	}
}

Brush.sizes = [];

Brush.sizes.S = {
	label: 'S',
	value: '0.01'
};
Brush.sizes.push(Brush.sizes.S);

Brush.sizes.M = {
	label: 'M',
	value: '0.04'
};
Brush.sizes.push(Brush.sizes.M);

Brush.sizes.L = {
	label: 'L',
	value: '0.1'
};
Brush.sizes.push(Brush.sizes.L);

Brush.sizes.XL = {
	label: 'XL',
	value: '0.3'
};
Brush.sizes.push(Brush.sizes.XL);

module.exports = Brush;