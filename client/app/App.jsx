import React from 'react';
import { 
	Router, 
	Route, 
	Link, 
	browserHistory,
	IndexRedirect
} from 'react-router';
import Shell from 'components/Shell';
import GamePage from 'pages/GamePage';
import CreateUserPage from 'pages/CreateUserPage';
import GameListPage from 'pages/GameListPage';
import CreateGamePage from 'pages/CreateGamePage';

export default class App extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
    		<Route path="/" component={Shell}>
    			<IndexRedirect to="/create-user" />
    			<Route path="/create-user" component={CreateUserPage} />
    			<Route path="/game" component={GamePage} />
    			<Route path="/game/:id" component={GamePage} />
    			<Route path="/game-list" component={GameListPage} />
    			<Route path="/create-game" component={CreateGamePage} />
    		</Route>
    	</Router>
		);
	}
}