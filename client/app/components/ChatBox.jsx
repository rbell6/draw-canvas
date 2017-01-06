import styles from '../less/chat-box.less';
import TextField from './TextField';
import classNames from 'classnames';
import React from 'react';
import HotkeyService from '../services/HotkeyService';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import {
	GameMessage
} from './GameMessages';

const transitionEnterTime = 300;
const transitionLeaveTime = 3000;

export default class ChatBox extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.textField = null;
		this.chatBoxMessages = null;
		this.state = {
			textFieldValue: ''
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.scrollToBottom = _.debounce(this.scrollToBottom.bind(this), 300);
	}

	componentDidMount() {
		window.addEventListener('resize', this.scrollToBottom);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.scrollToBottom);
	}

	componentDidUpdate() {
		if (this.chatBoxMessages) {
			this.scrollToBottom();
		}
	}

	scrollToBottom() {
		this.chatBoxMessages.scrollTop = this.chatBoxMessages.scrollHeight;
	}

	onFocus() {
		HotkeyService.on('enter', this.onSubmit);
	}

	onBlur() {
		HotkeyService.off('enter', this.onSubmit);
	}

	onSubmit() {
		if (this.state.textFieldValue === '') { return; }
		this.props.messageService.addMessage(this.state.textFieldValue);
		this.setState({textFieldValue: ''});
	}

	userForId(id) {
		return this.props.userList.find(u => u.id === id);
	}

	render() {
		return (
			<div className={classNames('chat-box', this.props.className)}>
				<div className="chat-box-messages" ref={ref => this.chatBoxMessages = ref}>
					<ReactCSSTransitionGroup
						component="div"
						transitionName="message"
						className="game-text-message-container"
						transitionEnterTimeout={transitionEnterTime}
						transitionLeaveTimeout={transitionLeaveTime}>
						{this.props.game.messages.map(message => <GameMessage message={message} key={message.id} user={this.userForId(message.userId || message.user.id)} dark={true} />)}
					</ReactCSSTransitionGroup>
				</div>
				<TextField 
					ref={ref => this.textField = ref}
					value={this.state.textFieldValue}
					onChange={e => this.setState({textFieldValue: e.target.value})}
					onFocus={e => this.onFocus()}
					onBlur={e => this.onBlur()}
					placeholder="Send a message . . ." 
					size="S" 
					dark={true} />
			</div>
		);
	}
}