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
import Modal from './components/Modal';
import LostConnectionModal from './components/LostConnectionModal';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import CreateUserPage from './pages/CreateUserPage';
import GameListPage from './pages/GameListPage';
import GameStagePage from './pages/GameStagePage';
import DrawPage from './pages/DrawPage';
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
	streamGameList
} from './actions/GameListActions';
import {
	createSocket
} from './actions/SocketActions';
import ReactGA from 'react-ga';
require('offline-js'); // This puts `Offline` on the window

// Google Analytics
const prodTrackingId = 'UA-89986238-1';
const devTrackingId = 'UA-89986238-2';
let trackingId = prodTrackingId;
if (isDevelopmentEnvironment()) {
	trackingId = devTrackingId;
}
ReactGA.initialize(trackingId);

let loggerMiddleware = createLogger({
	collapsed: true
});
let store = createStore(reducers, applyMiddleware(
	thunkMiddleware,
	loggerMiddleware
));
window.store = store;

window._ = _;

function isDevelopmentEnvironment() {
	return window.location.hostname === 'localhost';
}

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
		<Route path="/draw" component={DrawPage} />
	</Route>
);

class App extends React.Component {
	static mapStateToProps(state) {
		return {
			user: state.user,
			socket: state.socket,
			userList: state.userList,
			gameList: state.gameList
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			fetchUser: () => dispatch(fetchUser()),
			createSocket: () => dispatch(createSocket()),
			streamUserList: socket => dispatch(streamUserList(socket)),
			streamGameList: socket => dispatch(streamGameList(socket))
		};
	};

	constructor(props, context) {
		super(props, context);
		this.showOfflineModal = this.showOfflineModal.bind(this);
		this.closeOfflineModal = this.closeOfflineModal.bind(this);
	}

	componentDidMount() {
		this.props.fetchUser()
			.then(() => this.props.createSocket())
			.then(() => {
				this.props.streamUserList(this.props.socket);
				this.props.streamGameList(this.props.socket);
			});

		// For local testing
		// window.Offline.options = {checks: {xhr: {url: 'https://code.jquery.com/jquery-3.1.1.min.js'}}};
		window.Offline.on('down', this.showOfflineModal);
		window.Offline.on('up', this.closeOfflineModal);
	}

	componentWillUnmount() {
		window.Offline.off('down', this.showOfflineModal);
		window.Offline.off('up', this.closeOfflineModal);
	}

	showOfflineModal() {
		 Modal.show(<LostConnectionModal />);
	}

	closeOfflineModal() {
		 Modal.close();
	}

	isDoneLoading() {
		return this.props.user && 
		this.props.user.lastUpdated && 
		!this.props.user.isFetching &&
		this.props.socket &&
		this.props.socket.io && // Make sure that the socket has been created
		this.props.userList &&
		this.props.userList.length; // Should have at least yourself in userList
	}

	logPageView() {
		ReactGA.set({page: window.location.pathname});
		ReactGA.pageview(window.location.pathname);
	}

	render() {
		return (
			<Shell>
				{this.isDoneLoading() ?
					<Router history={browserHistory} onUpdate={() => this.logPageView()}>
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
