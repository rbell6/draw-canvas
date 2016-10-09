import React from 'react';
import Canvas from '../components/Canvas';
import ViewOnlyCanvas from '../components/ViewOnlyCanvas';
import BrushPalette from '../components/BrushPalette';
import Brush from '../models/Brush';
import classNames from 'classnames';
import io from 'socket.io-client';
import GameService from '../services/GameService';
import util from '../models/util';

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
	}

	static brushColors() {
		return ['green', 'blue', 'yellow', 'black', 'white', 'red'];
	}

	onBrushChange(brush) {
		this.setState({
			brush: brush
		});
	}

	onCanvasChange(lines) {
		socket.emit('draw', lines.toJSON());
	}

	render() {
		return (
			<div className="app">
				{ this.state.view == 'draw' ? 
					<Canvas brush={this.state.brush} onChange={e => this.onCanvasChange(e.value)} />
					:
					<ViewOnlyCanvas socket={socket} />
				}
				{ this.state.view == 'draw' ?
					<BrushPalette brush={this.state.brush} onBrushChange={brush => this.onBrushChange(brush)} />
					:
					null
				}
				<div className="views">
					<button onClick={() => this.setState({view: 'draw'})}>Draw</button>
					<button onClick={() => this.setState({view: 'view'})}>View</button>
				</div>
			</div>
		);
	}
}
