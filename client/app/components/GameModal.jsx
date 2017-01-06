import styles from '../less/game-modal.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import Button from './Button';
import CanvasView from './CanvasView';
import Footer from './Footer';
import ChatBox from './ChatBox';
import PlayerList from './PlayerList';
import GameUtil from '../util/GameUtil';
import classNames from 'classnames';
import _ from 'lodash';
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
		<div className="game-modal end-round-modal">
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

export class GameStageModal extends React.Component {
	startGame() {

	}

	cancelGame() {

	}

	render() {
		return (
			<div className="game-modal game-stage-modal footer-offset">
				<div className="game-stage-modal-contents">
					<ChatBox className="footer-offset" messageService={this.props.messageService} userList={this.props.userList} game={this.props.game} />
					<div className="game-stage-modal-game-description">
						<PlayerList players={this.props.game.users} dark={true} />
					</div>
				</div>
				<Footer dark={true}>
					<Button onClick={() => this.cancelGame()} variant="quiet">Cancel</Button>
					<Button onClick={() => this.startGame()} variant="success">Start Game</Button>
				</Footer>
			</div>
		);
	}
}

export class EndGameModal extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.debouncedOnScroll = _.debounce(this.onScroll.bind(this), 100, {maxWait: 100});
		this.drawings = [];
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this);
		this.el.addEventListener('scroll', this.debouncedOnScroll);
		this.gameLogo = document.querySelector('.game-logo-small');

		this.props.game.rounds.forEach((round, index) => {
			this.drawings[index].paint(round.lines, {aspectRatio: round.aspectRatio});
		});
	}

	componentWillUnmount() {
		this.el.removeEventListener('scroll', this.debouncedOnScroll);
		this.gameLogo.style.display = '';
	}

	// Hide the logo when they scroll so it doesn't overlap with the modal contents
	onScroll() {
		if (!this.el) { return; }
		if (this.el.scrollTop > 60) {
			this.gameLogo.style.display = 'none';
		} else {
			this.gameLogo.style.display = '';
		}
	}

	onButtonClick(redirect) {
		Modal.close();
		if (redirect) {
			browserHistory.push(redirect);
		}
	}

	userForId(id) {
		return this.props.userList.find(u => u.id === id);
	}

	render() {
		return (
			<div className="game-modal end-game-modal">
				<h1>Game over!</h1>
				<Scoreboard game={this.props.game} userList={this.props.userList} user={this.props.user} />
				<div className="game-over-drawings">
					{this.props.game.rounds.map((round, index) => (
						<div className="game-over-drawing" key={round.id}>
							<CanvasView 
								ref={el => this.drawings[index] = el } 
								width={300} 
								height={300} 
								immediate={true}
								className="game-over-drawing" />
							<div className="game-over-drawing-title"><span className="game-over-drawing-name">"{round.word}"</span> by {_.get(this.userForId(round.drawerId), 'name', 'Unknown')}</div>
						</div>
					))}
				</div>
				<div className="game-over-buttons">
					<Button variant="success" onClick={() => this.onButtonClick('/game-list')}>New game</Button>
					<Button onClick={() => this.onButtonClick('/create-user')}>Edit profile</Button>
				</div>
			</div>
		);
	}
}