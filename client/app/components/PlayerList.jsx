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

	render() {
		return (
			<div className="player-list">
				<h2 className="player-list-title">Players ({this.props.userList.length})</h2>
				{this.props.userList.map(user => (
					<div className="player-list-player" key={user.id}>
						<i className="player-list-player-avatar fa fa-user" />
						<div className="player-list-player-name">{user.name}</div>
					</div>
				))}
			</div>
		);
	}
}

export default connect(PlayerList.mapStateToProps, PlayerList.mapDispatchToProps)(PlayerList);
