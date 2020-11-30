var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');



module.exports = function(socket, client) {
	
	let addedUser = false;
	var lobbyName = "";

	client.on("enter_lobby", function (data) {
		
		lobbyName = data.lobbyName;
		const userName = data.userName;
		const alias = userRegistry.GetAliasByUserName(userName);
		const sessionID = client.id;

		client.join(`${lobbyName}`);
		client.username = userName;

		if(addedUser) return;

		// var lobby = lobbyRegistry.GetAllLobbies().find(lobby => lobby.name == lobbyName);
		var lobby = lobbyRegistry.GetLobbyByName(lobbyName);

		if(lobby !== undefined)
		{
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

		
	});

	// /////////////////
	// chat events begin
	client.on('typing', () => {
		client.to(`${lobbyName}`).broadcast.emit('typing', {
			alias: userRegistry.GetAliasByUserName(client.username)
		})
	});

	client.on('stop typing', () => {
		client.to(`${lobbyName}`).broadcast.emit('stop typing', {
			alias: userRegistry.GetAliasByUserName(client.username)
		})
	});

	client.on('new message', (clientMessage) => {
		
		client.to(`${lobbyName}`).broadcast.emit('new message', {
			alias: userRegistry.GetAliasByUserName(client.username),
			message: clientMessage
		});
	});
};