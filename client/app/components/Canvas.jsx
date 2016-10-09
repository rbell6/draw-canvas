import React from 'react';
import Line from '../models/Line';
import LineCollection from '../models/LineCollection';
import Brush from '../models/Brush';

export default class Canvas extends React.Component {
	constructor(props, context) {
		super(props, context);

		// Bind methods that we'll need to add/remove event listeners
		this.onChange = this.onChange.bind(this);
		this.resizeCanvas = this.resizeCanvas.bind(this);
		this.startLine = this.startLine.bind(this);
		this.extendLine = this.extendLine.bind(this);
		this.stopLine = this.stopLine.bind(this);
		this.paint = this.paint.bind(this);

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
		this.canvas = this.refs.canvas;
		this.ctx = this.canvas.getContext('2d');
		window.ctx = this.ctx;

		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();

		this.lines.on('change', this.onChange);

		this.canvas.addEventListener('mousedown', this.startLine);
		this.canvas.addEventListener('mousemove', this.paint);
	}

	shouldComponentUpdate() {
		// We don't want to use react to re-render this because we are using a <canvas>
		return false;
	}

	componentWillUnmount() {
		this.canvas.removeEventListener('mousedown', this.startLine);
		this.canvas.removeEventListener('mousemove', this.paint);
		this.lines.off('change', this.onChange);
	}

	onChange() {
		this.props.onChange({value: this.lines});
	}

	clear() {
		this.lines.removeAll();
		this.paint();
	}

	undo() {
		this.lines.remove(this.lines.last());
		this.paint();
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
	}

	stopLine() {
		window.removeEventListener('mousemove', this.extendLine);
		window.removeEventListener('mouseup', this.stopLine);
	}

	paint(e) {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.lines.getAll().forEach(line => {
			this._startDrawing(line);
			line.get('points').forEach((point, i) => {
				this._drawLineToPoint(point);
			});
			this._endDrawing();
		});
		if (e) {
			this._drawBrushCursor({x: e.offsetX, y: e.offsetY});
		}
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

	_drawBrushCursor(point) {
		this._setBrushType(this.props.brush);
		this.ctx.beginPath();
		this.ctx.arc(point.x, point.y, this.props.brush.get('size')/2, 0, 2*Math.PI);
		this.ctx.fillStyle = this.props.brush.get('color');
		this.ctx.fill();
		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.lineWidth = 0.5;
		this.ctx.strokeStyle = '#555';
		if (this.props.brush.get('name') == 'eraser') {
			this.ctx.strokeStyle = '#222';
		}
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
			<canvas ref="canvas"></canvas>
		);
	}
}