import React from 'react';

export default class Shell extends React.Component {
	render() {
		return (
			<div>
				<div className="page">
					{this.props.children}
				</div>
			</div>
		);
	}
}