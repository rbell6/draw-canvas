import styles from '../less/canvas.less';
import React from 'react';
import Line from '../../../models/Line';
import LineCollection from '../../../models/LineCollection';
import Brush from '../../../models/Brush';
import MouseObserver from './MouseObserver';
import CursorCanvas from './CursorCanvas';
import CanvasView from './CanvasView';

export default class Canvas extends React.Component {
	constructor(props, context) {
		super(props, context);

		// Bind methods that we'll need to add/remove event listeners
		this.onChange = this.onChange.bind(this);
		this.startLine = this.startLine.bind(this);
		this.extendLine = this.extendLine.bind(this);

		this.lines = new LineCollection();
		this._curLine = null;
	}

	static get defaultProps() {
		return {
			brush: new Brush(),
			onChange: function(){}
		};
	}

	componentDidMount() {
		this.reparentMouseObserver();
		this.lines.on('change', this.onChange);
	}

	componentWillUnmount() {
		this.lines.off('change', this.onChange);
		// We need to manually remove the mouse observer since we reparented it
		this.removeMouseObserver();
	}

	get canvas() {
		return this.refs.canvas;
	}

	// TODO put the mouse observer in the right spot so we don't have to reparent it
	reparentMouseObserver() {
		// The mouse observer needs to be on top of the components in center of the page
		let $mouseObserver = this.refs.mouseObserver.el;
		let $gameMessages = document.querySelector('.game-messages');
		let $parent = document.querySelector('.app');
		$parent.insertBefore($mouseObserver, $gameMessages.nextSibling);
	}

	removeMouseObserver() {
		this.refs.mouseObserver.el.remove();
	}

	onChange() {
		this.props.onChange({value: this.lines});
	}

	clear() {
		this.lines.removeAll();
		this.canvas.paint(this.lines);
	}

	undo() {
		this.lines.remove(this.lines.last());
		this.canvas.paint(this.lines);
	}

	startLine(point) {
		this._curLine = new Line({
			brush: this.props.brush
		});
		this.lines.add(this._curLine);
		this.addPointToLine(point);
	}

	extendLine(point) {
		this.addPointToLine(point);
		this.canvas.paint(this.lines);
	}

	addPointToLine(point) {
		this._curLine.addPoint(point);
	}

	render() {
		return (
			<div className="canvas-wrap">
				<CursorCanvas ref="cursorCanvas" brush={this.props.brush} />
				{/* This will get reparented */}
				<MouseObserver 
					ref="mouseObserver"
					onMouseDown={this.startLine} 
					onMouseDownMove={this.extendLine} 
					onMouseMove={point => this.refs.cursorCanvas.paint(point)}
					onMouseLeave={() => this.refs.cursorCanvas.paint()} />
				<CanvasView ref="canvas" />
			</div>
		);
	}
}