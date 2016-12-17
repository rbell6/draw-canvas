import styles from '../less/create-user-page.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Link,
	browserHistory
} from 'react-router';
import TextField from '../components/TextField';
import Button from '../components/Button';
import User from '../../../models/User';
import UserService from '../services/UserService';
import _ from 'lodash';
import {
	saveUserName
} from '../actions/UserActions';
import {
	connect
} from 'react-redux';


class CreateUserPage extends React.Component {
	static mapStateToProps(state) {
		return {
			user: state.user
		};
	}

	static mapDispatchToProps(dispatch) {
		return {
			saveUserName: name => dispatch(saveUserName(name))
		};
	}

	constructor(props, context) {
		super(props, context);
		this.state = {
			tempName: props.user.name
		};
	}

	componentDidMount() {
		this.textField = ReactDOM.findDOMNode(this.refs.textField);
		this.textField.focus();
	}

	onTempNameChange(name) {
		this.setState({tempName: name});
	}

	onContinue() {
		this.props.saveUserName(this.state.tempName)
			.then(() => browserHistory.push('/game-list'));
	}

	render() {
		return (
			<div className="create-user-page">
				<div className="create-user-container">
					<TextField 
						placeholder="Nickname"
						value={this.state.tempName}
						ref="textField" 
						onChange={e => this.onTempNameChange(e.target.value)} />
					<div className="launch-buttons">
						<Button onClick={() => this.onContinue()} className="launch-button" disabled={this.state.tempName.length === 0} variant="success">Find a game <i className="fa fa-chevron-right" /></Button>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(CreateUserPage.mapStateToProps, CreateUserPage.mapDispatchToProps)(CreateUserPage);
