export default function gameList(state=[], action) {
	switch(action.type) {
		case 'RECEIVE_GAME_LIST':
			return action.gameList.map(game => ({
				id: game.id,
				name: game.name,
				hostId: game.hostId,
				userIds: game.userIds,
				gameState: game.gameState
			}));
		default:
			return state;
	}
}