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
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import ActiveRoundService from '../services/ActiveRoundService';
import LocationService from '../services/LocationService';
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
			foreground: '#a76da7'
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

export default class GameStagePage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.leaveGame = this.leaveGame.bind(this);
		this.startGame = this.startGame.bind(this);
		this.onGameChange = this.onGameChange.bind(this);
		this.onRoundsChange = this.onRoundsChange.bind(this);
	}

	componentDidMount() {
		GameService.getById(this.props.params.id).then(game => {
			if (!game) {
				this.leaveGame();
				return;
			}
			if (LocationService.previousPath === `/game/${game.id}`) {
				this.leaveGame();
				return;
			}
			this.setState({
				game: game,
				gameName: game.get('name')
			});
			if (game.activeRound) {
				this.startGame();
				return;
			}
			GameService.joinGame(game);
			this.activeRoundService = new ActiveRoundService(game);
			this.activeRoundService.getRounds();
			this.activeRoundService.on('endGame', this.leaveGame);
			game.on('change:rounds', this.onRoundsChange);
		});
		GameService.on('change:game', this.onGameChange);
		GameService.on('leaveGame', this.leaveGame);
		GameService.on('startGame', this.startGame);
	}

	componentWillUnmount() {
		if (this.state.game) {
			this.state.game.off('change:rounds', this.onRoundsChange);
		}
		if (this.activeRoundService) {
			this.activeRoundService.off('endGame', this.leaveGame);
			this.activeRoundService.destroy();
		}
		GameService.off('change:game', this.onGameChange);
		GameService.off('leaveGame', this.leaveGame);
		GameService.off('startGame', this.startGame);
	}

	onGameChange(e) {
		let game = e.data;
		this.setState({
			game: game,
			gameName: game.get('name')
		});
	}

	onRoundsChange(e) {
		if (this.state.game && this.state.game.activeRound) {
			this.startGame();
		}
	}

	leaveGame() {
		browserHistory.push('/game-list');
	}

	startGame() {
		if (this.state.game) {
			browserHistory.push(`/game/${this.state.game.id}`);
		}
	}

	onNameChange(name) {
		GameService.updateGameName(this.state.game, name);
	}

	cancel() {
		GameService.leaveGame(this.state.game)
			.then(() => {
				if (this.state.game.userIsHost(UserService.get())) {
					return GameService.delete(this.state.game);
				}
			})
			.then(() => this.leaveGame());
	}

	start() {
		GameService.startGame(this.state.game);
	}

	userIsHost() {
		return this.state.game.userIsHost(UserService.get());
	}

	get mobileUrl() {
		return `https://www.draw.guru/m/${UserService.get().id}`;
	}
	
	render() {
		return (
			<div className="game-stage-page">
				{this.state.game ?
					<div className="game-stage-container">
						{ this.userIsHost() ?
							<TextField 
								placeholder="Game Name"
								value={this.state.gameName} 
								onChange={e => this.setState({gameName: e.target.value})}
								onBlur={e => this.onNameChange(e.target.value)} />
							:
							<H1 className="game-stage-header">{this.state.game.get('name')}</H1>
						}
						<div className="game-users-container">
							<H3>Players</H3>
							<div className="game-users">
								{this.state.game.get('users').map(user => <UserIcon user={user} key={user.id} />) }
							</div>
						</div>
						<div className="mobile-link">
							<i className="fa fa-mobile mobile-icon" />
							<div className="mobile-link-text">
								<h3>Draw using your mobile device!</h3>
								<p>{this.mobileUrl}</p>
							</div>
							<QRCode text={this.mobileUrl} />
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