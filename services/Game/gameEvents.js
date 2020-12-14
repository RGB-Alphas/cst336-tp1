
var gameSessionManager = require('../gameSession');

module.exports.playerCollisionEvent = function(collider, collidee, ruleset) {

	const gameSessionID = gameSessionManager.WhereIsPlayer(collider.name);

	console.log(`${collider.name} has collided with ${collidee.name} in a ${ruleset} game.`);

	switch(ruleset)
	{
		case "lastman":
			if(collider.isHot === true)
			{
				collidee.color = "grey";
				collidee.isFrozen = true;
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
				gameSessionManager.UpdatePlayer(gameSessionID, collidee);
			}
			else
			{
				// console.log("Collider is not hot");
			}

		break;
	}
	
};