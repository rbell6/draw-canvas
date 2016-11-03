'use strict';

let Collection = require('./Collection');
let Message = require('./Message');

module.exports = class MessageCollection extends Collection {
	static fromJSON(json) {
		let messageCollection = new MessageCollection();
		json.forEach(message => messageCollection.add(new Message(message)));
		return messageCollection;
	}
}