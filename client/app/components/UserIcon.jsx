import React from 'react';
import User from '../models/User';
import classNames from 'classnames';

export default class UserIcon extends React.Component {
	
	static get defaultProps() {
		return {
			user: new User({name: 'phil'}),
			size: 'regular',
			showName: true,
			status: 'normal'
		};
	}

	render() {
		return (
			<div className={classNames('user-icon', `user-icon-${this.props.size}`, `user-icon-status-${this.props.status}`, this.props.className)}>
				<i className="user-avatar fa fa-user" />
				{this.props.showName ? <span className="user-name">{this.props.user.get('name')}</span> : null }
			</div>
		);
	}

}