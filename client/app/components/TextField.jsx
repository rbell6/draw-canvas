import styles from '../less/text-field.less';
import React from 'react';
import classNames from 'classnames';

export default class TextField extends React.Component {
	render() {
		return (
			<input
				type="text"
				{...this.props}
				className={classNames('text-field', {'text-field-small': this.props.size === 'S'}, this.props.className)} />
		);
	}
}