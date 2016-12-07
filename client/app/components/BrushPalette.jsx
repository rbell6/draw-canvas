import styles from '../less/brush-palette.less';
import React from 'react';
import Brush from '../../../models/Brush';
import classNames from 'classnames';

export default class BrushPalette extends React.Component {
	setBrushColor(color) {
		this.props.onBrushChange(new Brush({
			size: this.props.brush.get('size'),
			color: color.value,
			name: color.label
		}));
	}

	setBrushSize(size) {
		this.props.onBrushChange(new Brush({
			size: size,
			color: this.props.brush.get('color'),
			name: this.props.brush.get('name')
		}));
	}

	setEraser() {
		this.props.onBrushChange(new Brush({
			size: this.props.brush.get('size'),
			name: 'eraser'
		}));
	}

	trash() {
		this.props.onTrash();
	}

	undo() {
		this.props.onUndo();
	}

	render() {
		return (
			<div className="brush-palette">
				<div className="brushes brush-colors">
					{Brush.colors.map(color => (
						<div 
							key={color.label} 
							className={classNames('brush', 'brush-' + color.label, {
								'active': this.props.brush.get('color') == color.value
							})} 
							onClick={e => this.setBrushColor(color)}>
						</div>
					))}
				</div>
				<div className="brushes brush-sizes">
					{Brush.sizes.map(size => (
						<div
							key={size.label}
							className={classNames(
								'brush', 
								`brush-${this.props.brush.get('name')}`, 
								'brush-size', 
								`brush-size-${size.label}`, {
									'active': this.props.brush.get('size').label === size.label						
								}
							)}
							onClick={e => this.setBrushSize(size)}>
						</div>
					))}
				</div>
				<div className="brush-utilities">
					<i className="fa fa-undo undo" onClick={e => this.undo()} />
					<i className={classNames('fa fa-eraser brush-eraser', {'active': this.props.brush.get('name') == 'eraser'})} onClick={e => this.setEraser()} />
					<i className="fa fa-trash trash" onClick={e => this.trash()} />
				</div>
			</div>
		);
	}
}