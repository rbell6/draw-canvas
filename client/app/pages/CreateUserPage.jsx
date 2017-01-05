import styles from '../less/create-user-page.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Link,
	browserHistory
} from 'react-router';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Footer from '../components/Footer';
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
			<div className="create-user-page footer-offset">
				<h1>Welcome to <strong>draw guru</strong>!</h1>
				<div className="create-user-container">
					<label>What should we call you?</label>
					<TextField 
						placeholder="Nickname"
						value={this.state.tempName}
						ref="textField" 
						onChange={e => this.onTempNameChange(e.target.value)} />
				</div>
				<Footer>
					<Button onClick={() => this.onContinue()} disabled={this.state.tempName.length === 0} variant="success">Next</Button>
				</Footer>
			</div>
		);
	}
}

export default connect(CreateUserPage.mapStateToProps, CreateUserPage.mapDispatchToProps)(CreateUserPage);
