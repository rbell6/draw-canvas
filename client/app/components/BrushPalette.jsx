import React from 'react';
import util from '../models/util';
import Brush from '../models/Brush';
import classNames from 'classnames';

export default class BrushPalette extends React.Component {
	setBrushColor(color) {
		this.props.onBrushChange(new Brush({
			size: this.props.brush.get('size'),
			color: color
		}));
	}

	render() {
		return (
			<div className="brush-palette">
				<div className="brushes">
					{util.colors().map(color => (
						<div 
							key={color.name} 
							className={classNames('brush', 'brush-' + color.name, {
								'active': this.props.brush.get('color') == color.value
							})} 
							onClick={e => this.setBrushColor(color.value)}>
						</div>
					))}
				</div>
			</div>
		);
	}
}