import styles from '../less/game-messages.less';
import React from 'react';
import UserIcon from './UserIcon';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const transitionEnterTime = 300;
const transitionLeaveTime = 3000;
const transitionLeaveDelay = 1000;

function GameMessage(props) {
	return (
		<div className="game-text-message">
			<UserIcon user={props.message.user} size="tiny" showName={false} className="game-text-message-user-icon" />
			<div className="game-text-message-username-and-text">
				<div className="game-text-message-username">{props.message.user.name}</div>
				<div className="game-text-message-text">{props.message.isChecked ? <i className="fa fa-check" /> : props.message.text}</div>
			</div>
		</div>
	);
}

export default class GameMessages extends React.Component {
	constructor(props, context) {
		super(props, context);

		// this.state = {
		// 	messages: []
		// };
		// this.onAddMessage = this.onAddMessage.bind(this);
		this._currentMessages = [];
		this._archivedMessageIds = [];
	}

	// componentDidMount() {
	// 	this.props.game.messages.on('add', this.onAddMessage);
	// }

	// componentWillUnmount() {
	// 	this.props.game.messages.off('add', this.onAddMessage);
	// }

	// onAddMessage() {
	// 	let messages = [];
	// 	this.props.messages.reverse().slice(0, 4).forEach(message => {
	// 		if (this._archivedMessageIds.indexOf(message) < 0) {
	// 			messages.push(message);
	// 			this._removeMessageAfterTime(message, transitionLeaveDelay);
	// 		}
	// 	});
	// 	this.setState({
	// 		messages: messages
	// 	});
	// }

	getCurrentMessages() {
		let messages = [];
		this.props.messages.reverse().slice(0, 4).forEach(message => {
			if (this._archivedMessageIds.indexOf(message.id) < 0) {
				messages.push(message);
				if (!this._currentMessages.find(am => am.id === message.id)) {
					this._currentMessages.push(message);
					// this._removeMessageAfterTime(message.id, transitionLeaveDelay);
				}
			}
		});
		return messages;
	}

	// _removeMessageAfterTime(messageId, time) {
	// 	setTimeout(() => {
	// 		let index = this.currentMessages.indexOf(message);
	// 		if (index > -1) {
	// 			let messages = this.state.messages.slice();
	// 			this._archivedMessageIds.push(...messages.splice(index, 1));
	// 			this.setState({
	// 				messages: messages
	// 			});
	// 		}
	// 	}, time);
	// }

	render() {
		return (
			<div className="game-messages">
				<ReactCSSTransitionGroup
					component="div"
					transitionName="message"
					className="game-text-message-container"
					transitionEnterTimeout={transitionEnterTime}
					transitionLeaveTimeout={transitionLeaveTime}>
					{this.getCurrentMessages().map(message => <GameMessage message={message} key={message.id} />)}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}