import React from 'react';
import Canvas from '../components/Canvas';
import ViewOnlyCanvas from '../components/ViewOnlyCanvas';
import Brush from '../models/Brush';
import classNames from 'classnames';
import io from 'socket.io-client';

// TODO move
let socket = io();

export default class GamePage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state ={
			brush: new Brush({
				size: 50,
				color: 'green'
			}),
			view: 'draw', // || 'view'
		};
	}

	static brushColors() {
		return ['green', 'blue', 'yellow', 'black', 'white', 'red'];
	}

	setBrushColor(color) {
		this.setState({
			brush: new Brush({
				size: this.state.brush.get('size'),
				color: color
			})
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
				<div className="views">
					<button onClick={() => this.setState({view: 'draw'})}>Draw</button>
					<button onClick={() => this.setState({view: 'view'})}>View</button>
				</div>
				{ this.state.view == 'draw' ?
					<div className="brushes">
						{this.constructor.brushColors().map(color => (
							<div 
								key={color} 
								className={classNames('brush', 'brush-' + color, {
									'active': this.state.brush.get('color') == color
								})} 
								onClick={e => this.setBrushColor(color)}>
							</div>
						))}
					</div>
					:
					null
				}
			</div>
		);
	}
}
