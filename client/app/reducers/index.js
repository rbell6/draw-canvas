import {
	combineReducers
} from 'redux';
import user from './user';
import userList from './userList';
import game from './game';
import socket from './socket';

const reducers = combineReducers({
	user,
	userList,
	game,
	socket
});

export default reducers;