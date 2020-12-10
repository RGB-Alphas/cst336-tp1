



(function() {

	module.exports.isPointInRect = function(xPos, yPos, rectArray) {

		// console.log(`Testing: (${xPos},${yPos}).`);

		var hasCollided = false;

		rectArray.forEach(tile => {

			var tileX1 = tile.x;
			var tileX2 = tile.x + tile.width;
			var tileY1 = tile.y;
			var tileY2 = tile.y + tile.height;

			if(xPos <= tileX2 &&
				xPos >= tileX1 &&
				yPos <= tileY2 &&
				yPos >= tileY1) // if the player touches the top side of the quad.
			{
				console.log("Collision detected");
				hasCollided = true;
			}
		});

		return hasCollided;
	};

}());