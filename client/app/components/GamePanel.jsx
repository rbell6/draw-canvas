import React from 'react';
import Timer from './Timer';
import UserIcon from './UserIcon';

export default class GamePanel extends React.Component {
	componentDidMount() {
		this.onActiveRoundChange = this.onActiveRoundChange.bind(this);
		this.onUserStatusChange = this.onUserStatusChange.bind(this);
		this.props.game.on('change:activeRound', this.onActiveRoundChange);
		this.props.game.on('change:usersWithPoints', this.onUserStatusChange);
	}

	componentWillUnmount() {
		this.props.game.off('change:activeRound', this.onActiveRoundChange);
		this.props.game.off('change:usersWithPoints', this.onUserStatusChange);
	}

	onActiveRoundChange() {
		this.refs.timer.start(this.props.game.activeRound.get('percentOfTimeInitiallySpent'));
	}

	onUserStatusChange() {
		this.forceUpdate();
	}

	getStatusForUser(user) {
		if (this.props.game.activeRound && this.props.game.activeRound.get('userPoints')[user.id]) {
			return 'correct';
		}
		return 'normal';
	}

	activeRoundPointsForUser(user) {
		if (!this.props.game.activeRound) { return 0; }
		return this.props.game.activeRound.get('userPoints')[user.id];
	}

	render() {
		let roundNumber = this.props.game.get('activeRoundIndex')+1;
		return (
			<div className="game-panel">
				<div className="game-panel-header">
					<div className="game-name">{this.props.game.get('name')}</div>
					{roundNumber > 0 ? 
						<div className="round-label"><span className="number">{roundNumber}</span>/<span className="number">{this.props.game.get('numRounds')}</span></div>
						:
						null
					} 
				</div>
				<Timer className="round-timer" time={this.props.game.get('gameTime')} ref="timer" />
				<div className="game-users">
					{this.props.game.usersWithPoints.map(userWithPoints => (
						<div key={userWithPoints.user.id} className="game-user">
							<UserIcon user={userWithPoints.user} status={this.getStatusForUser(userWithPoints.user)} points={this.activeRoundPointsForUser(userWithPoints.user)} />
						</div>
					))}
				</div>
			</div>
		);
	}
}