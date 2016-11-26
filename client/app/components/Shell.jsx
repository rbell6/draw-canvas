import styles from '../less/shell.less';
import React from 'react';

export default class Shell extends React.Component {
	render() {
		return (
			<div className="shell">
				<img src="/static/img/logo.png" className="game-logo-small" />
				{this.props.children}
			</div>
		);
	}
}