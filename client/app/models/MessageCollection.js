import Collection from './Collection';
import Message from './Message';

export default class MessageCollection extends Collection {
	static fromJSON(json) {
		let messageCollection = new MessageCollection();
		json.forEach(message => messageCollection.add(new Message(message)));
		return messageCollection;
	}
}