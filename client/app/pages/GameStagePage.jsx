import styles from '../less/game-stage-page.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Link,
	browserHistory
} from 'react-router';
import Game from '../../../models/Game';
import TextField from '../components/TextField';
import Button from '../components/Button';
import {
	H1,
	H3 
} from '../components/Headers';
import UserIcon from '../components/UserIcon';
import QRCode from '../components/QRCode';
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import ActiveRoundService from '../services/ActiveRoundService';
import LocationService from '../services/LocationService';
import {
	connect
} from 'react-redux';
import {
	streamGame,
	joinGame,
	cancelGame,
	unstreamGame,
	startGame
} from '../actions/GameActions';
import _ from 'lodash';

class GameStagePage extends React.Component {
	static mapStateToProps(state) {
		return {
			game: state.game,
			user: state.user,
			userList: state.userList,
			socket: state.socket
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			streamGame: (socket, id) => dispatch(streamGame(socket, id)),
			unstreamGame: (socket, id) => dispatch(unstreamGame(socket, id)),
			joinGame: id => dispatch(joinGame(id)),
			cancelGame: id => dispatch(cancelGame(id)),
			startGame: id => dispatch(startGame(id))
		};
	}

	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.leaveGame = this.leaveGame.bind(this);
		this.startGame = this.startGame.bind(this);
		// this.onGameChange = this.onGameChange.bind(this);
		// this.onRoundsChange = this.onRoundsChange.bind(this);
	}

	componentDidMount() {
		this.getMobileLinkId()
			.then(() => this.props.streamGame(this.props.socket, this.props.params.id))
			.then(() => this.props.joinGame(this.props.params.id));
	}

	componentWillUnmount() {
		this.props.unstreamGame(this.props.socket, this.props.game.id);

		if (this.state.game) {
			this.state.game.off('change:rounds', this.onRoundsChange);
		}
		if (this.activeRoundService) {
			this.activeRoundService.off('endGame', this.leaveGame);
			this.activeRoundService.destroy();
		}
	}

	componentWillReceiveProps(props) {
		if (_.get(props.game, 'isCanceled')) {
			this.leaveGame();
		}
		if (_.get(props.game, 'isStarted')) {
			this.startGame();
		}
	}

	getMobileLinkId() {
		return UserService.getMobileLinkId().then(mobileLinkId => this.mobileLinkId = mobileLinkId);
	}

	// getGame() {
	// 	GameService.getById(this.props.params.id).then(game => {
	// 		if (!game) {
	// 			this.leaveGame();
	// 			return;
	// 		}
	// 		if (LocationService.previousPath === `/game/${game.id}`) {
	// 			this.leaveGame();
	// 			return;
	// 		}
	// 		this.setState({
	// 			game: game,
	// 			gameName: game.get('name')
	// 		});
	// 		if (game.activeRound) {
	// 			this.startGame();
	// 			return;
	// 		}
	// 		GameService.joinGame(game);
	// 		this.activeRoundService = new ActiveRoundService(game);
	// 		this.activeRoundService.getRounds();
	// 		this.activeRoundService.on('endGame', this.leaveGame);
	// 		game.on('change:rounds', this.onRoundsChange);
	// 	});
	// }

	// onGameChange(e) {
	// 	let game = e.data;
	// 	this.setState({
	// 		game: game,
	// 		gameName: game.get('name')
	// 	});
	// }

	// onRoundsChange(e) {
	// 	if (this.state.game && this.state.game.activeRound) {
	// 		this.startGame();
	// 	}
	// }

	leaveGame() {
		browserHistory.push('/game-list');
	}

	startGame() {
		if (this.props.game) {
			browserHistory.push(`/game/${this.props.game.id}`);
		}
	}

	// onNameChange(name) {
	// 	GameService.updateGameName(this.state.game, name);
	// }

	cancel() {
		if (this.userIsHost()) {
			this.props.cancelGame(this.props.game.id);
		} else {
			this.leaveGame();
		}


		// GameService.leaveGame(this.state.game)
		// 	.then(() => {
		// 		if (this.state.game.userIsHost(UserService.get())) {
		// 			return GameService.delete(this.state.game);
		// 		}
		// 	})
		// 	.then(() => this.leaveGame());
	}

	start() {
		this.props.startGame(this.props.game.id);
		// GameService.startGame(this.state.game);
	}

	userIsHost() {
		return this.props.user.id === this.props.game.hostId;
	}

	get mobileUrl() {
		return `${window.location.origin}/m/${this.mobileLinkId}`;
	}
	
	render() {
		return (
			<div className="game-stage-page">
				{this.props.game.id ?
					<div className="game-stage-container">
						{ this.userIsHost() ?
							<TextField 
								placeholder="Game Name"
								value={this.props.game.name} 
								onChange={e => this.setState({gameName: e.target.value})}
								onBlur={e => this.onNameChange(e.target.value)} />
							:
							<H1 className="game-stage-header">{this.props.game.name}</H1>
						}
						<div className="mobile-link">
							<i className="fa fa-mobile mobile-icon" />
							<div className="mobile-link-text">
								<h3>Draw using your mobile device!</h3>
								<p>{this.mobileUrl}</p>
							</div>
							<QRCode text={this.mobileUrl} />
						</div>
						<div className="game-users-container">
							<H3>Players</H3>
							<div className="game-users">
								{this.props.game.userIds.map(userId => {
									let user = this.props.userList.find(u => u.id === userId);
									if (user) {
										return <UserIcon user={user} key={userId} />
									}
									return null;
								}) }
							</div>
						</div>
						<div className="buttons">
							<Button onClick={() => this.cancel()} variant="quiet">Cancel</Button>
							{this.userIsHost() ? <Button onClick={() => this.start()} variant="success">Start game</Button> : null}
						</div>

					</div>
					:
					<div className="app-loading"><div className="spinner"><i className="fa fa-cog fa-spin" /></div></div>
				}
			</div>
		);
	}
}

export default connect(GameStagePage.mapStateToProps, GameStagePage.mapDispatchToProps)(GameStagePage);
