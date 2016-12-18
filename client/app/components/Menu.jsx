import styles from '../less/menu.less';
import React from 'react';
import Button from './Button';
import Modal from './Modal';
import {
	browserHistory
} from 'react-router';

function CloseIcon(props) {
	return (
		<div className="menu-close-icon" onClick={() => props.onClose()}></div>
	);
}

export default function Menu(props) {
	function onButtonClick(redirect) {
		Modal.close();
		if (redirect) {
			browserHistory.push(redirect);
		}
	}

	return (
		<div className="menu">
			<CloseIcon onClose={() => onButtonClick()} />
			<div className="menu-buttons">
				<Button variant="success" onClick={() => onButtonClick('/game-list')}>Find a game</Button>
				<Button onClick={() => onButtonClick('/create-user')}>Edit profile</Button>
				<Button onClick={() => onButtonClick()} variant="quiet">Back</Button>
			</div>
		</div>
	);
}