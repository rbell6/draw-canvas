import React from 'react';
import Line from '../../../models/Line';
import LineCollection from '../../../models/LineCollection';
import Brush from '../../../models/Brush';

export default class ViewOnlyCanvas extends React.Component {
	constructor(props, context) {
		super(props, context);

		// Bind methods that we'll need to add/remove event listeners
		this.resizeCanvas = this.resizeCanvas.bind(this);
		this.paint = this.paint.bind(this);

		this.lines = new LineCollection();
		this._curLine = null;
	}

	static get defaultProps() {
		return {
			brush: new Brush(),
			socket: null
		};
	}

	componentDidMount() {
		this.canvas = this.refs.canvas;
		this.ctx = this.canvas.getContext('2d');
		window.ctx = this.ctx;

		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();

		this.props.socket.on('draw', linesJSON => {
			this.lines = LineCollection.fromJSON(linesJSON);
			this.paint();
		});
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
			<canvas ref="canvas" className="view-only canvas"></canvas>
		);
	}
}