import React from 'react';

export default function UserIcon(props) {
	return (
		<div className="user-icon">
			<i className="user-avatar fa fa-user" />
			<span className="user-name">{props.user.get('name')}</span>
		</div>
	);
}