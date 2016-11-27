import styles from '../less/shell.less';
import React from 'react';
import {
	browserHistory
} from 'react-router';

export default class Shell extends React.Component {
	onLogoClick() {
		browserHistory.push('/game-list');
	}

	render() {
		return (
			<div className="shell">
				{this.props.children}
				<img src="/static/img/logo.png" className="game-logo-small" onClick={() => this.onLogoClick()} />
			</div>
		);
	}
}