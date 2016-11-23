import React from 'react';
import ReactDOM from 'react-dom';

export default class CanvasView extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.paint = this.paint.bind(this);
		this.resizeCanvas = this.resizeCanvas.bind(this);
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this);
		this.ctx = this.el.getContext('2d');
		window.ctx = this.ctx;

		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeCanvas);
	}

	shouldComponentUpdate() {
		// We don't want to use react to re-render this because we are using a <canvas>
		return false;
	}

	resizeCanvas() {
		this.el.width = window.innerWidth;
		this.el.height = window.innerHeight;
		if (this._mostRecentLines) {
			this.paint(this._mostRecentLines);
		}
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
		this._mostRecentLines = lines;
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