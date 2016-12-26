import styles from '../less/game-modal.less';
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import GameUtil from '../util/GameUtil';
import classNames from 'classnames';
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

let Scoreboard = props => {
	let userForId = id => props.userList.find(u => u.id === id);
	return (
		<div className="game-scoreboard">
			<ol>
			{GameUtil.usersWithPoints(props.game).map(userWithPoints => (
				<li key={userWithPoints.userId} className={classNames({'game-scoreboard-current-user': userWithPoints.userId === props.user.id})}>{_.get(userForId(userWithPoints.userId), 'name', '')} <span className="game-scoreboard-score">({userWithPoints.points})</span></li>
			))}
			</ol>
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
			<Scoreboard game={props.game} userList={props.userList} user={props.user} />
			<div className="game-over-buttons">
				<Button variant="success" onClick={() => onButtonClick('/game-list')}>New game</Button>
				<Button onClick={() => onButtonClick('/create-user')}>Edit profile</Button>
			</div>
		</div>
	);
}