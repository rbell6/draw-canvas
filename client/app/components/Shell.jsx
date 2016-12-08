import styles from '../less/shell.less';
import React from 'react';
import {
	browserHistory
} from 'react-router';
import UserIcon from './UserIcon';
import UserService from '../services/UserService';

export default class Shell extends React.Component {
	onLogoClick() {
		browserHistory.push('/game-list');
	}

	onUserIconClick() {
		browserHistory.push('/create-user');
	}

	render() {
		let user = UserService.get();
		return (
			<div className="shell">
				{this.props.children}
				<div className="header-icons">
					<img src="/static/img/logo.png" className="game-logo-small" onClick={() => this.onLogoClick()} />
					{user ?
						<div className="game-user-icon">
							<UserIcon user={user} onClick={() => this.onUserIconClick()} showName={false} />
						</div>
						:
						null
					}
				</div>
			</div>
		);
	}
}