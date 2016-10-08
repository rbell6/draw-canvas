module.exports = {
	guid: () => {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},
	colors: () => {
		return [
			{name: 'red',    value: '#c94045'},
			{name: 'blue',   value: '#6090bc'},
			{name: 'orange', value: '#dd783b'},
			{name: 'purple', value: '#a76da7'},
			{name: 'yellow', value: '#ccc768'},
			{name: 'black',  value: '#383838'},
			{name: 'green',  value: '#499d72'},
			{name: 'white',  value: '#e4e4e4'}
		];
	}
};