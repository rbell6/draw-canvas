import React from 'react';

export default class Shell extends React.Component {
	render() {
		return (
			<div className="shell">
				{this.props.children}
			</div>
		);
	}
}