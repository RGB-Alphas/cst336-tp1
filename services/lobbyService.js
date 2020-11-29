var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');

module.exports = function(socket, client) {
	
	let addedUser = false;

	client.on("enter_lobby", function (lobbyName) {
		
		client.join(`${lobbyName}`);

		if(addedUser) return;

		var lobby = lobbyRegistry.GetAllLobbies().find(lobby => lobby.name == lobbyName);

		if(lobby)
		{
			client.emit('lobby_entered', {
				playerCount: lobby.players.length,
				players: lobby.players,
				lobby: lobby,
				alias: lobby.players[lobby.players.length-1]
			});
		}
	});
};