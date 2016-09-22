import Model from './Model';

export default class Brush extends Model {
	static defaults() {
		return {
			color: 'blue',
			size: 20
		};
	}
}