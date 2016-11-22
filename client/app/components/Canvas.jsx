import React from 'react';
import ReactDOM from 'react-dom';
import Line from '../../../models/Line';
import LineCollection from '../../../models/LineCollection';
import Brush from '../../../models/Brush';
import MouseObserver from './MouseObserver';
import CursorCanvas from './CursorCanvas';

class DrawingCanvas extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.paint = this.paint.bind(this);
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this);
		this.ctx = this.el.getContext('2d');
		window.ctx = this.ctx;
	}

	shouldComponentUpdate() {
		// We don't want to use react to re-render this because we are using a <canvas>
		return false;
	}

	updateDimensions({width, height}) {
		this.el.width = width;
		this.el.height = height;
	}

	paint(lines=[]) {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);

		lines.getAll().forEach(line => {
			this._startDrawing(line);
			line.get('points').forEach((point, i) => {
				this._drawLineToPoint(point);
			});
			this._endDrawing();
		});
	}

	_startDrawing(line) {
		let point = line.startingPoint();
		let brush = line.get('brush');
		this._setBrushType(brush);
		this.ctx.beginPath();
		this.ctx.lineWidth = brush.get('size');
		this.ctx.strokeStyle = brush.get('color');
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.moveTo(point.x, point.y);
	}

	_drawLineToPoint(point) {
		this.ctx.lineTo(point.x, point.y);
	}

	_endDrawing() {
		this.ctx.stroke();
	}

	_setBrushType(brush) {
		if (brush.get('name') == 'eraser') {
			this.ctx.globalCompositeOperation = 'destination-out';
		} else {
			this.ctx.globalCompositeOperation = 'source-over';
		}
	}

	render() {
		return (
			<canvas className="canvas"></canvas>
		);
	}
}

export default class Canvas extends React.Component {
	constructor(props, context) {
		super(props, context);

		// Bind methods that we'll need to add/remove event listeners
		this.onChange = this.onChange.bind(this);
		this.resizeCanvas = this.resizeCanvas.bind(this);
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
		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();

		this.lines.on('change', this.onChange);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeCanvas);
		this.lines.off('change', this.onChange);
	}

	get canvas() {
		return this.refs.canvas;
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

	resizeCanvas() {
		this.canvas.updateDimensions({
			width: window.innerWidth,
			height: window.innerHeight
		});
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
				<MouseObserver 
					onMouseDown={this.startLine} 
					onMouseDownMove={this.extendLine} 
					onMouseMove={point => this.refs.cursorCanvas.paint(point)}
					onMouseLeave={() => this.refs.cursorCanvas.paint()} />
				<DrawingCanvas ref="canvas" />
			</div>
		);
	}
}