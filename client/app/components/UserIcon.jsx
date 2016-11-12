import React from 'react';
import User from '../../../models/User';
import classNames from 'classnames';

export default class UserIcon extends React.Component {
	
	static get defaultProps() {
		return {
			user: new User({name: 'phil'}),
			size: 'regular',
			showName: true,
			status: 'normal',
			points: 0
		};
	}

	render() {
		return (
			<div className={classNames('user-icon', `user-icon-${this.props.size}`, `user-icon-status-${this.props.status}`, this.props.className)}>
				<i className="user-avatar fa fa-user" />
				{this.props.showName ? 
					<span className="user-name-wrap"><span className="user-name" title={this.props.user.get('name')}>{this.props.user.get('name')}</span>{this.props.totalPoints > 0 ? <span className="total-user-points">&nbsp;({this.props.totalPoints})</span> : null }{this.props.points ? <span className="user-points">&nbsp;+{this.props.points}</span> : null }</span> 
					: 
					null 
				}
			</div>
		);
	}

}