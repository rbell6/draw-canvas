import React from 'react';
import {
	Link,
	browserHistory
} from 'react-router';

export default class CreateUserPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			nickname: ''
		};
	}

	onNicknameChange(nickname) {
		this.setState({
			nickname: nickname
		});
	}

	render() {
		return (
			<div className="create-user-page">
				<div className="create-user-container">
					<input 
						type="text" 
						placeholder="Nickname" 
						className="username-field" 
						value={this.state.nickname} 
						onChange={e => this.onNicknameChange(e.target.value)} />
					<div className="launch-buttons">
						<button onClick={() => browserHistory.push('/game')} className="launch-button" disabled={this.state.nickname.length === 0}>Play</button>
						<button onClick={() => browserHistory.push('/game-list')} className="launch-button" disabled={this.state.nickname.length === 0}>Find a game</button>
					</div>
				</div>
			</div>
		);
	}
}