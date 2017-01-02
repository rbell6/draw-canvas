import styles from '../less/game-panel.less';
import React from 'react';
import Timer from './Timer';
import UserIcon from './UserIcon';
import FlipMove from 'react-flip-move';
import GameUtil from '../util/GameUtil';
import {
	connect
} from 'react-redux';
import _ from 'lodash';

class GamePanel extends React.Component {
	static mapStateToProps(state) {
		return {
			game: state.game,
			user: state.user,
			userList: state.userList,
			socket: state.socket
		};
	}

	static mapDispatchToProps(dispatch) {
		return {};
	}

	componentDidMount() {
		this.currentRoundIndex = -1;
	}

	componentDidUpdate() {
		if (!this.isGamePage() || !_.get(this.activeRound, 'started')) { return; }
		let newCurrentRoundIndex = _.get(this.activeRound, 'index', -1);
		if (newCurrentRoundIndex > this.currentRoundIndex) {
			this.currentRoundIndex = newCurrentRoundIndex;
			this.onActiveRoundChange();
		}
	}

	get activeRound() {
		return GameUtil.activeRound(this.props.game);
	}

	get usersWithPoints() {
		return GameUtil.usersWithPoints(this.props.game);
	}

	isGamePage() {
		return window.location.pathname.indexOf('/game/') === 0;
	}

	userForId(id) {
		return this.props.userList.find(u => u.id === id);
	}

	onActiveRoundChange() {
		this.refs.timer.start(this.activeRound.percentOfTimeInitiallySpent);
	}

	onUserStatusChange() {
		this.forceUpdate();
	}

	getStatusForUser(userId) {
		if (this.activeRound && this.activeRound.userPoints[userId]) {
			return 'correct';
		}
		if (this.activeRound && this.activeRound.drawerId === userId) {
			return 'drawer';
		}
		return 'normal';
	}

	activeRoundPointsForUser(userId) {
		if (!this.activeRound) { return 0; }
		return this.activeRound.userPoints[userId];
	}

	render() {
		if (!this.props.game) { return null; }
		let roundNumber = _.get(this.props.game.rounds, 'length', 0);
		return (
			<div className="game-panel">
				<div className="game-panel-header">
					<div className="game-name">{this.props.game.name}</div>
				</div>
				<div className="round-timer">
					<Timer className="round-timer" time={this.props.game.gameTime} ref="timer" />
					<div className="round-timer-children">
						{roundNumber > 0 ? 
							<div className="round-label"><span className="number">{roundNumber}</span>/<span className="number">{this.props.game.numRounds}</span></div>
							:
							null
						} 
					</div>
				</div>
				<div className="game-users">
					<FlipMove>
						{this.usersWithPoints.map(userWithPoints => (
							<div key={userWithPoints.userId} className="game-user">
								<UserIcon 
									user={this.userForId(userWithPoints.userId)} 
									status={this.getStatusForUser(userWithPoints.userId)} 
									totalPoints={userWithPoints.points}
									showPoints={true}
									points={this.activeRoundPointsForUser(userWithPoints.userId)} />
							</div>
						))}
					</FlipMove>
				</div>
			</div>
		);
	}
}

export default connect(GamePanel.mapStateToProps, GamePanel.mapDispatchToProps)(GamePanel);
