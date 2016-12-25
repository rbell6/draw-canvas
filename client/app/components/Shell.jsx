import styles from '../less/shell.less';
import React from 'react';
import classNames from 'classnames';
import UserIcon from './UserIcon';
import FirstChild from './FirstChild';
import Modal from './Modal';
import Menu from './Menu';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const modalTransitionTime = 200;

export default class Shell extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {showMenu: false, modal: null};
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		document.body.addEventListener('showModal', this.showModal);
		document.body.addEventListener('closeModal', this.closeModal);
	}

	componentWillUnmount() {
		document.body.removeEventListener('showModal', this.showModal);
		document.body.removeEventListener('closeModal', this.closeModal);
	}

	showModal(e) {
		this.setState({modal: e.detail});
	}

	closeModal() {
		this.setState({modal: null});
	}

	onLogoClick() {
		if (!this.state.modal) {
			Modal.show(<Menu />);
		}
	}

	render() {
		return (
			<div className="shell">
				{this.props.children}
				<ReactCSSTransitionGroup
					component={FirstChild}
					transitionName="modal"
					transitionEnterTimeout={modalTransitionTime}
					transitionLeaveTimeout={modalTransitionTime}>
					{ this.state.modal ? <Modal onClose={() => this.onModalClose()}>{this.state.modal}</Modal> : null }
				</ReactCSSTransitionGroup>
				<img src="/static/img/logo.png" className={classNames('game-logo-small', {'game-logo-clickable': !this.state.modal})} onClick={() => this.onLogoClick()} />
			</div>
		);
	}
}