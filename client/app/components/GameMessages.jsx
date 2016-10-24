import React from 'react';
import UserIcon from './UserIcon';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MessageService from '../services/MessageService';

const transitionEnterTime = 300;
const transitionLeaveTime = 3000;
const transitionLeaveDelay = 1000;

function GameMessage(props) {
	return (
		<div className="game-text-message">
			<UserIcon user={props.message.get('user')} size="tiny" showName={false} className="game-text-message-user-icon" />
			<div className="game-text-message-username-and-text">
				<div className="game-text-message-username">{props.message.get('user').get('name')}</div>
				<div className="game-text-message-text">{props.message.get('isChecked') ? <i className="fa fa-check" /> : props.message.get('text')}</div>
			</div>
		</div>
	);
}

export default class GameMessages extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			messages: []
		};
		this.onAddMessage = this.onAddMessage.bind(this);
		this._archivedMessages = [];
	}

	componentDidMount() {
		this.props.game.get('messages').on('add', this.onAddMessage);
	}

	componentWillUnmount() {
		this.props.game.get('messages').off('add', this.onAddMessage);
	}

	onAddMessage() {
		let messages = [];
		this.props.game.get('messages').reverse().slice(0, 4).forEach(message => {
			if (this._archivedMessages.indexOf(message) < 0) {
				messages.push(message);
				this._removeMessageAfterTime(message, transitionLeaveDelay);
			}
		});
		this.setState({
			messages: messages
		});
	}

	_removeMessageAfterTime(message, time) {
		setTimeout(() => {
			let index = this.state.messages.indexOf(message);
			if (index > -1) {
				let messages = this.state.messages.slice();
				this._archivedMessages.push(...messages.splice(index, 1));
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
					{this.state.messages.map(message => <GameMessage message={message} key={message.id} />)}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}