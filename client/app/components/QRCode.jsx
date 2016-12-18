import React from 'react';
import QRious from '../services/QRCodeService';

class QRCode extends React.Component {
	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this);
		this.createQRCode();
	}

	createQRCode() {
		this._qr = new QRious({
			element: this.el,
			value: this.props.text,
			background: '#e4e4e4',
			size: 75,
			foreground: '#222'
		});
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<canvas className="qr-code"></canvas>
		);
	}
}