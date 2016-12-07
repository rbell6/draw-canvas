import styles from '../less/mobile-canvas-page.less';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Canvas from '../components/Canvas';
import MouseObserver from '../components/MouseObserver';
import BrushPalette from '../components/BrushPalette';
import GameService from '../services/GameService';
import ActiveRoundService from '../services/ActiveRoundService';
import UserService from '../services/UserService';
import CanvasService from '../services/CanvasService';
import SocketService from '../services/SocketService';
import Brush from '../../../models/Brush';
import User from '../../../models/User';
import _ from 'lodash';
import {
	browserHistory
} from 'react-router';

const brushPaletteTransitionTime = 300;

function FirstChild(props) {
	var childrenArray = React.Children.toArray(props.children);
	return childrenArray[0] || null;
}

export default class MobileCanvasPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			brush: new Brush({
				size: Brush.sizes.M,
				color: Brush.colors[6].value,
				name: Brush.colors[6].label
			}),
			view: 'waiting',
			game: null
		};

		this.endGame = this.endGame.bind(this);
		this.onRoundsChange = this.onRoundsChange.bind(this);
		this.forceDisconnect = this.forceDisconnect.bind(this);
	}

	componentDidMount() {
		UserService.fetchMobile(this.props.params.mobileLinkId)
			.then(user => this.user = user)
			.then(() => this.getGame())
			.catch(err => {
				if (err.response.status === 404) {
					this.setState({view: '404'});
				}
			});
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
	}

	getGame() {
		return GameService.getFromUserId(this.user.id).then(game => {
			if (!game) {
				this.setState({view: 'waiting'});
				return;
			}
			this.setState({
				game: game
			});
			this.canvasService = new CanvasService(game);
			this.activeRoundService = new ActiveRoundService(game);
			this.activeRoundService.getRounds();
			this.activeRoundService.on('endGame', this.endGame);
			game.on('change:rounds', this.onRoundsChange);
			SocketService.on('forceDisconnect', this.forceDisconnect);
		});
	}

	forceDisconnect() {
		this.setState({view: 'disconnect'});
	}

	onCanvasChange({lines, aspectRatio}) {
		this.canvasService.emitCanvasChange(lines, aspectRatio);
	}

	onBrushChange(brush) {
		this.setState({
			brush: brush
		});
	}

	onTrash() {
		this.refs.canvas.clear();
	}

	onRoundsChange(e) {
		this.forceUpdate();
		if (this.refs.canvas) {
			this.refs.canvas.paint();
		}
		this.setState({
			view: this.drawerIsMe() ? 'drawing' : 'waiting'
		});
	}

	endGame() {
		this.setState({view: 'disconnect'});
	}

	drawerIsMe() {
		if (!_.get(this, 'state.game.activeRound')) { return false; }
		return _.get(this, 'user.id') === this.state.game.activeRound.get('drawerId');
	}

	render() {
		return (
			<div className="mobile-canvas-page">
				{ this.state.view === 'drawing' ?
					<Canvas brush={this.state.brush} onChange={e => this.onCanvasChange(e)} ref="canvas" />
					:
					null
				}
				{ this.state.view === 'drawing' ?
					<MouseObserver 
						onMouseDown={point => this.refs.canvas.startLine(point)} 
						onMouseDownMove={point => this.refs.canvas.extendLine(point)} 
						onMouseMove={point => this.refs.canvas.refs.cursorCanvas.paint(point)}
						onMouseLeave={() => this.refs.canvas.refs.cursorCanvas.paint()} />
					:
					null
				}
				{ this.state.view === 'waiting' ?
					<div className="waiting-text-wrap">
						{ this.state.game && this.state.game.activeRound ?
							<div className="waiting-text">Waiting for your turn . . .</div>
							:
							<div className="waiting-text">Waiting for game to start . . .</div>
						}
					</div>
					:
					null
				}
				{ this.state.view === '404' ?
					<div className="waiting-text-wrap">
						<div className="waiting-text">404! User not found</div>
					</div>
					:
					null
				}
				{ this.state.view === 'disconnect' ?
					<div className="waiting-text-wrap">
						<div className="waiting-text">Disconnected</div>
					</div>
					:
					null
				}
				{ this.state.view === 'drawing' ?
					<div className="round-word">{this.state.game.activeRound ? this.state.game.activeRound.get('word') : null}</div>
					:
					null
				}
				<ReactCSSTransitionGroup
					component={FirstChild}
					transitionName="brush-palette"
					transitionEnterTimeout={brushPaletteTransitionTime}
					transitionLeaveTimeout={brushPaletteTransitionTime}>
					{ this.state.view === 'drawing' ?
						<BrushPalette 
							brush={this.state.brush} 
							onBrushChange={brush => this.onBrushChange(brush)} 
							onTrash={() => this.onTrash()} />
						:
						null
					}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}
