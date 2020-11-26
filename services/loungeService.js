
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
			lobbyCount: lobbyRegistry.lobbyCount
		});

		client.to('lounge').broadcast.emit('user joined', {
			userAlias: alias,
			sessionID: sessionID,
			onlineCount: usersOnline
		});

	});

	// //////////////
	// add lobby flow
	client.on('lobby-add-request', (data) => {
		const lobbyName = data.lobbyName;
		const lobbyPassword = data.lobbyPassword;
		var successful = lobbyRegistry.AddLobby(lobbyName, lobbyPassword);

		if(successful) {
			// tell the client it was successful.
			client.emit('lobby-add-request-accepted');

			// tell everyone about this hot new lobby.
			client.to('lounge').broadcast.emit('lobby created', {
				name: lobbyName,
				id: lobbyRegistry.GetLobbyID(lobbyName)
			});
		} else {
			client.emit('lobby-add-request-denied');
		}
	});

	client.on('lobby destroyed', (data) => {
		client.to('lounge').broadcast.emit('lobby destroyed', {
			lobbies: lobbyRegistry.GetAllLobbies
		});
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