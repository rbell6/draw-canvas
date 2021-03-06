import styles from '../less/canvas.less';
import React from 'react';
import CursorCanvas from './CursorCanvas';
import CanvasView from './CanvasView';
import _ from 'lodash';
const onChangeIntervalTime = 500;

export default class Canvas extends React.Component {
	constructor(props, context) {
		super(props, context);

		// Bind methods that we'll need to add/remove event listeners
		this.onChange = this.onChange.bind(this);
		this.startLine = this.startLine.bind(this);
		this.extendLine = this.extendLine.bind(this);
		this.updateLinesOnAspectRatioChange = _.debounce(this.updateLinesOnAspectRatioChange.bind(this), 200);

		this.lines = [];
		this._curLine = null;
		this._debouncedFireOnChangeCallback = _.debounce(this._fireOnChangeCallback, onChangeIntervalTime, {maxWait: onChangeIntervalTime});
	}

	static get defaultProps() {
		return {
			brush: null,
			onChange: function(){}
		};
	}

	componentDidMount() {
		this._mostRecentAspectRatio = this.refs.canvas.currentAspectRatio();
		window.addEventListener('resize', this.updateLinesOnAspectRatioChange, false);

		// TESTING
		// this.lines.add(Line.fromJSON({
		// 	points: [{
		// 		x: 0.2,
		// 		y: 0.2
		// 	}, {
		// 		x: 0.8,
		// 		y: 0.2
		// 	}, {
		// 		x: 0.8,
		// 		y: 0.8
		// 	}, {
		// 		x: 0.2,
		// 		y: 0.8
		// 	}, {
		// 		x: 0.2,
		// 		y: 0.2
		// 	}],
		// 	brush: {}
		// }))
		// this.paint(this.lines);
	}

	componentWillUnmount() {
		// We need to manually remove the mouse observer since we reparented it
		window.removeEventListener('resize', this.updateLinesOnAspectRatioChange);
	}

	pixelPointToPercentagePoint(point) {
		return {
			x: point.x/window.innerWidth,
			y: point.y/window.innerHeight
		};
	}

	get canvas() {
		return this.refs.canvas;
	}

	onChange() {
		this._debouncedFireOnChangeCallback();
		this.paint(this.lines);
	}

	_fireOnChangeCallback() {
		if (!this.refs.canvas) { return; }
		this.props.onChange({
			lines: this.lines,
			aspectRatio: this.refs.canvas.currentAspectRatio()
		});
	}

	paint(lines) {
		this.canvas.paint(lines);
	}

	clear() {
		this.lines.length = 0;
		this.onChange();
	}

	undo() {
		this.lines.splice(this.lines.length-1, 1);
		this.onChange();
	}

	startLine(point) {
		this._curLine = {
			brush: this.props.brush,
			points: []
		};
		this.lines.push(this._curLine);
		this.addPointToLine(point);
	}

	extendLine(point) {
		this.addPointToLine(point);
	}

	addPointToLine(point) {
		this._curLine.points.push(this.pixelPointToPercentagePoint(point));
		this.onChange();
	}

	updateLinesOnAspectRatioChange() {
		let currentAspectRatio = this.refs.canvas.currentAspectRatio();
		this.lines.forEach(line => {
			line.points.forEach(point => this.convertPointToNewAspectRatio(point, currentAspectRatio, this._mostRecentAspectRatio));
		});
		this._mostRecentAspectRatio = this.refs.canvas.currentAspectRatio();
		this.onChange();
	}

	convertPointToNewAspectRatio(point, newAspectRatio, oldAspectRatio) {
		let x = point.x;
		let y = point.y;
		if (newAspectRatio > oldAspectRatio) {
			// Adjust X
			let xSquashFactor = oldAspectRatio/newAspectRatio;
			point.x = ((1-xSquashFactor)/2)+(point.x*xSquashFactor);
		} else if (oldAspectRatio > newAspectRatio) {
			// Adjust Y
			let ySquashFactor = newAspectRatio/oldAspectRatio;
			point.y = ((1-ySquashFactor)/2)+(point.y*ySquashFactor);
		}
	}

	render() {
		return (
			<div className="canvas-wrap">
				<CursorCanvas ref="cursorCanvas" brush={this.props.brush} />
				<CanvasView ref="canvas" />
			</div>
		);
	}
}