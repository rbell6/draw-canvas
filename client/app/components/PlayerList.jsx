import styles from '../less/player-list.less';
import classNames from 'classnames';
import React from 'react';

export default class PlayerList extends React.Component {
	render() {
		return (
			<div className={classNames('player-list', {'player-list-dark': this.props.dark})}>
				<h2 className="player-list-title">Players ({this.props.players.length})</h2>
				{this.props.players.map(player => (
					<div className="player-list-player" key={player.id}>
						<i className="player-list-player-avatar fa fa-user" />
						<div className="player-list-player-name">{player.name}</div>
					</div>
				))}
			</div>
		);
	}
}