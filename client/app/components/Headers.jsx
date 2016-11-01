import React from 'react';
import classNames from 'classnames';

export function H1(props) {
	return (
		<h1 
			{...props}
			className={classNames('h1', props.className)}
		>{props.children}</h1>
	);
}

export function H3(props) {
	return (
		<h3 
			{...props}
			className={classNames('h3', props.className)}
		>{props.children}</h3>
	);
}