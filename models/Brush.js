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

// SIZES

Brush.sizes = [];

Brush.sizes.S = {
	label: 'S',
	value: '0.01'
};
Brush.sizes.push(Brush.sizes.S);

Brush.sizes.M = {
	label: 'M',
	value: '0.03'
};
Brush.sizes.push(Brush.sizes.M);

Brush.sizes.L = {
	label: 'L',
	value: '0.07'
};
Brush.sizes.push(Brush.sizes.L);

Brush.sizes.XL = {
	label: 'XL',
	value: '0.3'
};
Brush.sizes.push(Brush.sizes.XL);


// COLORS

Brush.colors = [];

Brush.colors.red = {
	label: 'red',
	value: '#c94045'
};
Brush.colors.push(Brush.colors.red);

Brush.colors.black = {
	label: 'black',
	value: '#383838'
};
Brush.colors.push(Brush.colors.black);

Brush.colors.orange = {
	label: 'orange',
	value: '#dd783b'
};
Brush.colors.push(Brush.colors.orange);

Brush.colors.gray = {
	label: 'gray',
	value: '#555'
};
Brush.colors.push(Brush.colors.gray);

Brush.colors.yellow = {
	label: 'yellow',
	value: '#ccc768'
};
Brush.colors.push(Brush.colors.yellow);

Brush.colors.lightGray = {
	label: 'lightGray',
	value: '#999'
};
Brush.colors.push(Brush.colors.lightGray);

Brush.colors.green = {
	label: 'green',
	value: '#499d72'
};
Brush.colors.push(Brush.colors.green);

Brush.colors.white = {
	label: 'white',
	value: '#e4e4e4'
};
Brush.colors.push(Brush.colors.white);

Brush.colors.blue = {
	label: 'blue',
	value: '#6090bc'
};
Brush.colors.push(Brush.colors.blue);

Brush.colors.tan = {
	label: 'tan',
	value: '#cbb394'
};
Brush.colors.push(Brush.colors.tan);

Brush.colors.purple = {
	label: 'purple',
	value: '#a76da7'
};
Brush.colors.push(Brush.colors.purple);

Brush.colors.brown = {
	label: 'brown',
	value: '#67482d'
};
Brush.colors.push(Brush.colors.brown);

module.exports = Brush;