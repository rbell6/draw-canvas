import styles from '../less/home-page.less';
import React from 'react';
import {
	browserHistory
} from 'react-router';

export default class HomePage extends React.Component {
	componentDidMount() {
		setTimeout(() => {
			this.nextPage();
		}, 1000);
	}

	nextPage() {
		browserHistory.push('/create-user');
	}

	render() {
		return (
			<div></div>
		);
	}
}