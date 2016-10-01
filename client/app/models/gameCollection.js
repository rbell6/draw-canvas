'use strict';

import Collection from './Collection';
import Game from './Game';
import User from './User';

class GameCollection extends Collection {

}

let gameCollection = new GameCollection();

// TODO remove test games
gameCollection.add(new Game({
	name: 'Test game',
	host: new User({
		name: 'bilbo'
	})
}));
let g = new Game({
	host: new User({
		name: 'Frankaziod'
	})
});
g.get('users').add(new User({
	name: 'bobo'
}));
gameCollection.add(g);

export default gameCollection;
