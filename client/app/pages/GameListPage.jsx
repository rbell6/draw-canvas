import styles from '../less/game-list-page.less';
import classNames from 'classnames';
import React from 'react';
import Button from '../components/Button';
import Footer from '../components/Footer';
import PlayerList from '../components/PlayerList';
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import Game from '../../../models/Game';
import {
	browserHistory
} from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
	createGame
} from '../actions/GameActions';
import {
	connect
} from 'react-redux';

class GameListPage extends React.Component {
	static mapStateToProps(state) {
		return {
			gameList: state.gameList,
			userList: state.userList
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			createGame: name => dispatch(createGame(name))
		};
	}

	constructor(props, context) {
		super(props, context);
		this._creatingGame = false;
	}

	shouldComponentUpdate() {
		return this.isGameListPage() && !this._creatingGame;
	}

	createGame() {
		this._creatingGame = true;
		this.props.createGame()
			.then(game => browserHistory.push(`/game/${game.id}`))
			.then(() => this._creatingGame = false);
	}

	joinGame(game) {
		browserHistory.push(`/game/${game.id}`);
	}

	isGameListPage() {
		return window.location.pathname.indexOf('/game-list') === 0;
	}

	hostName(game) {
		let {hostId} = game;
		let host = this.props.userList.find(u => u.id === hostId);
		if (host) {
			return host.name;
		}
		return '';
	}

	render() {
		const transitionTime = 400;
		return (
			<div className={classNames('game-list-page', {'no-games': !this.props.gameList.length})}>
				<div className="game-list-container footer-offset">
					<ReactCSSTransitionGroup
						component="div"
						transitionName="game"
						className="game-list"
						transitionEnterTimeout={transitionTime}
						transitionLeaveTimeout={transitionTime}
					>
						{this.props.gameList.map(game => (
							<div key={game.id} className={classNames('join-game-button', {'game-is-ended': game.gameState === 'ended'})} onClick={() => this.joinGame(game)}>
								<h2>{game.name}</h2>
								<h3><i className="fa fa-user" /> {this.hostName(game)} &nbsp; <i className="fa fa-users" /> {game.userIds.length}</h3>
							</div>
						))}
					</ReactCSSTransitionGroup>
					{!this.props.gameList.length ? <div className="no-games-message">There are no active games.<br /><span onClick={() => this.createGame()} className="start-game-link">Start a new game</span></div> : null}
				</div>
				<PlayerList players={this.props.userList} />
				<Footer>
					<Button onClick={() => browserHistory.push('/draw')} variant="info">Free draw</Button>
					<Button onClick={() => this.createGame()} variant="success">New Game</Button>
				</Footer>
			</div>
		);
	}
}

export default connect(GameListPage.mapStateToProps, GameListPage.mapDispatchToProps)(GameListPage);
