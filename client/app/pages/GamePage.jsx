import styles from '../less/game-page.less';
import React from 'react';
import Canvas from '../components/Canvas';
import CanvasView from '../components/CanvasView';
import BrushPalette from '../components/BrushPalette';
import GamePanel from '../components/GamePanel';
import GameTextField from '../components/GameTextField';
import GameMessages from '../components/GameMessages';
import PreRoundModal from '../components/PreRoundModal';
import Brush from '../../../models/Brush';
import classNames from 'classnames';
import io from 'socket.io-client';
import GameService from '../services/GameService';
import Message from '../../../models/Message';
import HotkeyService from '../services/HotkeyService';
import UserService from '../services/UserService';
import ActiveRoundService from '../services/ActiveRoundService';
import CanvasService from '../services/CanvasService';
import MessageService from '../services/MessageService';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
	browserHistory
} from 'react-router';

// TODO move
// let socket = io();

function FirstChild(props) {
	var childrenArray = React.Children.toArray(props.children);
	return childrenArray[0] || null;
}

const modalViewableTime = 3000;
const modalTransitionEnterTime = 600;
const modalTransitionLeaveTime = 1000;
const brushPaletteTransitionTime = 300;
const gameTextFieldTransitionTime = 1000;

export default class GamePage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			brush: new Brush({
				size: Brush.sizes.M,
				color: Brush.colors[6].value,
				name: Brush.colors[6].label
			}),
			showPreRoundModal: false,
			userGuessedCorrectWord: false
		};

		this.onExternalCanvasChange = this.onExternalCanvasChange.bind(this);
		this.onRoundsChange = this.onRoundsChange.bind(this);
		this.endGame = this.endGame.bind(this);
		this.onGameChange = this.onGameChange.bind(this);
		this.onUndo = this.onUndo.bind(this);
		this.userGuessedCorrectWord = this.userGuessedCorrectWord.bind(this);
	}

	componentDidMount() {
		GameService.getById(this.props.params.id).then(game => {
			if (!game) {
				this.endGame();
				return;
			}
			this.setState({
				game: game
			});
			window.game = game;
			GameService.joinGame(game).then(g => this.updateGameUsers(g.get('users')));
			this.canvasService = new CanvasService(game);
			this.canvasService.on(`change:canvas:${game.id}`, this.onExternalCanvasChange);
			this.activeRoundService = new ActiveRoundService(game);
			this.activeRoundService.getRounds();
			this.activeRoundService.on('endGame', this.endGame);
			this.messageService = new MessageService(game);
			this.messageService.on('userGuessedCorrectWord', this.userGuessedCorrectWord);
			game.on('change:rounds', this.onRoundsChange);
		});
		GameService.on('change:game', this.onGameChange);
		HotkeyService.on('undo', this.onUndo);
		this._mounted = true;
	}

	componentWillUnmount() {
		if (this.state.game) {
			this.state.game.off('change:rounds', this.onRoundsChange);
		}
		if (this.activeRoundService) {
			this.activeRoundService.off('endGame', this.endGame);
			this.activeRoundService.destroy();
		}
		if (this.canvasService) {
			this.canvasService.destroy();
		}
		if (this.messageService) {
			this.messageService.off('userGuessedCorrectWord', this.userGuessedCorrectWord);
			this.messageService.destroy();
		}
		GameService.off('change:game', this.onGameChange);
		HotkeyService.off('undo', this.onUndo);
		this._mounted = false;
	}

	onExternalCanvasChange(e) {
		if (!this.drawerIsMe()) {
			let lines = e.data.lines;
			let aspectRatio = e.data.aspectRatio;
			this.refs.canvasView.paint(lines, {aspectRatio});
		}
	}

	onRoundsChange() {
		if (!this._mounted) { return; }
		this.setState({
			showPreRoundModal: true,
			userGuessedCorrectWord: false
		});
		if (this.refs.canvas) {
			this.refs.canvas.paint();
		}
		if (this.refs.canvasView) {
			this.refs.canvasView.paint();
		}

		// Hide the pre-round modal
		setTimeout(() => {
			if (!this._mounted) { return; }
			this.setState({showPreRoundModal: false});
		}, modalViewableTime);
	}

	endGame() {
		browserHistory.push('/game-list');
	}

	onBrushChange(brush) {
		this.setState({
			brush: brush
		});
	}

	onTrash() {
		this.refs.canvas.clear();
	}

	onUndo() {
		this.refs.canvas.undo();
	}

	onCanvasChange({lines, aspectRatio}) {
		this.canvasService.emitCanvasChange(lines, aspectRatio);
	}

	onGameChange(e) {
		let game = e.data;
		this.updateGameUsers(game.get('users'));
	}

	updateGameUsers(newUsers) {
		this.state.game.set('users', newUsers);
		this.forceUpdate();
	}

	drawerIsMe() {
		if (!this.state.game.activeRound) { return false; }
		return UserService.get().id === this.state.game.activeRound.get('drawerId');
	}

	userGuessedCorrectWord() {
		this.setState({
			userGuessedCorrectWord: true
		});
	}

	render() {
		return (
			<div className="game-page">
				{this.state.game ?
					<div className={classNames('app', {'drawer-is-me': this.drawerIsMe()})}>
						{ this.canvasService ?
							this.drawerIsMe() ? 
								<Canvas brush={this.state.brush} onChange={e => this.onCanvasChange(e)} ref="canvas" />
								:
								<CanvasView ref="canvasView" />
							:
							null
						}
						{ this.drawerIsMe() ?
							<div className="round-word">{this.state.game.activeRound ? this.state.game.activeRound.get('word') : null}</div>
							:
							null
						}
						<ReactCSSTransitionGroup
							component={FirstChild}
							transitionName="pre-round-modal"
							transitionEnterTimeout={modalTransitionEnterTime}
							transitionLeaveTimeout={modalTransitionLeaveTime}>
							{this.state.showPreRoundModal ? <PreRoundModal game={this.state.game} /> : null}
						</ReactCSSTransitionGroup>
						<GameMessages game={this.state.game} />
						<ReactCSSTransitionGroup
							component={FirstChild}
							transitionName="brush-palette"
							transitionEnterTimeout={brushPaletteTransitionTime}
							transitionLeaveTimeout={brushPaletteTransitionTime}>
							{ this.drawerIsMe() ?
								<BrushPalette 
									brush={this.state.brush} 
									onBrushChange={brush => this.onBrushChange(brush)} 
									onUndo={() => this.onUndo()}
									onTrash={() => this.onTrash()} />
								:
								null
							}
						</ReactCSSTransitionGroup>
						{this.state.game ? 
							<GamePanel game={this.state.game} />
							:
							null
						}
						<ReactCSSTransitionGroup
							component={FirstChild}
							transitionName="game-text-field"
							transitionEnterTimeout={gameTextFieldTransitionTime}
							transitionLeaveTimeout={gameTextFieldTransitionTime}>
							{ this.state.game.activeRound && !this.drawerIsMe() ? 
								<GameTextField 
									game={this.state.game}
									messageService={this.messageService}
									onChange={e => this.onTextFieldChange(e.value)}
									userGuessedCorrectWord={this.state.userGuessedCorrectWord} /> 
								: 
								null 
							}
						</ReactCSSTransitionGroup>
					</div>
					:
					<div className="app-loading"><div className="spinner"><i className="fa fa-cog fa-spin" /></div></div>
				}
			</div>
		);
	}
}
