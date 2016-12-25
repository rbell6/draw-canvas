import styles from '../less/game-modal.less';
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import {
	browserHistory
} from 'react-router';

export function StartGameModal(props) {
	return (
		<div className="game-modal start-game-modal">
			<h1>The game is about to begin . . .</h1>
		</div>
	);
}

export function EndRoundModal(props) {
	function onButtonClick(redirect) {
		Modal.close();
		if (redirect) {
			browserHistory.push(redirect);
		}
	}

	return (
		<div className="game-modal">
			<h1>The word was <span className="modal-round-word">{props.word}</span>.</h1>
		</div>
	);
}

export function EndGameModal(props) {
	function onButtonClick(redirect) {
		Modal.close();
		if (redirect) {
			browserHistory.push(redirect);
		}
	}

	return (
		<div className="game-modal end-game-modal">
			<h1>Game over!</h1>
			<div className="game-over-buttons">
				<Button variant="success" onClick={() => onButtonClick('/game-list')}>New game</Button>
				<Button onClick={() => onButtonClick('/create-user')}>Edit profile</Button>
			</div>
		</div>
	);
}