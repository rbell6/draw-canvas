import Collection from './Collection';
import Line from './Line';

export default class LineCollection extends Collection {
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