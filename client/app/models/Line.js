import Model from './Model';

export default class Line extends Model {
	static defaults() {
		return {
			points: []
		};
	}

	addPoint(point) {
		this.get('points').push(point);
	}

	startingPoint() {
		return this.get('points')[0];
	}
}