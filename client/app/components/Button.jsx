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
					'button-success': variant === 'success'
				},
				props.className
			)}>{props.children}</button>
	);
}