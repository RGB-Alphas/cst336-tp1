var mapGenerator = require('./Game/maps');

// Define a game session:
// options, map, scenario
// players:
//		alias, (x,y), isHot <-- used for 'tagging' people.
// 	hasPowerup, isFast, isBig,

var gameSessions = [];
var GameSessionCount = 0;
var GameSessionID = 100000; // 100,000

module.exports = { gameSessions: gameSessions, gameSessionCount: GameSessionCount, gameSessionID: GameSessionID };


function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

(function() {

	// Adds a game session and returns a sessionID.
	module.exports.AddGameSession = function(sessionName, playerAliases, options) {

		// define a session object

		var newSession = { "id": GameSessionID, "name": sessionName, "players": [], mapData: [], "options": options };

		// add players to the object. we can't do this directly with "session.players = players"
		// because there is extra data.
		for(var i = 0; i < playerAliases.length; i++)
		{
			var newPlayer = { "name": playerAliases[i], "x": -1, "y": -1, "radius": 20, "color": "red",
				"isHot": false, "isPoweredUp": false, "isFast": false, "isBig": false };

			newSession.players.push(newPlayer);
		}

		gameSessions.push(newSession);
		GameSessionCount++;
		GameSessionID++;

		return newSession.id;
	};

	module.exports.Initialize = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		// ///////////////////
		// spawning code begin
		var spawnX1 = 1280 / 4;						// 1280x760 is our resolution.
		var spawnX2 = (1280 / 4) + (1280 / 2); 
		var spawnY1 = 720 / 4;						// 760 / 40 has a remainder. That remainder
		var spawnY2 = (720 / 4) + (720 / 2);	// is screwing up my math.

		var spawnX3 = 1280 / 2;
		// var spawnX4 =
		var spawnY3 = 760 / 2;
		// var spawnY4 =

		// to randomize just use _shuffle...
		var spawnPoints = [
			{ "name": "spawn1", "x": spawnX1, "y":spawnY1 },
			{ "name": "spawn2", "x": spawnX2, "y":spawnY1 },
			{ "name": "spawn3", "x": spawnX2, "y":spawnY2 },
			{ "name": "spawn4", "x": spawnX1, "y":spawnY2 },
			{ "name": "spawn5", "x": spawnX3, "y":spawnY1 },
			{ "name": "spawn6", "x": spawnX2, "y":spawnY3 },
			{ "name": "spawn7", "x": spawnX3, "y":spawnY2 },
			{ "name": "spawn8", "x": spawnX1, "y":spawnY3 }
		];

		// spawn players
		gameSessions[sessionIndex].players.forEach((player, i) => {
			// player.x = getRandomNumber(20, 1260) % 40;
			// player.y = getRandomNumber(20, 720) % 40;
			player.x = spawnPoints[i].x;
			player.y = spawnPoints[i].y;
		});

		// spawning code end
		// /////////////////

		// fill mapData with... you guessed it: data!
		var options = gameSessions[sessionIndex].options;
		gameSessions[sessionIndex].mapData = mapGenerator.CreateMap(options.map);
	};

	module.exports.GetMapData = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		return gameSessions[sessionIndex].mapData;
	};

	module.exports.WhereIsPlayer = function(playerAlias) {

		//console.log(`Looking for ${playerAlias} in any game session.`);
		for(var sessionIndex = 0; sessionIndex < gameSessions.length; sessionIndex++)
		{
			for(var playerIndex = 0; playerIndex < gameSessions[sessionIndex].players.length; playerIndex++)
			{
				var alias = gameSessions[sessionIndex].players[playerIndex].name;
				//console.log(JSON.stringify(gameSessions[sessionIndex].players[playerIndex]));
				//console.log(`Comparing ${alias} and ${playerAlias}`)

				// console.log(`WhereIsPlayer() Comparing: ${alias} with ${playerAlias}.`);
				if(alias === playerAlias)
					return gameSessions[sessionIndex].id;
			}
		}

		//console.log(`Can not find '${playerAlias}' in any game`);
		console.log(`I don't know where ${playerAlias} is...`);
		return -1;
	};

	// might not need...
	module.exports.JoinGameSession = function(sessionID, playerAlias) {

		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		var newPlayer = { "name": playerAliases[i], "x": -1, "y": -1, 
				"isHot": false, "isPoweredUp": false, "isFast": false, "isBig": false };

		gameSessions[sessionIndex].players.push(newPlayer);
	};

	module.exports.RemoveGameSession = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		gameSessions.splice(sessionIndex, 1);
		this.GameSessionCount--;
	}

	// use for spawning or teleporting.
	module.exports.UpdatePlayerPosition = function(gameSessionID, playerAlias, newX, newY) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		var playerIndex = gameSessions[sessionIndex].players.findIndex(player => player.name === playerAlias);

		gameSessions[sessionIndex].players[playerIndex].x = newX;
		gameSessions[sessionIndex].players[playerIndex].y = newY;

	};

	// use for incremental movement.
	module.exports.UpdatePlayerRelativePosition = function(gameSessionID, playerAlias, offsetX, offsetY) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1) {
			console.log(`UpdatePlayerRelativePosition(${gameSessionID}, ${playerAlias}, ${offsetX}, ${offsetY}`);
			return;
		}
			

		var playerIndex = gameSessions[sessionIndex].players.findIndex(player => player.name === playerAlias);

		if(playerIndex === -1) {
			console.log("UpdatePlayerRelativePosition() player not found");
			return;
		}

		// console.log(`Moved ${playerAlias} (relative) {X:${offsetX},Y:${offsetY}}`);
		gameSessions[sessionIndex].players[playerIndex].x += offsetX;
		gameSessions[sessionIndex].players[playerIndex].y += offsetY;
	};

	module.exports.UpdatePlayerFlags = function(gameSessionID, playerAlias, isHot, isPoweredUp, isFast, isBig) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		var playerIndex = gameSessions[sessionIndex].players.findIndex(player => player.name === playerAlias);

		gameSessions[sessionIndex].players[playerIndex].isHot = isHot;
		gameSessions[sessionIndex].players[playerIndex].isPoweredUp = isPoweredUp;
		gameSessions[sessionIndex].players[playerIndex].isFast = isFast;
		gameSessions[sessionIndex].players[playerIndex].isBig = isBig;
	};

	module.exports.GetAllPlayers = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1) {
			console.log(`GetAllPlayers() can't find this session, id: ${gameSessionID}`);
			return [];
		}
		return gameSessions[sessionIndex].players;
	};

	module.exports.GetAllPlayerNamesAndPositions = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;
    
		return gameSessions[sessionIndex].players.map( player => { return { "name": player.name, "x": player.x, "y": player.y, "radius": player.radius } } )

	};

	module.exports.GetAllPlayerNamesAndFlags = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		return gameSessions[sessionIndex].players.map( player => { 
			return { "name": player.name, "isHot": player.isHot, "isPoweredUp": player.isPoweredUp, "isFast": player.isFast, "isBig": player.isBig } })
	};

	module.exports.GetOptions = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		return gameSessions[sessionIndex].options;
	};

}());