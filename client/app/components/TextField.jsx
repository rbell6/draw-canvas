import styles from '../less/text-field.less';
import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export default class TextField extends React.Component {
	render() {
		return (
			<input
				type="text"
				{..._.omit(this.props, ['dark', 'size'])}
				className={classNames('text-field', {
					'text-field-small': this.props.size === 'S',
					'text-field-dark': this.props.dark
				}, this.props.className)} />
		);
	}
}