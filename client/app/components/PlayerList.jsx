import styles from '../less/player-list.less';
import classNames from 'classnames';
import React from 'react';
import {
	connect
} from 'react-redux';

class PlayerList extends React.Component {
	static mapStateToProps(state) {
		return {
			userList: state.userList
		};
	}

	static mapDispatchToProps(dispatch) {
		return {};
	}

	userForId(id) {
		return this.props.userList.find(u => u.id === id);
	}

	render() {
		return (
			<div className={classNames('player-list', {'player-list-dark': this.props.dark})}>
				<h2 className="player-list-title">Players ({this.props.game.userIds.length})</h2>
				{this.props.game.userIds.map(userId => (
					<div className="player-list-player" key={userId}>
						<i className="player-list-player-avatar fa fa-user" />
						<div className="player-list-player-name">{_.get(this.userForId(userId), 'name', '')}</div>
					</div>
				))}
			</div>
		);
	}
}

export default connect(PlayerList.mapStateToProps, PlayerList.mapDispatchToProps)(PlayerList);
