import {
	combineReducers
} from 'redux';
import user from './user';
import userList from './userList';
import gameList from './gameList';
import game from './game';
import socket from './socket';

const reducers = combineReducers({
	user,
	userList,
	gameList,
	game,
	socket
});

export default reducers;