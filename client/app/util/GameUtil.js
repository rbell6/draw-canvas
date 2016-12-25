import _ from 'lodash';

class GameUtil {
	activeRound(game) {
		let rounds = _.get(game, 'rounds', []);
		if (!rounds.length) { return null; }
		return rounds[rounds.length-1];
	}

	previousRound(game) {
		let rounds = _.get(game, 'rounds', []);
		if (rounds.length < 2) { return null; }
		return rounds[rounds.length-2];
	}

	usersWithPoints(game) {
		return game.userIds.map(userId => {
			let totalPoints = 0;
			game.rounds.forEach(round => {
				totalPoints += round.userPoints[userId] || 0;
			});
			return {userId: userId, points: totalPoints};
		}).sort((a, b) => b.points - a.points);
	}
}

export default new GameUtil();