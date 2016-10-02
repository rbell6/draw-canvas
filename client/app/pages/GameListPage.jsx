import React from 'react';
import gameCollection from '../models/gameCollection';
import {
	browserHistory
} from 'react-router';

export default class GameListPage extends React.Component {
	render() {
		return (
			<div className="game-list-page">
				<div className="game-list-container">
					<button onClick={() => browserHistory.push('/create-game')} className="join-game-button new-game-button"><i className="fa fa-plus-circle" /> &nbsp; New game</button>
					{gameCollection.map(game => (
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