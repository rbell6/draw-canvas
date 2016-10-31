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
	}

	componentDidMount() {
		GameService.on('change:gameList', e => {
			this.setState({
				gameList: e.data
			});
		});
		GameService.getAll();
	}

	createGame() {
		let game = new Game({
			host: UserService.get()
		});
		GameService.save(game);
		// browserHistory.push(`/game-stage/${game.id}`);
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
							<div key={game.id} className="join-game-button" onClick={() => browserHistory.push(`/game-stage/${game.id}`)}>
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