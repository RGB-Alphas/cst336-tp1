var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');
var gameSessionManager = require('./gameSession');



module.exports = function(socket, client) {
	
	let addedUser = false;

	client.on("enter_lobby", function (data) {
		
		var lobbyName = data.lobbyName;
		client.join(`${lobbyName}`);

		if(lobbyRegistry.GetLobbyByName(lobbyName) === 'unknown')
		{
			client.emit('redirect user home');
		}

		if(addedUser)
			return;

		const userName = data.userName;
		const alias = data.alias;
		var sessionID = client.id;
		var userId = data.userId;

		//if(!userRegistry.IsOnline(userName))
		//{
			userRegistry.AddUser(userName, alias, userId, sessionID);
			client.username = userName;
			addedUser = true;
		//}

		// var lobby = lobbyRegistry.GetAllLobbies().find(lobby => lobby.name == lobbyName);
		var lobby = lobbyRegistry.GetLobbyByName(lobbyName);

		if(lobby)
		{
			console.log(`${alias} is receiving initial lobby data.`);
			console.log(JSON.stringify(lobby));
			const playerCount = lobby.players.length;
			const players = lobby.players.map(player => { return player.name; });
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
				players: players,
				playerCount: lobby.players.length
			});
		}
		else
		{
			console.log("This player's lobby was not found.");
		}
		
	});

	client.on('player ready', () => {
		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		lobbyRegistry.SetPlayerReadyState(lobbyName, alias, true);
	});

	client.on('player not ready', () => {
		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		lobbyRegistry.SetPlayerReadyState(lobbyName, alias, false);
	});

	client.on('ready check', () => {
		// to get a list of players use these 3 lines of code.
		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		var unreadyList = lobbyRegistry.WhoIsNotReady(lobbyName);
		console.log("Unready users: %s", JSON.stringify(unreadyList));

		if(unreadyList.length > 0) { 
			/*
			socket.to(`${lobbyName}`).emit(`ready check failed`, {
				waitingFor: unreadyList
			}) */
		}
		else {
			const lobby = lobbyRegistry.GetLobbyByName(lobbyName);

			console.log(`Lobby data for: '${lobbyName}'`);
			console.log(lobby);

			// add a game session and get an id.
			var sessionID = gameSessionManager.AddGameSession(
				lobbyName, 
				lobby.players.map(player => { 
					return { id: player.id, alias: player.name } 
					}),
				lobby.options);
			gameSessionManager.Initialize(sessionID);
			socket.to(`${lobbyName}`).emit('ready check success');
			addedUser = false;
		}
	});



	client.on('ruleSet changed', ruleSet => {

		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		lobbyRegistry.UpdateLobbyRuleSet(lobbyName, ruleSet);

		client.to(`${lobbyName}`).broadcast.emit('ruleSet changed', ruleSet);
	});

	client.on('timeLimit changed', timeLimit => {

		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		lobbyRegistry.UpdateLobbyTime(lobbyName, timeLimit);

		client.to(`${lobbyName}`).broadcast.emit('timeLimit changed', timeLimit);
	});

	client.on('map changed', map => {

		var alias = userRegistry.GetAliasByUserName(client.username);
		var lobbyName = lobbyRegistry.WhereisPlayer(alias);

		lobbyRegistry.UpdateLobbyMap(lobbyName, map);

		client.to(`${lobbyName}`).broadcast.emit('map changed', map);
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
				users: lobby.players.map(player => { return player.name; })
			});

			console.log(`Left [${lobbyName}], here's the new info for it:`);
			console.log(JSON.stringify(lobby));


			var isEmpty = lobbyRegistry.RemoveLobbyIfEmpty(lobbyName);

			if(isEmpty === true)
			{
				client.to(`${lobbyName}`).broadcast.emit("lobby destroyed", {
					lobbies: lobbyRegistry.GetAllLobbies(),
					lobbyCount: lobbyRegistry.GetLobbyCount()
				});
			}
	

			userRegistry.RemoveUser(client.username);
			addedUser = false;
		}
	});
};