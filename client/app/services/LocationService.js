import { browserHistory } from 'react-router';

class LocationService {
	constructor() {
		this._pathStack = [];
		browserHistory.listen(location => this._pathStack.push(location.pathname));
	}

	get currentPath() {
		return this.pathStack[this.pathStack.length-1];
	}

	get previousPath() {
		if (this.pathStack.length > 1) {
			return this.pathStack[this.pathStack.length-2];
		}
		return null;
	}

	get pathStack() {
		return this._pathStack;
	}
}

export default new LocationService();