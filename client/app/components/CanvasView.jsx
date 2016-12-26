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
		this._totalNumPointsToPaint = 0;
		this._lines = [];
		this._aspectRatio = 0;
		this._animationId = null;
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this);
		this.ctx = this.el.getContext('2d');
		window.ctx = this.ctx;
		this._mounted = true;

		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();
	}

	componentWillUnmount() {
		this._mounted = false;
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

	// Call this._animatePaint
	paint(lines=[], opts={}) {
		this._lines = lines;
		this._aspectRatio = opts.aspectRatio || this._aspectRatio;
		// Create a new animationId every time `paint` is called so that any in-progress paint animations
		// will be overriden by this one
		this._animationId = _.uniqueId('canvasAnimation');
		this._animatePaint(this._animationId);
	}

	get _totalNumPoints() {
		return this._lines.reduce((numPoints, line) => numPoints += line.points.length, 0);
	}

	// Determine which lines/points will be painted, then call this._paint
	_animatePaint(animationId) {
		let totalNumPoints = this._totalNumPoints;
		this._setTotalNumPointsToPaint(totalNumPoints);
		let linesToPaint = this._determineLinesToPaint();
		this._paint(linesToPaint, {aspectRatio: this._aspectRatio});
		
		if (totalNumPoints > this._totalNumPointsToPaint) {
			window.requestAnimationFrame(() => {
				if (this._animationId !== animationId) { return; }
				this._animatePaint(animationId);
			});
		}
	}

	_setTotalNumPointsToPaint(totalNumPoints) {
		if (totalNumPoints > this._totalNumPointsToPaint) {
			// Increment by one if we aren't caught up yet
			this._totalNumPointsToPaint++;
		} else if (totalNumPoints < this._totalNumPointsToPaint) {
			// Go back if totalNumPoints is now smaller
			this._totalNumPointsToPaint = totalNumPoints;
		}
	}

	_determineLinesToPaint() {
		let linesToPaint = [];
		let numPointsAdded = 0;
		this._lines.forEach(line => {
			if (numPointsAdded >= this._totalNumPointsToPaint) { return false; }
			let lineCopy = Object.assign({}, line, {points: []});
			line.points.forEach(point => {
				if (numPointsAdded >= this._totalNumPointsToPaint) { return false; }
				lineCopy.points.push(point);
				numPointsAdded++;
			});
			linesToPaint.push(lineCopy);
		});
		return linesToPaint;
	}

	// Do the painting
	_paint(lines=[], opts={}) {
		if (!this._mounted) { return; } 

		// Clear the canvas
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
		opts.aspectRatio = opts.aspectRatio || this.currentAspectRatio();

		lines.forEach((line, testIndex) => {
			this._startDrawing(line, opts.aspectRatio);
			line.points.forEach((point, i) => {
				this._drawLineToPoint(point, opts.aspectRatio);
			});
			this._endDrawing();
		});
		this._mostRecentLines = lines;
		this._mostRecentAspectRatio = opts.aspectRatio;
	}

	_startDrawing(line, aspectRatio) {
		let point = this.percentagePointToPixelPoint(line.points[0], this.currentAspectRatio(), aspectRatio);
		let brush = line.brush;
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