

// Define a game session:
// options, map, scenario
// players:
//		alias, (x,y), isHot <-- used for 'tagging' people.
// 	hasPowerup, isFast, isBig,

var gameSessions = [];
var GameSessionCount = 0;
var GameSessionID = 100000; // 100,000

module.exports = { gameSessions: gameSessions, gameSessionCount: GameSessionCount, gameSessionID: GameSessionID };




(function() {

	// Adds a game session and returns a sessionID.
	module.exports.AddGameSession = function(sessionName, playerAliases, options) {

		// define a session object
		var newSession = { "id": GameSessionID, "name": sessionName, "players": [], "options": options };

		// add players to the object. we can't do this directly with "session.players = players"
		// because there is extra data.
		for(var i = 0; i < playerAliases.length; i++)
		{
			var newPlayer = { "name": playerAliases[i], "x": -1, "y": -1, 
				"isHot": false, "isPoweredUp": false, "isFast": false, "isBig": false };

			newSession.players.push(newPlayer);
		}

		gameSessions.push(newSession);
		GameSessionCount++;
		GameSessionID++;

		return newSession.id;
	};

	module.exports.WhereIsPlayer = function(playerAlias) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return "";

		var playerIndex = gameSessions[sessionIndex].players.findIndex(player => player.name === playerAlias);

		if(playerIndex === -1)
			return "";

		return gameSessions[sessionIndex].GameSessionID;
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
		gameSessions[sessionIndex].players[playerIndex].x = newY;

	};

	// use for incremental movement.
	module.exports.UpdatePlayerRelativePosition = function(gameSessionID, playerAlias, offsetX, offsetY) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		var playerIndex = gameSessions[sessionIndex].players.findIndex(player => player.name === playerAlias);

		gameSessions[sessionIndex].players[playerIndex].x = offsetX;
		gameSessions[sessionIndex].players[playerIndex].x = offsetY;
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

	module.exports.GetAllPlayerNamesAndPositions = function(gameSessionID) {
		var sessionIndex = gameSessions.findIndex(session => session.id === gameSessionID);

		if(sessionIndex === -1)
			return;

		return gameSessions[sessionIndex].players.map( player => { return { "name": player.name, "X": player.X, "Y": player.Y } } )
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