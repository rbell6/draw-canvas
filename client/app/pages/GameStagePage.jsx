import React from 'react';
import {
	Link,
	browserHistory
} from 'react-router';
import Game from '../models/Game';
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
		this.state = {
			game: GameService.getById(props.params.id)
		};
	}

	componentDidMount() {
		if (!this.state.game) {
			browserHistory.push('/game-list');
		}
	}

	onNameChange(name) {
		this.state.game.set('name', name);
		this.forceUpdate();
	}

	render() {
		return (
			<div className="create-game-page">
				<div className="create-game-container">
					<TextField 
						placeholder="Game Name"
						value={this.state.game.get('name')} 
						onChange={e => this.onNameChange(e.target.value)} />
					<div className="game-users-container">
						<H3>Players</H3>
						<div className="game-users">
							<UserIcon />
							<UserIcon />
							<UserIcon />
							<UserIcon />
							<UserIcon />
						</div>
					</div>
					<TextField 
						placeholder="Say something ..." />
					<div className="start-button">
						<Button>Start game</Button>
					</div>
				</div>
			</div>
		);
	}
}