import styles from './less/app.less';
import headerStyles from './less/headers.less';
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
import Shell from './components/Shell';
import GamePage from './pages/GamePage';
import CreateUserPage from './pages/CreateUserPage';
import GameListPage from './pages/GameListPage';
import GameStagePage from './pages/GameStagePage';
import UserService from './services/UserService';
import axios from 'axios';
import LocationService from './services/LocationService';

window._ = _;

// Add user to all saving methods
axios.interceptors.request.use(function (config) {
	config.headers['Content-Type'] = 'application/json;charset=utf-8';
	if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(config.method.toUpperCase()) > -1) {
		config.data = config.data || {};
		config.data.user = UserService.get();
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
	constructor(props, context) {
		super(props, context);
		this.state = {
			userFetched: false
		};
	}

	componentDidMount() {
		UserService.fetch().then(user => {
			this.setState({userFetched: true});
		});
	}

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
				{this.state.userFetched ?
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
					:
					<div className="app-loading"><div className="spinner"><i className="fa fa-cog fa-spin" /></div></div>
				}
			</Shell>
		);
	}
}