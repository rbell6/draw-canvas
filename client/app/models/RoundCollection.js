import Collection from './Collection';
import Round from './Round';

export default class RoundCollection extends Collection {
	static fromJSON(json) {
		let roundCollection = new RoundCollection();
		json.forEach(round => roundCollection.add(new Round(round)));
		return roundCollection;
	}
}