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
import {
	Provider,
	connect
} from 'react-redux';
import {
	createStore,
	applyMiddleware
} from 'redux';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {
	fetchUser
} from './actions/UserActions';
import {
	streamUserList
} from './actions/UserListActions';
import {
	createSocket
} from './actions/SocketActions';

let store = createStore(reducers, applyMiddleware(
	thunkMiddleware,
	createLogger()
));
window.store = store;

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

function redirectIfUserDoesNotExist(nextState, replace) {
	let userName = _.get(store.getState(), 'user.name', '');
	if (userName === '') {
		replace({
			pathname: '/create-user'
		});
	}
}

// For some reason we have to pull out the routes 
// https://github.com/reactjs/react-router-redux/issues/179
const routes = (
	<Route path="/" component={AppPages}>
		<IndexRoute component={HomePage} />
		<Route path="/create-user" component={CreateUserPage} />
		<Route path="/game" component={GamePage} onEnter={redirectIfUserDoesNotExist} />
		<Route path="/game-list" component={GameListPage} onEnter={redirectIfUserDoesNotExist} />
		<Route path="/game/:id" component={GamePage} onEnter={redirectIfUserDoesNotExist} />
		<Route path="/game-stage/:id" component={GameStagePage} onEnter={redirectIfUserDoesNotExist} />
		<Route path="/m/:mobileLinkId" component={MobileCanvasPage} />
	</Route>
);

class App extends React.Component {
	static mapStateToProps(state) {
		return {
			user: state.user,
			socket: state.socket
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			fetchUser: () => dispatch(fetchUser()),
			createSocket: () => dispatch(createSocket()),
			streamUserList: socket => dispatch(streamUserList(socket))
		};
	};

	componentDidMount() {
		this.props.fetchUser().then(user => {
			this.props.createSocket();
			this.props.streamUserList(this.props.socket);
		});
	}

	isDoneLoading() {
		return this.props.user && 
		this.props.user.lastUpdated && 
		!this.props.user.isFetching &&
		this.props.socket &&
		this.props.socket.io;
	}

	render() {
		return (
			<Shell>
				{this.isDoneLoading() ?
					<Router history={browserHistory}>
						{routes}
					</Router>
					:
					<div className="app-loading"><div className="spinner"><i className="fa fa-cog fa-spin" /></div></div>
				}
			</Shell>
		);
	}
}

let ConnectedApp = connect(App.mapStateToProps, App.mapDispatchToProps)(App);

const ProviderApp = props => (
	<Provider store={store}>
		<ConnectedApp />
	</Provider>
);

export default ProviderApp;
