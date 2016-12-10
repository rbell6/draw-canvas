import styles from '../less/shell.less';
import React from 'react';
import classNames from 'classnames';
import {
	browserHistory
} from 'react-router';
import UserIcon from './UserIcon';
import FirstChild from './FirstChild';
import Button from './Button';
import UserService from '../services/UserService';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const menuTransitionTime = 200;

function CloseIcon(props) {
	return (
		<div className="menu-close-icon" onClick={() => props.onClose()}></div>
	);
}

function Menu(props) {
	function onButtonClick(redirect) {
		props.onClose();
		if (redirect) {
			browserHistory.push(redirect);
		}
	}

	return (
		<div className="menu">
			<CloseIcon onClose={() => onButtonClick()} />
			<div className="menu-buttons">
				<Button variant="success" onClick={() => onButtonClick('/game-list')}>Find a game</Button>
				<Button onClick={() => onButtonClick('/create-user')}>Edit profile</Button>
				<Button onClick={() => onButtonClick()} variant="quiet">Back</Button>
			</div>
		</div>
	);
}

export default class Shell extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {showMenu: false};
	}

	onLogoClick() {
		this.setState({showMenu: true});
	}

	onMenuClose() {
		this.setState({showMenu: false});
	}

	render() {
		let user = UserService.get();
		return (
			<div className="shell">
				{this.props.children}
				<ReactCSSTransitionGroup
					component={FirstChild}
					transitionName="menu"
					transitionEnterTimeout={menuTransitionTime}
					transitionLeaveTimeout={menuTransitionTime}>
					{ this.state.showMenu ? <Menu onClose={() => this.onMenuClose()} /> : null }
				</ReactCSSTransitionGroup>
				<img src="/static/img/logo.png" className={classNames('game-logo-small', {'game-logo-clickable': !this.state.showMenu})} onClick={() => this.onLogoClick()} />
			</div>
		);
	}
}