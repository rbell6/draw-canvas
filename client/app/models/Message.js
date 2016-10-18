import Model from './Model';
import User from './User';

export default class Message extends Model {
	static defaults() {
		return {
			user: new User(),
			text: ''
		};
	}
}