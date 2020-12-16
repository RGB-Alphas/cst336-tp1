const { gameSessions } = require('../gameSession');

module.exports.playerCollisionEvent = function(collider, collidee, ruleset) {

	// console.log(`${collider.name} has collided with ${collidee.name} in a ${ruleset} game.`);
	var gameSessionManager = require('../gameSession');

	switch(ruleset)
	{
		case "lastman":
			if(collider.isHot === true)
			{
				collidee.color = "grey";
				collidee.isFrozen = true;
				const gameSessionID = gameSessionManager.WhereIsPlayer(collidee.name);
				gameSessionManager.UpdatePlayer(gameSessionID, collidee);
			}
			else
			{
				// console.log("Collider is not hot");
			}
		break;

		case "infection":
			if(collider.isHot === true)
			{
				collidee.isHot = true;
				collidee.isFast = true;
				collidee.color = "white";
				const gameSessionID = gameSessionManager.WhereIsPlayer(collider.name);
				gameSessionManager.UpdatePlayer(gameSessionID, collidee);
			}
			else
			{
				// console.log("Collider is not hot");
			}

		break;
	}
	
	module.exports.GameEnd = function(gameSessionID) {

		var gameSessionManager = require('../gameSession');

		var players = gameSessionManager.GetAllPlayers(gameSessionID);
		var options = gameSessionManager.GetOptions(gameSessionID);

		var gameResults = { "winners": [], "losers": [] };

		// get the predators and prey.
		var activePredators = players.filter(player => {
			return player.isHot;
		});

		var activePrey = players.filter(player => {
			return !player.isFrozen && !player.isHot; // people who are neither frozen nor hot
		});

		var inactivePrey = players.filter(player => {
			return player.isFrozen && !player.isHot;
		})

		switch(options.ruleset)
		{
			case "lastman":
				if(activePrey.length > 0)
				{
					gameResults.winners = activePrey;
					gameResults.losers = activePredators.concat(inactivePrey);
				}
				else
				{
					gameResults.winners = activePredators;
					gameResults.losers = activePrey.concat(inactivePrey);
				}
				
				break;

			case "infection":
				if(activePrey.length > 0)
				{
					gameResults.winners = activePrey;
					gameResults.losers = activePredators;
				}
				else
				{
					gameResults.winners = activePredators;
					gameResults.losers = activePrey;
				}
				break;
		}

		console.log(gameResults);

		// save in the db here //
			// save in the db here //
		var sql = require('../mysqlService');
		gameResults.winners.forEach((player, i) => {
         sql.updateUserStats(player.name, true, function(results){
         	console.log(results + "The game data has been inserted into the DB");
         })//callback function
      });//for each
      
      gameResults.losers.forEach((player, i) => {
         sql.updateUserStats(player.name, false, function(results){
         	console.log(results + "The game data has been inserted into the DB");
         })//callback function
      });//for each
      
      sql.updateMapStats(options.map);
	}

};