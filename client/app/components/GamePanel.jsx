import React from 'react';
import Timer from './Timer';
import UserIcon from './UserIcon';

export default class GamePanel extends React.Component {
	render() {
		return (
			<div className="game-panel">
				<div className="game-panel-header">
					<div className="game-name">{this.props.game.get('name')}</div>
					<div className="round-label"><span className="number">4</span>/<span className="number">10</span></div>
				</div>
				<Timer className="round-timer" />
				<div className="game-users">
					{this.props.game.get('users').map(user => (
						<div key={user.id} className="game-user">
							<UserIcon user={user} />
						</div>
					))}
				</div>
			</div>
		);
	}
}