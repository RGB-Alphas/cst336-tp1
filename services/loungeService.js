
var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');
var sql = require('./mysqlService');

let userList = [];
let usersOnline = 0;


module.exports = function(socket, client) {

	var avatarUrl;
	let addedUser = false;

	client.on("enter_lounge", (data) => {

		client.join('lounge');

		if(addedUser)
			return;

		const userName = data.userName;
		const alias = data.alias;
		client.username = userName; // the socket will hold the real username.
		var sessionID = client.id;
		avatarUrl = data.avatarUrl;

		console.log("Received: %s", userName);

		

		

		if(!userRegistry.IsOnline(userName))
		{
			userRegistry.AddUser(userName, alias);
			addedUser = true;
		}

		// send the player a list of players.
		client.emit('lounge_entered', {
			onlineCount: userRegistry.GetUserCount(),
			onlineUsers: userRegistry.GetUsers(),
			lobbies: lobbyRegistry.GetAllLobbies(),
			lobbyCount: lobbyRegistry.GetLobbyCount()
		});

		client.to('lounge').broadcast.emit('user joined', {
			userAlias: alias,
			sessionID: sessionID,
			onlineCount: userRegistry.GetUserCount()
		});

	});

	// ///////////////
	// joining a lobby

	client.on('join_lobby_request', (data) => {
		const userName = client.username;
		const alias = userRegistry.GetAliasByUserName(userName);
		const lobbyName = data.lobbyName;

		if(lobbyRegistry.PasswordRequiredFor(lobbyName)) 
		{
			console.log(`${userName} wants to join [${lobbyName}].`);
			console.log(`I will let ${userName} know a password is required`);
			client.emit('password_required');
		}
		else 
		{
			if(lobbyRegistry.JoinLobby(lobbyName, alias))
			{
				console.log(`${userName} added to ${lobbyName} (no password required).`);
				client.emit('join_lobby_request_accepted');
			}
			else
			{
				console.log(`${userName} rejected by ${lobbyName} (no password required).`);
				client.emit('join_lobby_request_rejected');
			}
			
		}
	});

	client.on('join_lobby_with_password', (data) => {
		const lobbyName = data.lobbyName;
		const password = data.lobbyPassword;

		const userName = client.username;
		const alias = userRegistry.GetAliasByUserName(userName);

		console.log(`Testing name and password against ${lobbyName} credentials`);
		if(lobbyRegistry.Authenticate(lobbyName, password))
		{
			// this will fail if the lobby doesnt exist or is full.
			if(lobbyRegistry.JoinLobby(lobbyName, alias))
			{
				console.log(`${userName}'s join request accepted for ${lobbyName}`);
				client.emit('join_lobby_request_accepted');
			}
			else
			{
				console.log(`${userName}'s join request rejected for ${lobbyName}`);
				client.emit('join_lobby_request_rejected');
			}
		}
		else
		{
			console.log("Invalid Lobby Credentials");
			client.emit('join_lobby_request_rejected');
		}
	});

	// //////////////
	// add lobby flow
	client.on('lobby-add-request', (data) => {
		const lobbyName = data.lobbyName;
		const lobbyPassword = data.lobbyPassword;
		const lobbyCapacity = data.lobbyCapacity;
		const userAlias = userRegistry.GetAliasByUserName(client.username);
		var successful = lobbyRegistry.AddLobby(lobbyName, lobbyPassword, lobbyCapacity);

		if(successful) {

			lobbyRegistry.JoinLobby(lobbyName, userAlias);

			// tell the client it was successful.
			client.emit('lobby-add-request-accepted');

			var lobby = lobbyRegistry.GetLobbyByName(lobbyName);
			console.log(JSON.stringify(lobby));

			var occupants = lobbyRegistry.GetLobbyByName(lobbyName).players.length;
			var players = lobbyRegistry.GetLobbyByName(lobbyName).players;

			// tell everyone about this hot new lobby.
			client.to('lounge').broadcast.emit('lobby created', {
				name: lobbyName,
				id: lobbyRegistry.GetLobbyID(lobbyName),
				occupants: occupants,
				capacity: lobbyCapacity,
				players: players
			});
		} else {
			client.emit('lobby-add-request-denied');
		}
	});

	client.on('lobby destroyed', (data) => {
		//client.to('lounge').broadcast.emit('lobby destroyed', {
		//	lobbies: lobbyRegistry.GetAllLobbies
		//});
	});
	

	// /////////////////
	// chat events begin
	client.on('typing', () => {
		client.to('lounge').broadcast.emit('typing', {
			alias: userRegistry.GetAliasByUserName(client.username)
		})
	});

	client.on('stop typing', () => {
		client.to('lounge').broadcast.emit('stop typing', {
			alias: userRegistry.GetAliasByUserName(client.username)
		})
	});

	client.on('new message', (clientMessage) => {
		
		client.to('lounge').broadcast.emit('new message', {
			alias: userRegistry.GetAliasByUserName(client.username),
			message: clientMessage, avatarUrl: avatarUrl
		});
	});

	// end chat events
	// ///////////////

	//when user clicks update profile
	// send data to db

	client.on('save-Profile', (data) => {
		avatarUrl = data.avatarUrl;
		sql.updateUser(data.userId, 
			data.displayName, 
			data.skinID, 
			data.gender,
			data.locationCode,
			data.avatarUrl,
			function(results){
				if(!results){
					console.log("Error pushing to db");
				}	
					else{
						console.log("Profile Sucessfully Updated");
				}
			});
		
	});
	//end update profile
	
	// when the user disconnects.. perform this
	client.on('disconnect', () => {

		if(!addedUser)
			return;

		if(userRegistry.IsOnline(client.username))
		{
			// echo globally that this client has left
			client.to('lounge').broadcast.emit('user left', {
			 alias: userRegistry.GetAliasByUserName(client.username),
			 onlineCount: userRegistry.GetUserCount(),
			 onlineUsers: userRegistry.GetUsers()
		  });

		  userRegistry.RemoveUser(client.username);
		  addedUser = false;
		}
	 });
};