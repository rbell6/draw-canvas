import styles from '../less/footer.less';
import classNames from 'classnames';
import React from 'react';
import Modal from './Modal';
import Menu from './Menu';

export default class Footer extends React.Component {
	onLogoClick() {
		Modal.show(<Menu />);
	}

	render() {
		return (
			<div className="footer">
				<img src="/static/img/logo.png" className="footer-logo" onClick={() => this.onLogoClick()} />
				<div className="footer-contents">
					{this.props.children}
				</div>
			</div>
		);
	}
}