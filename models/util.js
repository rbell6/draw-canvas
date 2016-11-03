'use strict';

const red = '#c94045';
const blue = '#6090bc';
const orange = '#dd783b';
const purple = '#a76da7';
const yellow = '#ccc768';
const black = '#383838';
const green = '#499d72';
const white = '#e4e4e4';

let colors = () => {
	return [
		{name: 'red',    value: red},
		{name: 'blue',   value: blue},
		{name: 'orange', value: orange},
		{name: 'purple', value: purple},
		{name: 'yellow', value: yellow},
		{name: 'black',  value: black},
		{name: 'green',  value: green},
		{name: 'white',  value: white}
	];
};
colors.RED = red;
colors.BLUE = blue;
colors.ORANGE = orange;
colors.PURPLE = purple;
colors.YELLOW = yellow;
colors.BLACK = black;
colors.GREEN = green;
colors.WHITE = white;

module.exports = {
	guid: () => {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},
	colors: colors
};