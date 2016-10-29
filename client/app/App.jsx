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
import UserService from 'services/UserService';
import axios from 'axios';

window._ = _;

// Add user to all saving methods
axios.interceptors.request.use(function (config) {
	config.headers['Content-Type'] = 'application/json;charset=utf-8';
	if (['POST', 'PUT', 'PATCH'].indexOf(config.method.toUpperCase()) > -1) {
		config.data = config.data || null;
		var data = JSON.parse(config.data) || {};
		data.user = UserService.get();
		config.data = JSON.stringify(data);
	}
	return config;
});

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
	redirectIfUserDoesNotExist(nextState, replace) {
		if (!UserService.get()) {
			replace({
				pathname: '/create-user'
			});
		}
	}

	render() {
		return (
			<Shell>
				<Router history={browserHistory}>
					<Route path="/" component={AppPages}>
						<IndexRedirect to="/create-user" />
						<Route path="/create-user" component={CreateUserPage} />
						<Route path="/game" component={GamePage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
						<Route path="/game-list" component={GameListPage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
						<Route path="/game/:id" component={GamePage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
						<Route path="/game-stage/:id" component={GameStagePage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
					</Route>
				</Router>
			</Shell>
		);
	}
}