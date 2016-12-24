import styles from '../less/game-text-field.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TextField from './TextField';
import HotkeyService from '../services/HotkeyService';
import UserService from '../services/UserService';
import UserIcon from './UserIcon';
import classNames from 'classnames';
import {
	connect
} from 'react-redux';

class GameTextField extends React.Component {
	static mapStateToProps(state) {
		return {
			game: state.game,
			user: state.user
		};
	}

	static mapDispatchToProps(dispatch) {
		return {};
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			value: '',
		};
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.textField = ReactDOM.findDOMNode(this.refs.textField);
		this.textField.focus();
	}

	componentWillUnmount() {
		HotkeyService.off('enter', this.onSubmit);
	}

	onFocus() {
		HotkeyService.on('enter', this.onSubmit);
	}

	onBlur() {
		HotkeyService.off('enter', this.onSubmit);
	}

	onSubmit() {
		if (this.state.value === '') { return; }
		this.props.messageService.addMessage(this.state.value);
		this.setState({value: ''});
	}

	userGuessedCorrectWord() {
		let activeRound = this.props.game.rounds[this.props.game.rounds.length-1];
		return Object.keys(activeRound.userPoints).indexOf(this.props.user.id) > -1;
	}

	render() {
		return (
			<div className={classNames('game-text-field', {
				'game-text-field-correct-word': this.userGuessedCorrectWord()
			})}>
				<div className="game-text-field-container">
					<TextField 
						ref="textField"
						value={this.state.value}
						onChange={e => this.setState({value: e.target.value})}
						onFocus={e => this.onFocus()}
						onBlur={e => this.onBlur()}
						placeholder="Guess the word . . ." />
				</div>
			</div>
		);
	}
}

export default connect(GameTextField.mapStateToProps, GameTextField.mapDispatchToProps)(GameTextField);
