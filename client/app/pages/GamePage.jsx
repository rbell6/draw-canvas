import React from 'react';
import Canvas from '../components/Canvas';
import ViewOnlyCanvas from '../components/ViewOnlyCanvas';
import BrushPalette from '../components/BrushPalette';
import GamePanel from '../components/GamePanel';
import GameTextField from '../components/GameTextField';
import Brush from '../models/Brush';
import classNames from 'classnames';
import io from 'socket.io-client';
import GameService from '../services/GameService';
import util from '../models/util';
import HotkeyService from '../services/HotkeyService';

// TODO move
let socket = io();

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
		};

		HotkeyService.on('undo', () => this.onUndo());
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
				<GameTextField onChange={e => this.onTextFieldChange(e.value)} />
			</div>
		);
	}
}
