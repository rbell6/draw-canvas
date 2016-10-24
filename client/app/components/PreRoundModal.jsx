import React from 'react';
import UserService from '../services/UserService';

export default class PreRoundModal extends React.Component {
	drawerIsMe() {
		if (!this.props.game.activeRound) { return false; }
		return UserService.get().id === this.props.game.activeRound.get('drawer').id;
	}

	render() {
		return (
			<div className="pre-round-modal">
				<div className="pre-round-modal-container">
					<div className="round-label">{this.props.game.activeRoundName}</div>
					<div className="drawer-label"><i className="fa fa-paint-brush drawer-icon" /> {this.props.game.activeRoundDrawerName}{this.drawerIsMe() ? ` - Draw the word "${this.props.game.activeRound.get('word')}"` : null}</div>
				</div>
			</div>
		);
	}
}