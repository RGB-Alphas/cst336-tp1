var userRegistry = require('./userRegistrar');
var gameSessionManager = require('./gameSession');
const { Server } = require('socket.io');

// config
var serverFPS = 20;	// 20 updates per second.
var serverFrameTime = 1000/serverFPS; 	// 50ms per frame


module.exports = function(socket, client) {

	client.on("playerJoined", (data)=>{
		var player = JSON.parse(data);
		playerArray.push(player);
		console.log("# of Players: ", playerArray.length);
		client.emit("received", JSON.stringify(playerArray));
	})

	client.on('enter_game', (data) => {
		client.username = data.userName;
		var alias = data.alias;

		if(userAdded)
			return;

		userRegistry.AddUser(client.username, alias);
		var gameSessionID = gameSessionManager.WhereIsPlayer(alias);
		userAdded = true;

		client.join(`${gameSessionID}`);

		var players = gameSessionManager.GetAllPlayers(gameSessionID);
		var options = gameSessionManager.GetOptions(gameSessionID);


		// gameSessionManager.UpdatePlayerRelativePosition();

		client.emit('game_entered');

		console.log(JSON.stringify(data));
		
		setInterval(function() {
			socket.to(`${gameSessionID}`).emit("update players", { 
				players: gameSessionManager.GetAllPlayers(gameSessionID) 
			});
		}, serverFrameTime);
		
	});

	client.on('update player', (data) => {

		// identify player
		const alias = userRegistry.GetAliasByUserName(client.username);
		const gameSessionID = gameSessionManager.WhereIsPlayer(alias);
		// wasdState = data.wasdState;

		let wKey = data.wasdState.w;
		let aKey = data.wasdState.a;
		let sKey = data.wasdState.s;
		let dKey = data.wasdState.d;

		let vector = { x: 0, y: 0 };
		
		if(wKey === true) {
			vector.y = -1;
		}
			
		if(aKey === true) {
			vector.x = -1;
		}
			
		if(sKey === true) {
			vector.y = 1;
		}
			
		if(dKey === true) {
			vector.x = 1;
		}

		let xOffset = vector.x * 20;
		let yOffset = vector.y * 20;

		gameSessionManager.UpdatePlayerRelativePosition(gameSessionID, alias, xOffset, yOffset);

		/*
		socket.to(`${gameSessionID}`).emit("update players", { 
			players: gameSessionManager.GetAllPlayers(gameSessionID) 
		});
		*/
	});