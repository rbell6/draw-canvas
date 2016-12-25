import styles from '../less/game-list-page.less';
import classNames from 'classnames';
import React from 'react';
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

	shouldComponentUpdate() {
		return this.isGameListPage();
	}

	createGame() {
		this.props.createGame()
			.then(game => browserHistory.push(`/game-stage/${game.id}`));
	}

	joinGame(game) {
		let page = game.isStarted ? 'game' : 'game-stage';
		browserHistory.push(`/${page}/${game.id}`);
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
			<div className="game-list-page">
				<div className="game-list-container">
					<button onClick={() => this.createGame()} className="join-game-button new-game-button"><i className="fa fa-plus-circle" /> &nbsp; New game</button>
					<ReactCSSTransitionGroup
						component="div"
						transitionName="game"
						className="game-list"
						transitionEnterTimeout={transitionTime}
						transitionLeaveTimeout={transitionTime}
					>
						{this.props.gameList.map(game => (
							<div key={game.id} className={classNames('join-game-button', {'game-is-ended': game.isEnded})} onClick={() => this.joinGame(game)}>
								<h2>{game.name}</h2>
								<h3><i className="fa fa-user" /> {this.hostName(game)} &nbsp; <i className="fa fa-users" /> {game.userIds.length}</h3>
							</div>
						))}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
}

export default connect(GameListPage.mapStateToProps, GameListPage.mapDispatchToProps)(GameListPage);
