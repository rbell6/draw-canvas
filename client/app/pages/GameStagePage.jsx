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
		});
	}

	onNameChange(name) {
		this.state.game.set('name', name);
		this.forceUpdate();
	}

	cancel() {
		// TODO if this is the host then delete, and notify everyone
		if (this.state.game.get('host').id === UserService.get().id) {
			GameService.delete(this.state.game);
		}
		browserHistory.push('/game-list');
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
						<TextField 
							placeholder="Say something ..." />
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