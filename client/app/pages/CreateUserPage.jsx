import styles from '../less/create-user-page.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Link,
	browserHistory
} from 'react-router';
import TextField from '../components/TextField';
import Button from '../components/Button';
import User from '../../../models/User';
import UserService from '../services/UserService';
import _ from 'lodash';

export default class CreateUserPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			user: UserService.get() || new User({name: 'bobo'})
		};
	}

	componentDidMount() {
		this.textField = ReactDOM.findDOMNode(this.refs.textField);
		this.textField.focus();
	}

	get userName() {
		return this.state.user.get('name');
	}

	onNicknameChange(name) {
		this.state.user.set('name', name);
		this.forceUpdate();
	}

	onContinue() {
		UserService.save(this.state.user).then(user => browserHistory.push('/game-list'));
	}

	render() {
		return (
			<div className="create-user-page">
				<div className="create-user-container">
					<TextField 
						placeholder="Nickname"
						value={this.userName}
						ref="textField" 
						onChange={e => this.onNicknameChange(e.target.value)} />
					<div className="launch-buttons">
						<Button onClick={() => browserHistory.push('/game')} className="launch-button" disabled={true /*this.userName.length === 0*/}>Play</Button>
						<Button onClick={() => this.onContinue()} className="launch-button" disabled={this.userName.length === 0}>Find a game</Button>
					</div>
				</div>
			</div>
		);
	}
}