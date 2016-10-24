import React from 'react';
import Timer from './Timer';
import UserIcon from './UserIcon';

export default class GamePanel extends React.Component {
	componentDidMount() {
		this.onActiveRoundChange = this.onActiveRoundChange.bind(this);
		this.onUserStatusChange = this.onUserStatusChange.bind(this);
		this.props.game.on('change:activeRound', this.onActiveRoundChange);
		this.props.game.on('add:correctUsers', this.onUserStatusChange);
	}

	componentWillUnmount() {
		this.props.game.off('change:activeRound', this.onActiveRoundChange);
		this.props.game.off('add:correctUsers', this.onUserStatusChange);
	}

	onActiveRoundChange() {
		this.refs.timer.start(this.props.game.activeRound.get('percentOfTimeInitiallySpent'));
	}

	onUserStatusChange() {
		this.forceUpdate();
	}

	getStatusForUser(user) {
		if (this.props.game.activeRound && this.props.game.activeRound.get('correctUsers').find(correctUser => correctUser.id === user.id)) {
			return 'correct';
		}
		return 'normal';
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
					{this.props.game.get('users').map(user => (
						<div key={user.id} className="game-user">
							<UserIcon user={user} status={this.getStatusForUser(user)} />
						</div>
					))}
				</div>
			</div>
		);
	}
}