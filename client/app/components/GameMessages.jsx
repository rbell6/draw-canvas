import styles from '../less/game-messages.less';
import classNames from 'classnames';
import React from 'react';
import UserIcon from './UserIcon';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
	connect
} from 'react-redux';

const transitionEnterTime = 300;
const transitionLeaveTime = 3000;
const transitionLeaveDelay = 3000;

export class GameMessage extends React.Component {
	render() {
		if (!this.props.user) {
			return null;
		}
		return (
			<div className={classNames('game-text-message', {'game-text-message-dark': this.props.dark})}>
				<UserIcon user={this.props.user} size="tiny" showName={false} className="game-text-message-user-icon" />
				<div className="game-text-message-username-and-text">
					<div className="game-text-message-username">{this.props.user.name}</div>
					<div className="game-text-message-text">{this.props.message.isChecked ? <i className="fa fa-check" /> : this.props.message.text}</div>
				</div>
			</div>
		);
	}
}

class GameMessages extends React.Component {
	static mapStateToProps(state) {
		return {
			game: state.game,
			user: state.user,
			userList: state.userList,
			messages: state.game.messages
		};
	}

	static mapDispatchToProps(dispatch) {
		return {};
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			messages: []
		};
		this._currentMessageIds = [];
		this._archivedMessageIds = [];
		this.numMessages = 0;
	}

	userForId(id) {
		return this.props.userList.find(u => u.id === id);
	}

	shouldComponentUpdate() {
		return this.props.game.gameState === 'active';
	}

	componentDidUpdate() {
		if (this.numMessages < this.props.messages.length) {
			this.numMessages = this.props.messages.length;
			this.onAddMessage();
		}
	}

	onAddMessage() {
		let messages = [];
		let allMessages = this.props.messages.slice();
		allMessages.reverse().slice(0, 4).forEach(message => {
			if (this._archivedMessageIds.indexOf(message.id) < 0) {
				messages.push(message);
			}
			if (this._currentMessageIds.indexOf(message.id) < 0) {
				this._removeMessageAfterTime(message.id, transitionLeaveDelay);
				this._currentMessageIds.push(message.id);
			}
		});

		this.setState({
			messages: messages
		});
	}

	_removeMessageAfterTime(messageId, time) {
		setTimeout(() => {
			let index = -1;
			this.state.messages.forEach((msg, i) => {
				if (msg.id === messageId) {
					index = i;
					return false;
				}
			});
			if (index > -1) {
				let messages = this.state.messages.slice();
				this._archivedMessageIds.push(...messages.splice(index, 1).map(m => m.id));
				this.setState({
					messages: messages
				});
			}
		}, time);
	}

	render() {
		return (
			<div className="game-messages">
				<ReactCSSTransitionGroup
					component="div"
					transitionName="message"
					className="game-text-message-container"
					transitionEnterTimeout={transitionEnterTime}
					transitionLeaveTimeout={transitionLeaveTime}>
					{this.state.messages.map(message => <GameMessage message={message} key={message.id} user={this.userForId(message.userId || message.user.id)} />)}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default connect(GameMessages.mapStateToProps, GameMessages.mapDispatchToProps)(GameMessages);
