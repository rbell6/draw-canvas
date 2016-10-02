import classNames from 'classnames';
import React from 'react';

export default function Button(props) {
	return <button {...props} className={classNames('button', props.className)}>{props.children}</button>
}