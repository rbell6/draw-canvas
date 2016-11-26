import styles from '../less/mouse-observer.less';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class MouseObserver extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.mouseIsDown = false;
	}

	static get defaultProps() {
		return {
			onMouseDown:     function(){},
			onMouseUp:       function(){},
			onMouseMove:     function(){},
			onMouseDownMove: function(){},
			onMouseLeave:    function(){}
		};
	}

	componentDidMount(props) {
		this.el = ReactDOM.findDOMNode(this);
		this.el.addEventListener('mousedown', this.onMouseDown);
		this.el.addEventListener('touchstart', this.onMouseDown);
		this.el.addEventListener('mousemove', this.onMouseMove);
		this.el.addEventListener('touchmove', this.onMouseMove);
		this.el.addEventListener('mouseup', this.onMouseUp);
		this.el.addEventListener('touchend', this.onMouseUp);
		this.el.addEventListener('mouseleave', this.onMouseLeave);
	}

	componentWillUnmount() {
		this.el.removeEventListener('mousedown', this.onMouseDown);
		this.el.removeEventListener('touchstart', this.onMouseDown);
		this.el.removeEventListener('mousemove', this.onMouseMove);
		this.el.removeEventListener('touchmove', this.onMouseMove);
		this.el.removeEventListener('mouseup', this.onMouseUp);
		this.el.removeEventListener('touchend', this.onMouseUp);
		this.el.removeEventListener('mouseleave', this.onMouseLeave);
		this.moveBack();
	}

	pointFromEvent(event) {
		if (event instanceof window.TouchEvent) {
			return {
				x: _.get(event, 'touches[0].clientX'),
				y: _.get(event, 'touches[0].clientY')
			};
		}
		return {
			x: event.clientX,
			y: event.clientY
		};
	}

	onMouseDown(e) {
		this.mouseIsDown = true;
		this.moveToTop();
		this.disableSelection();
		this.props.onMouseDown(this.pointFromEvent(e));
	}

	onMouseMove(e) {
		if (e instanceof window.TouchEvent) {
			e.preventDefault();
		}
		this.props.onMouseMove(this.pointFromEvent(e));
		if (this.mouseIsDown) {
			this.props.onMouseDownMove(this.pointFromEvent(e));
		}
	}

	onMouseUp(e) {
		this.mouseIsDown = false;
		this.moveBack();
		this.enableSelection();
		this.props.onMouseUp(this.pointFromEvent(e));

		if (e instanceof window.TouchEvent) {
			this.onMouseLeave(e);
		}
	}

	onMouseLeave(e) {
		this.props.onMouseLeave({
			x: e.offsetX,
			y: e.offsetY
		});
	}

	moveToTop() {
		this.el.style.zIndex = 1;
	}

	moveBack() {
		this.el.style.zIndex = '';
	}

	disableSelection() {
		document.body.classList.add('disable-selection');
	}

	enableSelection() {
		document.body.classList.remove('disable-selection');
	}

	render() {
		return (
			<div className="mouse-observer"></div>
		);
	}
}