import React from 'react';
import {
	Link,
	browserHistory
} from 'react-router';
import TextField from '../components/TextField';
import Button from '../components/Button';
import User from '../../../models/User';
import UserService from '../services/UserService';

export default class CreateUserPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			user: UserService.get()
		};
	}

	onNicknameChange(name) {
		this.state.user.set('name', name);
		UserService.save();
		this.forceUpdate();
	}

	render() {
		return (
			<div className="create-user-page">
				<div className="create-user-container">
					<TextField 
						placeholder="Nickname"
						value={this.state.user.get('name')} 
						onChange={e => this.onNicknameChange(e.target.value)} />
				<div className="launch-buttons">
						<Button onClick={() => browserHistory.push('/game')} className="launch-button" disabled={this.state.user.get('name').length === 0}>Play</Button>
						<Button onClick={() => browserHistory.push('/game-list')} className="launch-button" disabled={this.state.user.get('name').length === 0}>Find a game</Button>
					</div>
				</div>
			</div>
		);
	}
}