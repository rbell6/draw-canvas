import React from 'react';
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
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import ActiveRoundService from '../services/ActiveRoundService';

export default class GameStagePage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this._leaveGame = this._leaveGame.bind(this);
		this._startGame = this._startGame.bind(this);
		this._onGameChange = this._onGameChange.bind(this);
		this._onRoundsChange = this._onRoundsChange.bind(this);
		this._endGame = this._endGame.bind(this);
	}

	componentDidMount() {
		GameService.getById(this.props.params.id).then(game => {
			if (!game) {
				browserHistory.push('/game-list');
				return;
			}
			if (game.activeRound) {
				this._startGame(game);
				return;
			}
			this.setState({
				game: game
			});
			GameService.joinGame(game);
			this.activeRoundService = new ActiveRoundService(game);
			this.activeRoundService.getRounds();
			this.activeRoundService.on('endGame', this._endGame);
			game.on('change:rounds', this._onRoundsChange);
		});
		GameService.on('change:game', this._onGameChange);
		GameService.on('leaveGame', this._leaveGame);
		GameService.on('startGame', this._startGame);
	}

	componentWillUnmount() {
		if (this.state.game) {
			this.state.game.off('change:rounds', this._onRoundsChange);
		}
		if (this.activeRoundService) {
			this.activeRoundService.off('endGame', this._endGame);
			this.activeRoundService.destroy();
		}
		GameService.off('change:game', this._onGameChange);
		GameService.off('leaveGame', this._leaveGame);
		GameService.off('startGame', this._startGame);
	}

	_onGameChange(e) {
		this.setState({
			game: e.data
		});
	}

	_onRoundsChange(e) {
		if (this.state.game && this.state.game.activeRound) {
			this._startGame();
		}
	}

	_leaveGame() {
		browserHistory.push('/game-list');
	}

	_startGame(game) {
		let _game = game || this.state.game;
		if (_game) {
			browserHistory.push(`/game/${_game.id}`);
		}
	}

	_endGame() {
		browserHistory.push('/game-list');
	}

	onNameChange(name) {
		GameService.updateGameName(this.state.game, name);
	}

	cancel() {
		if (this.state.game.userIsHost(UserService.get())) {
			GameService.delete(this.state.game);
		}
		GameService.leaveGame(this.state.game).then(() => this._leaveGame());
	}

	start() {
		GameService.startGame(this.state.game);
	}

	userIsHost() {
		return this.state.game.userIsHost(UserService.get());
	}

	render() {
		return (
			<div className="game-stage-page">
				{this.state.game ?
					<div className="game-stage-container">
						{ this.userIsHost() ?
							<TextField 
								placeholder="Game Name"
								value={this.state.game.get('name')} 
								onChange={e => this.onNameChange(e.target.value)} />
							:
							<H1 className="game-stage-header">{this.state.game.get('name')}</H1>
						}
						<div className="game-users-container">
							<H3>Players</H3>
							<div className="game-users">
								{this.state.game.get('users').map(user => <UserIcon user={user} key={user.id} />) }
							</div>
						</div>
						{/*<TextField 
							placeholder="Say something ..." />*/}
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