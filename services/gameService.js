var userRegistry = require('./userRegistrar');
var gameSessionManager = require('./gameSession');

module.exports = function(socket, client) {

	var userAdded = false;

	client.on("enter_game", function (data) {

		client.on('enter_game', (data) => {
			client.username = data.userName;
			var alias = data.alias;

			userRegistry.AddUser(userName, alias);
			var gameSessionID = gameSessionManager.WhereIsPlayer(alias);

			client.join(`${gameSessionID}`);

			if(userAdded)
				return;

			var players = gameSessionManager.GetAllPlayers(gameSessionID);
			var options = gameSessionManager.GetOptions(gameSessionID);

			client.emit('game_entered', {
				players: players,
				options: options
			});

		});

	});
};