import React from 'react';
import Canvas from './Canvas';
import Brush from '../models/Brush';
import classNames from 'classnames';

export default class App extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state ={
			brush: new Brush({
				size: 50,
				color: 'green'
			})
		};
	}

	static brushColors() {
		return ['green', 'blue', 'yellow', 'black', 'white'];
	}

	setBrushColor(color) {
		this.setState({
			brush: new Brush({
				size: this.state.brush.get('size'),
				color: color
			})
		});
	}

	render() {
		return (
			<div className="app">
				<Canvas brush={this.state.brush} />
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
			</div>
		);
	}
}
