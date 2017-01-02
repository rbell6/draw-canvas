import styles from '../less/brush-palette.less';
import React from 'react';
import Brush from '../../../models/Brush';
import classNames from 'classnames';
import {
	connect
} from 'react-redux';
import {
	setBrushSize,
	setBrushColor,
	setBrushEraser
} from '../actions/GameActions';

class BrushPalette extends React.Component {
	static mapStateToProps(state) {
		return {
			brush: state.game.brush,
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			setBrushSize: size => dispatch(setBrushSize(size)),
			setBrushColor: color => dispatch(setBrushColor(color)),
			setBrushEraser: () => dispatch(setBrushEraser())
		};
	}

	trash() {
		this.props.onTrash();
	}

	undo() {
		this.props.onUndo();
	}

	render() {
		if (!this.props.brush) { return null; }
		return (
			<div className="brush-palette">
				<div className="brushes brush-colors">
					{Brush.colors.map(color => (
						<div 
							key={color.label} 
							className={classNames('brush', 'brush-' + color.label, {
								'active': this.props.brush.color == color.value
							})} 
							onClick={e => this.props.setBrushColor(color)}>
						</div>
					))}
				</div>
				<div className="brushes brush-sizes">
					{Brush.sizes.map(size => (
						<div
							key={size.label}
							className={classNames(
								'brush', 
								`brush-${this.props.brush.name}`, 
								'brush-size', 
								`brush-size-${size.label}`, {
									'active': this.props.brush.size.label === size.label						
								}
							)}
							onClick={e => this.props.setBrushSize(size)}>
						</div>
					))}
				</div>
				<div className="brush-utilities">
					<i className="fa fa-undo undo" onClick={e => this.undo()} />
					<i className={classNames('fa fa-eraser brush-eraser', {'active': this.props.brush.name == 'eraser'})} onClick={e => this.props.setBrushEraser()} />
					<i className="fa fa-trash trash" onClick={e => this.trash()} />
				</div>
			</div>
		);
	}
}

export default connect(BrushPalette.mapStateToProps, BrushPalette.mapDispatchToProps)(BrushPalette);
