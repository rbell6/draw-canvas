import styles from '../less/button.less';
import classNames from 'classnames';
import React from 'react';
import _ from 'lodash';

export default function Button(props) {
	let variant = props.variant || 'default';
	return (
		<button 
			{..._.omit(props, ['variant'])} 
			className={classNames(
				'button', {
					'button-info': variant === 'info',
					'button-success': variant === 'success',
					'button-quiet': variant === 'quiet'
				},
				props.className
			)}>{props.children}</button>
	);
}