import React from 'react';
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import Game from '../models/Game';
import {
	browserHistory
} from 'react-router';

export default class GameListPage extends React.Component {
	createGame() {
		let game = new Game({
			host: UserService.get()
		});
		GameService.add(game);
		browserHistory.push(`/game-stage/${game.id}`);
	}

	render() {
		return (
			<div className="game-list-page">
				<div className="game-list-container">
					<button onClick={() => this.createGame()} className="join-game-button new-game-button"><i className="fa fa-plus-circle" /> &nbsp; New game</button>
					{GameService.getAll().map(game => (
						<div key={game.id} className="join-game-button" onClick={() => browserHistory.push(`/game/${game.id}`)}>
							<h2>{game.get('name')}</h2>
							<h3><i className="fa fa-user" /> {game.hostName()} &nbsp; <i className="fa fa-users" /> {game.numUsers()}</h3>
						</div>
					))}
				</div>
			</div>
		);
	}
}