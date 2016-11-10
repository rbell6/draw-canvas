import React from 'react';
import Timer from './Timer';
import UserIcon from './UserIcon';
import FlipMove from 'react-flip-move';

export default class GamePanel extends React.Component {
	componentDidMount() {
		this.onActiveRoundChange = this.onActiveRoundChange.bind(this);
		this.onUserStatusChange = this.onUserStatusChange.bind(this);
		this.props.game.on('change:rounds', this.onActiveRoundChange);
		this.props.game.on('change:usersWithPoints', this.onUserStatusChange);
	}

	componentWillUnmount() {
		this.props.game.off('change:rounds', this.onActiveRoundChange);
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
		let roundNumber = this.props.game.get('rounds').length;
		return (
			<div className="game-panel">
				<div className="game-panel-header">
					<div className="game-name">{this.props.game.get('name')}</div>
				</div>
				<div className="round-timer">
					<Timer className="round-timer" time={this.props.game.get('gameTime')} ref="timer" />
					<div className="round-timer-children">
						{roundNumber > 0 ? 
							<div className="round-label"><span className="number">{roundNumber}</span>/<span className="number">{this.props.game.get('numRounds')}</span></div>
							:
							null
						} 
					</div>
				</div>
				<div className="game-users">
					<FlipMove>
						{this.props.game.usersWithPoints.map(userWithPoints => (
							<div key={userWithPoints.user.id} className="game-user">
								<UserIcon user={userWithPoints.user} status={this.getStatusForUser(userWithPoints.user)} points={this.activeRoundPointsForUser(userWithPoints.user)} />
							</div>
						))}
					</FlipMove>
				</div>
			</div>
		);
	}
}