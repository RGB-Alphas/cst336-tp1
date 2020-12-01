var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');



module.exports = function(socket, client) {
	
	let addedUser = false;

	client.on("enter_lobby", function (data) {
		
		var lobbyName = data.lobbyName;
		const userName = data.userName;
		const alias = userRegistry.GetAliasByUserName(userName);
		const sessionID = client.id;

		client.join(`${lobbyName}`);
		client.username = userName;

		if(addedUser) return;

		// var lobby = lobbyRegistry.GetAllLobbies().find(lobby => lobby.name == lobbyName);
		var lobby = lobbyRegistry.GetLobbyByName(lobbyName);

		if(lobby)
		{
			console.log("Player is receiving initial lobby data.");
			console.log(JSON.stringify(lobby));
			const playerCount = lobby.players.length;
			const players = lobby.players;
			const options = lobby.options;

			client.emit('lobby_entered', {
				playerCount: playerCount,
				players: players,
				options: options
			});

			client.to(`${lobbyName}`).broadcast.emit('user joined', {
				userAlias: alias,
				sessionID: sessionID,
				playerCount: lobby.players.length
			});
		}
		else
		{
			console.log("This player's lobby was not found.");
		}
		
	});

	// /////////////////
	// chat events begin
	client.on('typing', () => {
		const lobbyName = lobbyRegistry.WhereisPlayer(alias);
		client.to(`${lobbyName}`).broadcast.emit('typing', {
			alias: userRegistry.GetAliasByUserName(client.username)
		})
	});

	client.on('stop typing', () => {
		const lobbyName = lobbyRegistry.WhereisPlayer(alias);
		client.to(`${lobbyName}`).broadcast.emit('stop typing', {
			alias: userRegistry.GetAliasByUserName(client.username)
		})
	});

	client.on('new message', (clientMessage) => {
		const lobbyName = lobbyRegistry.WhereisPlayer(alias);
		client.to(`${lobbyName}`).broadcast.emit('new message', {
			alias: userRegistry.GetAliasByUserName(client.username),
			message: clientMessage
		});
	});

	client.on('leave lobby', () => {
		const alias = userRegistry.GetAliasByUserName(client.username);
		const lobbyName = lobbyRegistry.WhereisPlayer(alias);
		lobbyRegistry.ExitPlayerFromLobby(lobbyName, alias);
		lobbyRegistry.RemoveLobbyIfEmpty(lobbyName);
		
		var lobby = lobbyRegistry.GetLobbyByName(lobbyName);

		if(lobby)
		{
			client.to(`${lobbyName}`).broadcast.emit('user left', {
				alias: alias,
				userCount: lobby.players.length,
				users: lobby.players
			});
		}
	});
};