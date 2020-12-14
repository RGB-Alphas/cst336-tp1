var userRegistry = require('./userRegistrar');
var gameSessionManager = require('./gameSession');
var physics = require('./Game/physics');
var gameEvent = require('./Game/gameEvents');

// config
var serverFPS = 20;	// 20 updates per second.
var serverFrameTime = 1000/serverFPS; 	// 50ms per frame

module.exports = function(socket, client) {

	var userAdded = false;

	client.on('enter_game', (data) => {
		client.username = data.userName;
		var alias = data.alias;
		var userId = data.userId;
		var sessionId = client.id;

		if(userAdded)
			return;

		userRegistry.AddUser(client.username, alias, userId, sessionId);
		var gameSessionID = gameSessionManager.WhereIsPlayer(alias);
		client.join(`${gameSessionID}`);
		
		userAdded = true;

		// var players = gameSessionManager.GetAllPlayers(gameSessionID);
		var options = gameSessionManager.GetOptions(gameSessionID);

		var mapData = gameSessionManager.GetMapData(gameSessionID);

		// console.log(JSON.stringify(mapData));
		// timeLimit = options.time;
		// winCondition = options.scenario;

		// gameSessionManager.UpdatePlayerRelativePosition();

		client.emit('game_entered', { mapData: mapData, options: options });

		console.log(JSON.stringify(data));
		
		setInterval(function() {
			socket.to(`${gameSessionID}`).emit("update players", { 
				players: gameSessionManager.GetAllPlayers(gameSessionID) 
			});
		}, serverFrameTime);
		
	});

	client.on('update player', (data) => {

		if(userAdded)
		{
			// identify player
			const alias = userRegistry.GetAliasByUserName(client.username);
			const gameSessionID = gameSessionManager.WhereIsPlayer(alias);

			// get the map data.
			const mapData = gameSessionManager.GetMapData(gameSessionID);
			const options = gameSessionManager.GetOptions(gameSessionID);

			// get current player positions
			const players = gameSessionManager.GetAllPlayers(gameSessionID);
			const me = players.findIndex(player => player.name === alias);
			// console.log(JSON.stringify(players[me]));

			if(players[me].isFrozen === true)
				return;
			
			// client's keyboard state:
			let wKey = data.wasdState.w;
			let aKey = data.wasdState.a;
			let sKey = data.wasdState.s;
			let dKey = data.wasdState.d;

			let vector = { x: 0, y: 0 };

			// important
			var hasCollided = false;

			// we are seeing if a circle is colliding with a quad.
			// circles are drawn from center so offsets are needed.
			let currentX = players[me].x;
			let currentY = players[me].y;
			let halfWidth = players[me].radius;

			let currentX1 = currentX - halfWidth;
			let currentY1 = currentY - halfWidth;
			let currentX2 = currentX + halfWidth;
			let currentY2 = currentY + halfWidth;
			
			if(wKey === true) {
				vector.y = -1;
				hasCollided = physics.isPointInRect(currentX, currentY1, mapData.tiles);
			}
				
			if(aKey === true) {
				vector.x = -1;
				hasCollided = physics.isPointInRect(currentX1, currentY, mapData.tiles);
			}
				
			if(sKey === true) {
				vector.y = 1;
				hasCollided = physics.isPointInRect(currentX, currentY2, mapData.tiles);
			}
			
			if(dKey === true) {
				vector.x = 1;
				hasCollided = physics.isPointInRect(currentX2, currentY, mapData.tiles);
			}

			// has a player collided?
			players.some(player => {

				if(player.name === alias)
					return false;

				if(physics.isCircleCollision( 
					{ "x": player.x, "y": player.y }, player.radius, // other player
					{ "x": players[me].x, "y": players[me].y }, players[me].radius )) // current
				{
					gameEvent.playerCollisionEvent(players[me], player, options.ruleset);
					return true;
				}
				else
				{
					return false;
				}
			})
			
			// how much we are moving this frame:
			var speed = 20;

			if(players[me].isFast)
				speed += 5;

			let xOffset = vector.x * speed;
			let yOffset = vector.y * speed;
			
			if(hasCollided === false)
				gameSessionManager.UpdatePlayerRelativePosition(gameSessionID, alias, xOffset, yOffset);

			// console.log(`${gameSessionID}: ${alias} moved Rel(${xOffset}, ${yOffset}).`)
			socket.to(`${gameSessionID}`).emit("update players", { 
				players: gameSessionManager.GetAllPlayers(gameSessionID) 
			});
		}
	});


};