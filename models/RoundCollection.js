let Collection = require('./Collection');
let Round = require('./Round');

module.exports = class RoundCollection extends Collection {
	static fromJSON(json) {
		let roundCollection = new RoundCollection();
		json.forEach(round => roundCollection.add(new Round(round)));
		return roundCollection;
	}
}