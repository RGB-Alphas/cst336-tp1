
var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');

let userList = [];
let usersOnline = 0;

let lobbyList = [];


module.exports = function(socket, client) {

	let addedUser = false;

	client.on("enter_lounge", (userName) => {

		client.join('lounge');

		if(addedUser) return;
		
		console.log("Received: %s", userName);
		const alias = userRegistry.GetAliasByUserName(userName);
		const sessionID = client.id;
		const entry = { "sessionID": sessionID, "alias": alias };
		client.username = userName; // the socket will hold the real username.
		
		userList.push(entry);
		usersOnline++;
		addedUser = true;

		// send the player a list of players.
		client.emit('lounge_entered', {
			onlineCount: usersOnline,
			onlineUsers: userList,
			lobbies: lobbyRegistry.GetAllLobbies(),
			lobbyCount: lobbyRegistry.GetLobbyCount()
		});

		client.to('lounge').broadcast.emit('user joined', {
			userAlias: alias,
			sessionID: sessionID,
			onlineCount: usersOnline
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
			message: clientMessage
		});
	});

	// end chat events
	// ///////////////

	// when the user disconnects.. perform this
	client.on('disconnect', () => {

		if(addedUser) {
			--usersOnline;
			userList.splice(userList.indexOf(client.username), 1);
  
			// echo globally that this client has left
			client.to('lounge').broadcast.emit('user left', {
			 alias: userRegistry.GetAliasByUserName(client.username),
			 onlineCount: usersOnline,
			 onlineUsers: userList
		  });
		}
	 });
};

(function() {

	module.exports.AddOnlineUser = function(alias) {
		userList.push(alias);
	};

}());