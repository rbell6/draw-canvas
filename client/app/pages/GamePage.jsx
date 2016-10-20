import React from 'react';
import Canvas from '../components/Canvas';
import ViewOnlyCanvas from '../components/ViewOnlyCanvas';
import BrushPalette from '../components/BrushPalette';
import GamePanel from '../components/GamePanel';
import GameTextField from '../components/GameTextField';
import PreRoundModal from '../components/PreRoundModal';
import Brush from '../models/Brush';
import classNames from 'classnames';
import io from 'socket.io-client';
import GameService from '../services/GameService';
import util from '../models/util';
import Message from '../models/Message';
import HotkeyService from '../services/HotkeyService';
import UserService from '../services/UserService';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// TODO move
let socket = io();

function FirstChild(props) {
	var childrenArray = React.Children.toArray(props.children);
	return childrenArray[0] || null;
}

const modalDelayTime = 3000;
const modalTransitionEnterTime = 400;
const modalTransitionLeaveTime = 1000;

export default class GamePage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			game: GameService.getById(props.params.id),
			brush: new Brush({
				size: 20,
				color: util.colors()[0].value,
				name: util.colors()[0].name
			}),
			view: 'draw', // || 'view'
			showPreRoundModal: false
		};

		HotkeyService.on('undo', () => this.onUndo());
		window.game = this.state.game;
	}

	componentDidMount() {
		this.onActiveRoundChange = this.onActiveRoundChange.bind(this);
		this.state.game.on('change:activeRound', this.onActiveRoundChange);
		if (!this.state.game.activeRound) {
			this.state.game.createRound();
		}
		this.createNextRound();
	}

	createNextRound() {
		if (this.state.game.get('activeRoundIndex')+1 < this.state.game.get('numRounds')) {
			setTimeout(() => {
				this.state.game.createRound();
				this.createNextRound();
			}, this.state.game.get('gameTime'));
		}
	}

	componentWillUnmount() {
		this.state.game.off('change:activeRound', this.onActiveRoundChange);
	}

	onActiveRoundChange() {
		this.setState({showPreRoundModal: true});
		setTimeout(() => this.setState({showPreRoundModal: false}), modalDelayTime);
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

	onTextFieldChange(value) {
		this.state.game.get('messages').add(new Message({
			user: UserService.get(),
			text: value
		}));
		this.forceUpdate();
	}

	render() {
		return (
			<div className="app">
				{ this.state.view == 'draw' ? 
					<Canvas brush={this.state.brush} onChange={e => this.onCanvasChange(e.value)} ref="canvas" />
					:
					<ViewOnlyCanvas socket={socket} />
				}
				{ this.state.view == 'draw' ?
					<BrushPalette 
						brush={this.state.brush} 
						onBrushChange={brush => this.onBrushChange(brush)} 
						onUndo={() => this.onUndo()}
						onTrash={() => this.onTrash()} />
					:
					null
				}
				<div className="views">
					<button onClick={() => this.setState({view: 'draw'})}>Draw</button>
					<button onClick={() => this.setState({view: 'view'})}>View</button>
				</div>
				<GamePanel game={this.state.game} />
				<GameTextField game={this.state.game} onChange={e => this.onTextFieldChange(e.value)} />
				<ReactCSSTransitionGroup
					component={FirstChild}
					transitionName="pre-round-modal"
					className="pre-round-modal"
					transitionEnterTimeout={modalTransitionEnterTime}
					transitionLeaveTimeout={modalTransitionLeaveTime}>
					{this.state.showPreRoundModal ? <PreRoundModal game={this.state.game} /> : null}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}
