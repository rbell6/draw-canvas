import styles from '../less/lost-connection-modal.less';
import React from 'react';

export default function LostConnectionModal(props) {
	return (
		<div className="lost-connection-modal">
			<h1><span className="lost-connection-strong">Lost connection!</span>&nbsp; Please refresh the page.</h1>
		</div>
	);
}