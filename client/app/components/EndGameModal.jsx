import styles from '../less/end-game-modal.less';
import React from 'react';
import Modal from './Modal';

export default function EndGameModal(props) {
	function onButtonClick(redirect) {
		Modal.close();
		if (redirect) {
			browserHistory.push(redirect);
		}
	}

	return (
		<div className="end-game-modal">
			<h1>Game over!</h1>
		</div>
	);
}