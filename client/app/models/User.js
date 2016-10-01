'use strict';

import util from './util';
import _ from 'lodash';
import Model from './Model';

export default class User extends Model {
	static defaults() {
		return {
			id: util.guid(),
			connected: true,
			name: ''
		};
	}

	toJSON() {
		var json = super.toJSON();
		return _.omit(json, ['socket', 'game']);
	}
}
