import styles from '../less/chat-box.less';
import TextField from './TextField';
import classNames from 'classnames';
import React from 'react';

export default class ChatBox extends React.Component {
	render() {
		return (
			<div className={classNames('chat-box', this.props.className)}>
				<div className="chat-box-messages">
					messages
				</div>
				<TextField placeholder="Send a message . . ." size="S" />
			</div>
		);
	}
}