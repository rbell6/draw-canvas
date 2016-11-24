import styles from '../less/game-text-field.less';
import React from 'react';
import ReactDOM from 'react-dom';
import TextField from './TextField';
import HotkeyService from '../services/HotkeyService';
import UserService from '../services/UserService';
import UserIcon from './UserIcon';

export default class GameTextField extends React.Component {
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
		this.props.messageService.addMessage(this.state.value);
		this.setState({value: ''});
	}

	render() {
		return (
			<div className="game-text-field">
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