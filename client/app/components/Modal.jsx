import styles from '../less/modal.less';
import React from 'react';

export default class Modal extends React.Component {
	render() {
		return (
			<div className="modal">{this.props.children}</div>
		);
	} 
}

Modal.show = function(contents) {
	let e = new CustomEvent('showModal', {detail: contents});
	document.body.dispatchEvent(e);
}

Modal.close = function(contents) {
	let e = new CustomEvent('closeModal');
	document.body.dispatchEvent(e);
}