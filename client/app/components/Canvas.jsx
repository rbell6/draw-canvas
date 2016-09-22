import React from 'react';
import io from 'socket.io-client';
import Line from '../models/Line';
import LineCollection from '../models/LineCollection';
import Brush from '../models/Brush';

// TODO move
let socket = io();

export default class Canvas extends React.Component {
	constructor(props, context) {
		super(props, context);

		// Bind methods that we'll need to add/remove event listeners
		this.resizeCanvas = this.resizeCanvas.bind(this);
		this.startLine = this.startLine.bind(this);
		this.extendLine = this.extendLine.bind(this);
		this.stopLine = this.stopLine.bind(this);

		this.lines = new LineCollection();
		this._curLine = null;
	}

	static get defaultProps() {
		return {
			brush: new Brush()
		};
	}

	componentDidMount() {
		this.canvas = this.refs.canvas;
		this.ctx = this.canvas.getContext('2d');

		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();

		this.canvas.addEventListener('mousedown', this.startLine);
	}

	shouldComponentUpdate() {
		// We don't want to use react to re-render this because we are using a <canvas>
		return false;
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.paint();
	}

	startLine(e) {
		this._curLine = new Line({
			brush: this.props.brush
		});
		this.lines.add(this._curLine);
		this.addPointToLine({
			x: e.offsetX,
			y: e.offsetY
		});
		window.addEventListener('mousemove', this.extendLine);
		window.addEventListener('mouseup', this.stopLine);
	}

	extendLine(e) {
		this.addPointToLine({
			x: e.offsetX,
			y: e.offsetY
		});
	}

	addPointToLine(point) {
		this._curLine.addPoint(point);
		this.paint();
	}

	stopLine() {
		window.removeEventListener('mousemove', this.extendLine);
		window.removeEventListener('mouseup', this.stopLine);
	}

	paint() {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);

		this.lines.getAll().forEach(line => {
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

	render() {
		return (
			<canvas ref="canvas"></canvas>
		);
	}
}