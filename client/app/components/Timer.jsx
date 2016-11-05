import React from 'react';
import util from '../../../models/util';
import classNames from 'classnames';

export default class Timer extends React.Component {
	componentDidMount() {
		this.ctx = this.canvas.getContext('2d');
		this.initialize();
	}

	static get defaultProps() {
		return {
			size: 100, // px
			time: 60000 // ms
		};
	}

	shouldComponentUpdate() {
		return false;
	}

	start(percentOfTimeInitiallySpent=0) {
		this._startTime = null;
		this._percentOfTimeInitiallySpent = percentOfTimeInitiallySpent;
		this.paint();
	}

	get canvas() {
		return this.refs.canvas;
	}

	get size() {
		return this.props.size*2;
	}

	get time() {
		return this.props.time;
	}

	initialize() {
		this.canvas.width = this.size;
		this.canvas.height = this.size;
		this.canvas.style.width = this.size/2 + 'px';
		this.canvas.style.height = this.size/2 + 'px';
		this._percentOfTimeInitiallySpent = 0;
		this.drawBackgroundRing();
	}

	percentToDegrees(percent) { // 0 <= percent <= 1
		return percent*360;
	}

	degreesToRadians(degrees) {
		return degrees*Math.PI/180;
	}

	createArc(startAngle, endAngle, clip=false) {
		let x = this.size/2;
		let y = this.size/2;
		let radius = clip ? this.size/2 : this.size/3;
		this.ctx.arc(x, y, radius, startAngle, endAngle, clip);
	}

	drawBackgroundRing() {
		this.ctx.beginPath();
		this.createArc(Math.PI*2, 0);
		this.createArc(0, Math.PI*2, true);
		this.ctx.fillStyle = '#696969';
		this.ctx.fill();
	}

	drawForegroundRing(radians) {
		this.ctx.beginPath();
		this.ctx.arc(this.size/2,this.size/2,this.size/2,radians,0, false); // outer (filled)
		this.ctx.arc(this.size/2,this.size/2,this.size/3,0,radians, true); // inner (unfills it)
		this.ctx.fillStyle = util.colors.BLUE;
		this.ctx.fill();
	}

	paint() {
		requestAnimationFrame(timestamp => {
			if (!this.canvas) { return; }
			this._startTime = this._startTime || timestamp;
			let deltaTime = timestamp-this._startTime;
			let percentComplete = Math.min((deltaTime/this.time)+this._percentOfTimeInitiallySpent, 1);
			let startingDegrees = this.percentToDegrees(percentComplete);
			let startingRadians = this.degreesToRadians(startingDegrees);
			
			// Clear the canvas
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawBackgroundRing();
			if (percentComplete < 1) {
				this.drawForegroundRing(startingRadians);
				// Call paint again
				this.paint();
			}
		});
	}

	render() {
		return (
			<canvas ref="canvas" className={classNames(this.props.className, 'timer')}></canvas>
		);
	}
}