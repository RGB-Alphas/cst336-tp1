

// Define a game session:
// options, map, scenario
// players:
//		alias, (x,y), isHot <-- used for 'tagging' people.
// 	hasPowerup, isFast, isBig,

var gameSessions = [];
var gameSessionCount = 0;
var gameSessionID = 100000; // 100,000

module.exports = { gameSessions: gameSessions, gameSessionCount: gameSessionCount, gameSessionID: gameSessionID };




(function() {

	module.exports.AddGameSession = function(sessionName, playerAliases, options) {

		// define a session object
		var newSession = { "id": gameSessionID, "name": sessionName, "players": [], "options": options };

		// add players to the object. we can't do this directly with "session.players = players"
		// because there is extra data.
		for(var i = 0; i < playerAliases.length; i++)
		{
			var newPlayer = { "name": playerAliases[i], "x": -1, "y": -1, 
				"hot": false, "isPoweredUp": false, "isFast": false, "isBig": false };

			newSession.players.push(newPlayer);
		}

		gameSessions.push(newSession);
		gameSessionCount++;
		gameSessionID++;
	};

	// use for spawning or teleporting.
	module.exports.UpdatePlayerPosition = function(gameSessionID, playerAlias, newX, newY) {

	};

	// use for incremental movement.
	module.exports.UpdatePlayerRelativePosition = function(gameSessionID, playerAlias, offsetX, offsetY) {

	};

}());