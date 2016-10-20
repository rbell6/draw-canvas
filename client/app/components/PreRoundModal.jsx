import React from 'react';

export default class PreRoundModal extends React.Component {
	render() {
		return (
			<div className="pre-round-modal">
				<div className="pre-round-modal-container">
					<div className="round-label">{this.props.game.activeRoundName}</div>
					<div className="drawer-label"><i className="fa fa-paint-brush drawer-icon" /> {this.props.game.activeRoundDrawerName}</div>
				</div>
			</div>
		);
	}
}