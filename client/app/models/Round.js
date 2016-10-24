'use strict';

import Model from './Model';

export default class Round extends Model {
	
	static defaults() {
		return {
			drawer: null,
			name: 'Round',
			index: 0,
			word: null,
			percentOfTimeInitiallySpent: 0 // [0,1]
		};
	}

}
