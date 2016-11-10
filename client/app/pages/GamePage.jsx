import React from 'react';
import Canvas from '../components/Canvas';
import ViewOnlyCanvas from '../components/ViewOnlyCanvas';
import BrushPalette from '../components/BrushPalette';
import GamePanel from '../components/GamePanel';
import GameTextField from '../components/GameTextField';
import GameMessages from '../components/GameMessages';
import PreRoundModal from '../components/PreRoundModal';
import Brush from '../../../models/Brush';
import classNames from 'classnames';
import io from 'socket.io-client';
import GameService from '../services/GameService';
import util from '../../../models/util';
import Message from '../../../models/Message';
import HotkeyService from '../services/HotkeyService';
import UserService from '../services/UserService';
import ActiveRoundService from '../services/ActiveRoundService';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
	browserHistory
} from 'react-router';

// TODO move
let socket = io();

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
				size: 20,
				color: util.colors()[0].value,
				name: util.colors()[0].name
			}),
			showPreRoundModal: false
		};

		this.onActiveRoundChange = this.onActiveRoundChange.bind(this);
		this.onUndo = this.onUndo.bind(this);
	}

	componentDidMount() {
		GameService.getById(this.props.params.id).then(game => {
			if (!game) {
				browserHistory.push('/game-list');
				return;
			}
			this.setState({
				game: game
			});
			window.game = game;
			GameService.joinGame(game).then(g => this.state.game.set('users', g.get('users')));
			this.activeRoundService = new ActiveRoundService(game);
			this.activeRoundService.getRounds(game);
			game.on('change:rounds', this.onActiveRoundChange);
		});
		HotkeyService.on('undo', this.onUndo);
		this._mounted = true;
	}

	componentWillUnmount() {
		if (this.state.game) {
			// this.state.game.off('change:activeRound', this.onActiveRoundChange);
			this.state.game.off('change:rounds', this.onActiveRoundChange);
		}
		HotkeyService.off('undo', this.onUndo);
		this._mounted = false;
	}

	onActiveRoundChange() {
		if (!this._mounted) { return; }
		if (this.state.game.get('rounds').length === this.state.game.get('numRounds')) {
			this.endGame();
		}
		this.setState({showPreRoundModal: true});
		setTimeout(() => {
			if (!this._mounted) { return; }
			this.setState({showPreRoundModal: false}), modalViewableTime
		});
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

	onCanvasChange(lines) {
		socket.emit('draw', lines.toJSON());
	}

	drawerIsMe() {
		if (!this.state.game.activeRound) { return false; }
		return UserService.get().id === this.state.game.activeRound.get('drawerId');
	}

	render() {
		return (
			<div className="game-page">
				{this.state.game ?
					<div className={classNames('app', {'drawer-is-me': this.drawerIsMe()})}>
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
						{ this.drawerIsMe() ? 
							<Canvas brush={this.state.brush} onChange={e => this.onCanvasChange(e.value)} ref="canvas" />
							:
							<ViewOnlyCanvas socket={socket} />
						}
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
							<GamePanel game={this.state.game} />
						<ReactCSSTransitionGroup
							component={FirstChild}
							transitionName="game-text-field"
							transitionEnterTimeout={gameTextFieldTransitionTime}
							transitionLeaveTimeout={gameTextFieldTransitionTime}>
							{ this.state.game.activeRound && !this.drawerIsMe() ? 
								<GameTextField game={this.state.game} onChange={e => this.onTextFieldChange(e.value)} /> 
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
