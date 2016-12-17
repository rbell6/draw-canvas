import {
	combineReducers
} from 'redux';
import user from './user';
import game from './game';

const reducers = combineReducers({
	user,
	game
});

export default reducers;