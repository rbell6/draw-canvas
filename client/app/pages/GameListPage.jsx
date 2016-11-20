import React from 'react';
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import Game from '../../../models/Game';
import {
	browserHistory
} from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class GameListPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			gameList: []
		};
		this._onGameListChange = this._onGameListChange.bind(this);
	}

	componentDidMount() {
		GameService.on('change:gameList', this._onGameListChange);
		GameService.getAll().then(gameList => {
			this.setState({
				gameList: gameList
			});
		});
	}

	componentWillUnmount() {
		GameService.off('change:gameList', this._onGameListChange);
	}

	_onGameListChange(e) {
		this.setState({
			gameList: e.data
		});
	}

	createGame() {
		let game = new Game({
			host: UserService.get()
		});
		GameService.save(game).then(savedGame => {
			browserHistory.push(`/game-stage/${savedGame.id}`);
		});
	}

	joinGame(game) {
		let page = game.activeRound ? 'game' : 'game-stage';
		browserHistory.push(`/${page}/${game.id}`);
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
						{this.state.gameList.map(game => (
							<div key={game.id} className="join-game-button" onClick={() => this.joinGame(game)}>
								<h2>{game.get('name')}</h2>
								<h3><i className="fa fa-user" /> {game.hostName()} &nbsp; <i className="fa fa-users" /> {game.numUsers()}</h3>
							</div>
						))}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
}