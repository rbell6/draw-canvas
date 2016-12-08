import styles from '../less/user-icon.less';
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
			points: 0,
			showPoints: false,
			onClick: () => {}
		};
	}

	render() {
		return (
			<div 
				className={classNames(
					'user-icon', 
					`user-icon-${this.props.size}`, 
					`user-icon-status-${this.props.status}`, 
					this.props.className)}
				onClick={this.props.onClick}>
				<i className="user-avatar fa fa-user" />
				{this.props.showName ? 
					<div className="user-name-wrap">
						<div className="user-name" title={this.props.user.get('name')}>{this.props.user.get('name')}</div>
						{
							this.props.showPoints ?
								<div className="user-points-wrap">
									<div className="total-user-points">{this.props.totalPoints}</div>
									{this.props.points ? <div className="user-points">&nbsp;+{this.props.points}</div> : null }
								</div>
							:
							null
						}
					</div>
					: 
					null 
				}
			</div>
		);
	}

}