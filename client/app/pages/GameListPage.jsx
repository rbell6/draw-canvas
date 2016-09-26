import React from 'react';

export default class GameListPage extends React.Component {
	render() {
		return (
			<div className="game-list-page">
				<div className="game-list-container">
					<button onClick={() => browserHistory.push('/game')} className="join-game-button new-game-button"><i className="fa fa-plus-circle" /> &nbsp; New game</button>
					<div onClick={() => browserHistory.push('/game-list')} className="join-game-button">
						<h2>This is a game</h2>
						<h3><i className="fa fa-user" /> Frank &nbsp; <i className="fa fa-users" /> 8</h3>
					</div>
					<div onClick={() => browserHistory.push('/game-list')} className="join-game-button">
						<h2>Some other game</h2>
						<h3><i className="fa fa-user" /> bilbo &nbsp; <i className="fa fa-users" /> 0</h3>
					</div>
				</div>
			</div>
		);
	}
}