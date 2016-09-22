import Model from './Model';
import Brush from './Brush';

export default class Line extends Model {
	static defaults() {
		return {
			points: [],
			brush: new Brush()
		};
	}

	addPoint(point) {
		this.get('points').push(point);
	}

	startingPoint() {
		return this.get('points')[0];
	}
}