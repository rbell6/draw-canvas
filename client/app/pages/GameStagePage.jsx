import React from 'react';
import {
	Link,
	browserHistory
} from 'react-router';
import Game from '../../../models/Game';
import TextField from '../components/TextField';
import Button from '../components/Button';
import {
	H3 
} from '../components/Headers';
import UserIcon from '../components/UserIcon';
import UserService from '../services/UserService';
import GameService from '../services/GameService';

export default class GameStagePage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this._leaveGame = this._leaveGame.bind(this);
		this._onGameChange = this._onGameChange.bind(this);
	}

	componentDidMount() {
		GameService.getById(this.props.params.id).then(game => {
			if (!game) {
				browserHistory.push('/game-list');
				return;
			}
			this.setState({
				game: game
			});
			GameService.joinGame(game);
		});
		GameService.on('change:game', this._onGameChange);
		GameService.on('leaveGame', this._leaveGame);
	}

	componentWillUnmount() {
		GameService.off('change:game', this._onGameChange);
		GameService.off('leaveGame', this._leaveGame);
	}

	_onGameChange(e) {
		this.setState({
			game: e.data
		});
	}

	_leaveGame() {
		browserHistory.push('/game-list');
	}

	onNameChange(name) {
		GameService.updateGameName(this.state.game, name);
	}

	cancel() {
		if (this.state.game.get('host').id === UserService.get().id) {
			GameService.delete(this.state.game);
		}
		GameService.leaveGame(this.state.game).then(() => this._leaveGame());
	}

	start() {
		browserHistory.push(`/game/${this.state.game.id}`);
	}

	render() {
		return (
			<div className="game-stage-page">
				{this.state.game ?
					<div className="game-stage-container">
						<TextField 
							placeholder="Game Name"
							value={this.state.game.get('name')} 
							onChange={e => this.onNameChange(e.target.value)} />
						<div className="game-users-container">
							<H3>Players</H3>
							<div className="game-users">
								{this.state.game.get('users').map(user => <UserIcon user={user} key={user.id} />) }
							</div>
						</div>
						{/*<TextField 
							placeholder="Say something ..." />*/}
						<div className="buttons">
							<Button onClick={() => this.cancel()}>Cancel</Button>
							<Button onClick={() => this.start()} variant="success">Start game</Button>
						</div>
					</div>
					:
					<div className="app-loading"><div className="spinner"><i className="fa fa-cog fa-spin" /></div></div>
				}
			</div>
		);
	}
}