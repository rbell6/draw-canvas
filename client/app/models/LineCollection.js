import Collection from './Collection';

export default class LineCollection extends Collection {
	last() {
		return this.getAtIndex(this.length-1);
	}
}