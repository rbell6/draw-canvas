import React from 'react';
import ReactDOM from 'react-dom';

export default class CursorCanvas extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.resizeCanvas = this.resizeCanvas.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.paint = this.paint.bind(this);
	}

	componentDidMount() {
		this.canvas = this.refs.canvas;
		this.ctx = this.canvas.getContext('2d');
		this.el = ReactDOM.findDOMNode(this);

		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeCanvas);
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	onMouseLeave(e) {
		this.paint();
	}

	paint(point) {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (!point) { return; } // Just clear the canvas if no point is provided

		this._setBrushType(this.props.brush);
		this.ctx.beginPath();
		this.ctx.arc(point.x, point.y, this._brushSize(this.props.brush)/2, 0, 2*Math.PI);
		this.ctx.fillStyle = this.props.brush.color;
		this.ctx.fill();
		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.lineWidth = 0.5;
		this.ctx.strokeStyle = '#555';
		if (this.props.brush.name == 'eraser') {
			this.ctx.strokeStyle = '#222';
		}
		this.ctx.stroke();
	}

	_brushSize(brush) {
		let sizePercent = brush.size.value;
		return window.innerWidth*sizePercent;
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
			<canvas ref="canvas" className="cursor-canvas"></canvas>
		);
	}
}