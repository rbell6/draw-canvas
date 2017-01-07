import styles from '../less/game-modal.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import Button from './Button';
import CanvasView from './CanvasView';
import Footer from './Footer';
import ChatBox from './ChatBox';
import PlayerList from './PlayerList';
import TextField from './TextField';
import GameUtil from '../util/GameUtil';
import HotkeyService from '../services/HotkeyService';
import classNames from 'classnames';
import _ from 'lodash';
import {
	browserHistory
} from 'react-router';
import {
	connect
} from 'react-redux';
import {
	cancelGame,
	startGame,
	leaveGame,
	saveGameName,
} from '../actions/GameActions';

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
		<div className="game-scoreboard-wrap">
			<div className="game-scoreboard">
				{GameUtil.usersWithPoints(props.game).map((userWithPoints, index) => (
					<div key={userWithPoints.userId} className={classNames('scoreboard-row', {'game-scoreboard-current-user': userWithPoints.userId === props.user.id})}>
						<div className="scoreboard-number">{index+1}.</div>
						<div className="scoreboard-user">{_.get(userForId(userWithPoints.userId), 'name', '')}</div>
						<div className="scoreboard-score">{userWithPoints.points}</div>
					</div>
				))}
			</div>
		</div>
	);
}

class GameStageModal extends React.Component {
	static mapStateToProps(state) {
		return {
			game: state.game,
			user: state.user,
			userList: state.userList
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			cancelGame: id => dispatch(cancelGame(id)),
			startGame: id => dispatch(startGame(id)),
			leaveGame: id => dispatch(leaveGame(id)),
			saveGameName: (id, name) => dispatch(saveGameName(id, name))
		};
	}

	constructor(props, context) {
		super(props, context);
		this.onNameChange = _.debounce(this.onNameChange.bind(this), 1000);
	}

	componentWillReceiveProps(props) {
		if (props.game.gameState === 'canceled') {
			this.leaveGame();
		}
		if (props.game.gameState === 'active') {
			this.startGame();
		}
	}

	onStartButtonPress() {
		this.props.startGame(this.props.game.id);
	}

	onCancelButtonPress() {
		if (this.userIsHost()) {
			this.props.cancelGame(this.props.game.id);
		} else {
			this.props.leaveGame(this.props.game.id);
			this.leaveGame();
		}
	}

	leaveGame() {
		if (!this.isGamePage()) { return; }
		browserHistory.push('/game-list');
		Modal.close();
	}

	startGame() {
		Modal.close();
	}

	isGamePage() {
		return window.location.pathname.indexOf('/game/') === 0;
	}

	userIsHost() {
		return this.props.user.id === this.props.game.hostId;
	}

	onNameChange(name) {
		this.props.saveGameName(this.props.game.id, name);
	}

	render() {
		return (
			<div className="game-modal game-stage-modal footer-offset">
				<div className="game-stage-modal-contents">
					<ChatBox className="footer-offset" messageService={this.props.messageService} userList={this.props.userList} game={this.props.game} />
					<div className="game-stage-modal-game-description">
						<TextField 
							className="game-stage-modal-header"
							placeholder="Game Name"
							defaultValue={this.props.game.name} 
							onChange={e => this.onNameChange(e.target.value)}
							disabled={!this.userIsHost()} />
						<PlayerList players={this.props.game.users} dark={true} />
					</div>
				</div>
				<Footer dark={true}>
					<Button onClick={() => this.onCancelButtonPress()} variant="quiet">Cancel</Button>
					{this.userIsHost() ? 
						<Button onClick={() => this.onStartButtonPress()} variant="success">Start Game</Button> 
						: 
						<div className="waiting-for-host-text">Waiting for the host to start the game . . .</div>
					}
				</Footer>
			</div>
		);
	}
}
let ConnectedGameStageModal = connect(GameStageModal.mapStateToProps, GameStageModal.mapDispatchToProps)(GameStageModal);
export {
	ConnectedGameStageModal as GameStageModal
};

export class EndGameModal extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.drawings = [];
	}

	componentDidMount() {
		this.props.game.rounds.forEach((round, index) => {
			this.drawings[index].paint(round.lines, {aspectRatio: round.aspectRatio});
		});
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
				<div className="end-game-modal-contents">
					<ChatBox className="footer-offset" messageService={this.props.messageService} userList={this.props.userList} game={this.props.game} />
					<div className="end-game-modal-game-description footer-offset">
						<h1 className="game-over-header">Game over!</h1>
						<h2 className="results-header">Results</h2>
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
					</div>
				</div>
				<Footer dark={true}>
					<Button variant="success" onClick={() => this.onButtonClick('/game-list')}>New game</Button>
				</Footer>
			</div>
		);
	}
}