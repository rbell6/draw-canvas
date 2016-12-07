import styles from './less/app.less';
import headerStyles from './less/headers.less';
import React from 'react';
import { 
	Router, 
	Route, 
	Link, 
	browserHistory,
	IndexRoute
} from 'react-router';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Shell from './components/Shell';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import CreateUserPage from './pages/CreateUserPage';
import GameListPage from './pages/GameListPage';
import GameStagePage from './pages/GameStagePage';
import MobileCanvasPage from './pages/MobileCanvasPage';
import UserService from './services/UserService';
import axios from 'axios';
import LocationService from './services/LocationService';

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
	constructor(props, context) {
		super(props, context);
		this.state = {
			userFetched: false
		};
	}

	componentDidMount() {
		UserService.fetch()
			.then(user => {
				this.setState({userFetched: true});
			})
			.catch(err => {
				// User was not found
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
							<IndexRoute component={HomePage} />
							<Route path="/create-user" component={CreateUserPage} />
							<Route path="/game" component={GamePage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
							<Route path="/game-list" component={GameListPage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
							<Route path="/game/:id" component={GamePage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
							<Route path="/game-stage/:id" component={GameStagePage} onEnter={this.redirectIfUserDoesNotExist.bind(this)} />
							<Route path="/m/:userId" component={MobileCanvasPage} />
						</Route>
					</Router>
					:
					<div className="app-loading"><div className="spinner"><i className="fa fa-cog fa-spin" /></div></div>
				}
			</Shell>
		);
	}
}