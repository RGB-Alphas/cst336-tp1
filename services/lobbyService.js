var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');



module.exports = function(socket, client) {
	
	let addedUser = false;

	client.on("enter_lobby", function (data) {
		
		var lobbyName = data.lobbyName;
		client.join(`${lobbyName}`);

		if(addedUser)
			return;

		
		const userName = data.userName;
		const alias = data.alias;
		var sessionID = client.id;
		

		
		

		if(!userRegistry.IsOnline(userName))
		{
			userRegistry.AddUser(userName, alias);
			client.username = userName;
			addedUser = true;
		}

		// var lobby = lobbyRegistry.GetAllLobbies().find(lobby => lobby.name == lobbyName);
		var lobby = lobbyRegistry.GetLobbyByName(lobbyName);

		if(lobby)
		{
			console.log(`${alias} is receiving initial lobby data.`);
			console.log(JSON.stringify(lobby));
			const playerCount = lobby.players.length;
			const players = lobby.players;
			const options = lobby.options;

			console.log(`Sending { playerCount: ${playerCount}, players:${JSON.stringify(players)}, options: ${options}, myAlias: ${alias} }`);
			client.emit('lobby_entered', {
				playerCount: playerCount,
				players: players,
				options: options,
				myAlias: alias
			});

			console.log(`Broadcasting to ${lobbyName}: { userAlias: ${alias}, sessionID: ${sessionID}, playerCount: ${lobby.players.length} }.`);
			client.to(`${lobbyName}`).broadcast.emit('lobby user joined', {
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
	client.on('lobby typing', () => {
		
		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		client.to(`${lobbyName}`).broadcast.emit('lobby typing', {
			alias: alias
		})
	});

	client.on('lobby stop typing', () => {
		
		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		client.to(`${lobbyName}`).broadcast.emit('lobby stop typing', {
			alias: alias
		})
	});

	client.on('lobby new message', (clientMessage) => {

		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		console.log(`Broadcasting to [${lobbyName}]: "${clientMessage}".`);

		client.to(`${lobbyName}`).broadcast.emit('lobby new message', {
			alias: alias,
			message: clientMessage
		});
	});

	client.on('leave lobby', () => {

		if(!addedUser)
			return;

		if(userRegistry.IsOnline(client.username))
		{
			var alias = userRegistry.GetAliasByUserName(client.username);
			var lobbyName = lobbyRegistry.WhereisPlayer(alias);
			console.log(`Trying to exit ${alias} from ${lobbyName}.`);
			lobbyRegistry.ExitPlayerFromLobby(lobbyName, alias);

			var lobby = lobbyRegistry.GetLobbyByName(lobbyName);

			client.to(`${lobbyName}`).broadcast.emit('lobby user left', {
				alias: alias,
				userCount: lobby.players.length,
				users: lobby.players
			});

			console.log(`Left [${lobbyName}], here's the new info for it:`);
			console.log(JSON.stringify(lobby));

			lobbyRegistry.RemoveLobbyIfEmpty(lobbyName);
			userRegistry.RemoveUser(client.username);
			addedUser = false;
		}
	});
};