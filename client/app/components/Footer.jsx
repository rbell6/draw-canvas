import styles from '../less/footer.less';
import classNames from 'classnames';
import React from 'react';
import Modal from './Modal';
import Menu from './Menu';

export default class Footer extends React.Component {
	static get defaultProps() {
		return {
			showLogo: true
		};
	}

	onLogoClick() {
		Modal.show(<Menu />);
	}

	render() {
		return (
			<div className={classNames('footer', {'footer-dark': this.props.dark})}>
				{this.props.showLogo ? 
					<img src="/static/img/logo.png" className="footer-logo" onClick={() => this.onLogoClick()} /> 
					: 
					null
				}
				<div className="footer-contents">
					{this.props.children}
				</div>
			</div>
		);
	}
}