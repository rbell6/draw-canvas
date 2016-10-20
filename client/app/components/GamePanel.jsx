import React from 'react';
import Timer from './Timer';
import UserIcon from './UserIcon';

export default class GamePanel extends React.Component {
	componentDidMount() {
		this.onActiveRoundChange = this.onActiveRoundChange.bind(this);
		this.props.game.on('change:activeRound', this.onActiveRoundChange);
	}

	componentWillUnmount() {
		this.props.game.off('change:activeRound', this.onActiveRoundChange);
	}

	onActiveRoundChange() {
		this.refs.timer.start();
	}

	render() {
		return (
			<div className="game-panel">
				<div className="game-panel-header">
					<div className="game-name">{this.props.game.get('name')}</div>
					<div className="round-label"><span className="number">{this.props.game.get('activeRoundIndex')+1}</span>/<span className="number">{this.props.game.get('numRounds')}</span></div>
				</div>
				<Timer className="round-timer" time={this.props.game.get('gameTime')} ref="timer" />
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