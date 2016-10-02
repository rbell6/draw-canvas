import React from 'react';
import classNames from 'classnames';

export default class TextField extends React.Component {
	render() {
		return (
			<input
				type="text"
				{...this.props}
				className={classNames('text-field', this.props.className)} />
		);
	}
}