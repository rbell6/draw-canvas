import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class CanvasView extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.paint = this.paint.bind(this);
		this.resizeCanvas = _.debounce(this.resizeCanvas.bind(this), 200);
		this._mostRecentLines = null;
		this._mostRecentAspectRatio = null;
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

	percentagePointToPixelPoint(point, newAspectRatio, oldAspectRatio) {
		let x = point.x;
		let y = point.y;
		if (newAspectRatio > oldAspectRatio) {
			// Adjust X
			let xSquashFactor = oldAspectRatio/newAspectRatio;
			x = ((1-xSquashFactor)/2)+(point.x*xSquashFactor);
		} else if (oldAspectRatio > newAspectRatio) {
			// Adjust Y
			let ySquashFactor = newAspectRatio/oldAspectRatio;
			y = ((1-ySquashFactor)/2)+(point.y*ySquashFactor);
		}
		return {
			x: x*window.innerWidth,
			y: y*window.innerHeight
		};
	}

	currentAspectRatio() {
		return window.innerWidth/window.innerHeight;
	}

	resizeCanvas() {
		this.el.width = window.innerWidth;
		this.el.height = window.innerHeight;
		if (this._mostRecentLines) {
			this.paint(this._mostRecentLines, {aspectRatio: this._mostRecentAspectRatio});
		}
	}

	paint(lines=[], opts={}) {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
		opts.aspectRatio = opts.aspectRatio || this.currentAspectRatio();

		lines.forEach((line, testIndex) => {
			this._startDrawing(line, opts.aspectRatio);
			line.get('points').forEach((point, i) => {
				this._drawLineToPoint(point, opts.aspectRatio);
			});
			this._endDrawing();
		});
		this._mostRecentLines = lines;
		this._mostRecentAspectRatio = opts.aspectRatio;
	}

	_startDrawing(line, aspectRatio) {
		let point = this.percentagePointToPixelPoint(line.startingPoint(), this.currentAspectRatio(), aspectRatio);
		let brush = line.get('brush');
		this._setBrushType(brush);
		this.ctx.beginPath();
		this.ctx.lineWidth = this._brushSize(brush, aspectRatio);
		this.ctx.strokeStyle = brush.color;
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.moveTo(point.x, point.y);
	}

	_brushSize(brush, aspectRatio) {
		let xSquashFactor = aspectRatio/this.currentAspectRatio();
		let sizePercent = brush.size.value;
		let size = window.innerWidth*sizePercent;
		if (xSquashFactor<1) {
			size = size*xSquashFactor;
		}
		return size;
	}

	_drawLineToPoint(point, aspectRatio) {
		point = this.percentagePointToPixelPoint(point, this.currentAspectRatio(), aspectRatio);
		this.ctx.lineTo(point.x, point.y);
	}

	_endDrawing() {
		this.ctx.stroke();
	}

	_setBrushType(brush) {
		if (brush.name == 'eraser') {
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