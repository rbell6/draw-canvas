import styles from '../less/draw-page.less';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Canvas from '../components/Canvas';
import MouseObserver from '../components/MouseObserver';
import BrushPalette from '../components/BrushPalette';
import FirstChild from '../components/FirstChild';
import Modal from '../components/Modal';
import Menu from '../components/Menu';
import HotkeyService from '../services/HotkeyService';
import Brush from '../../../models/Brush';
import _ from 'lodash';
import { 
	browserHistory
} from 'react-router';
import {
	connect
} from 'react-redux';

class DrawPage extends React.Component {
	static mapStateToProps(state) {
		return {
			brush: state.brush
		};
	}

	static mapDispatchToProps(dispatch) {
		return {};
	}

	constructor(props, context) {
		super(props, context);
		this.onUndo = this.onUndo.bind(this);
	}

	componentDidMount() {
		HotkeyService.on('undo', this.onUndo);
	}

	componentWillUnmount() {
		HotkeyService.off('undo', this.onUndo);
	}

	onTrash() {
		this.refs.canvas.clear();
	}

	onUndo() {
		this.refs.canvas.undo();
	}

	onCanvasChange() {

	}

	onLogoClick() {
		Modal.show(<Menu />);
	}

	render() {
		return (
			<div className="draw-page">
				<Canvas brush={this.props.brush} onChange={e => this.onCanvasChange(e)} ref="canvas" />
				<MouseObserver 
					onMouseDown={point => this.refs.canvas.startLine(point)} 
					onMouseDownMove={point => this.refs.canvas.extendLine(point)} 
					onMouseMove={point => {
						if (!this.refs.canvas) { return; }
						this.refs.canvas.refs.cursorCanvas.paint(point);
					}}
					onMouseLeave={() => this.refs.canvas.refs.cursorCanvas.paint()} />
				<BrushPalette 
					onUndo={() => this.onUndo()}
					onTrash={() => this.onTrash()} />
				<img src="/static/img/logo.png" className="game-page-logo" onClick={() => this.onLogoClick()} /> 
			</div>
		);
	}
}

export default connect(DrawPage.mapStateToProps, DrawPage.mapDispatchToProps)(DrawPage);
