import React from 'react';
import { 
	Router, 
	Route, 
	Link, 
	browserHistory,
	IndexRedirect
} from 'react-router';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Shell from 'components/Shell';
import GamePage from 'pages/GamePage';
import CreateUserPage from 'pages/CreateUserPage';
import GameListPage from 'pages/GameListPage';
import GameStagePage from 'pages/GameStagePage';

window._ = _;

function AppPages({children, location}) {
	const transitionTime = 400;
	return (
		<ReactCSSTransitionGroup
			component="div"
			transitionName="page"
			className="page"
			transitionEnterTimeout={transitionTime}
			transitionLeaveTimeout={transitionTime}>
			{React.cloneElement(children, {
				key: location.pathname
			})}
		</ReactCSSTransitionGroup>
	);
}

export default class App extends React.Component {
	render() {
		return (
			<Shell>
				<Router history={browserHistory}>
					<Route path="/" component={AppPages}>
						<IndexRedirect to="/create-user" />
						<Route path="/create-user" component={CreateUserPage} />
						<Route path="/game" component={GamePage} />
						<Route path="/game-list" component={GameListPage} />
						<Route path="/game/:id" component={GamePage} />
						<Route path="/game-stage/:id" component={GameStagePage} />
					</Route>
				</Router>
			</Shell>
		);
	}
}