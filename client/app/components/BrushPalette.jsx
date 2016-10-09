import React from 'react';
import util from '../models/util';
import Brush from '../models/Brush';
import classNames from 'classnames';

const brushSizes = [12, 20, 28, 38];

export default class BrushPalette extends React.Component {
	setBrushColor(color) {
		this.props.onBrushChange(new Brush({
			size: this.props.brush.get('size'),
			color: color.value,
			name: color.name
		}));
	}

	setBrushSize(size) {
		this.props.onBrushChange(new Brush({
			size: size,
			color: this.props.brush.get('color'),
			name: this.props.brush.get('name')
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
							onClick={e => this.setBrushColor(color)}>
						</div>
					))}
				</div>
				<div className="brushes">
					{brushSizes.map(size => (
						<div
							key={size}
							className={classNames(
								'brush', 
								`brush-${this.props.brush.get('name')}`, 
								'brush-size', 
								`brush-size-${size}`, {
									'active': this.props.brush.get('size') == size						
								}
							)}
							onClick={e => this.setBrushSize(size)}>
						</div>
					))}
				</div>
			</div>
		);
	}
}