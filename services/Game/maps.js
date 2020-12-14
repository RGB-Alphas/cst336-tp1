// each time we push to mapData it will be another layer of the map.
// This leaves us room for expansion. A typical 2D game will have
// several layers in their map.
// 
/* Some examples:
	Layer0 = Floor / Terrain,
	Layer1 = Foliage: [ leaves, weeds, herbs ] || Floor Decoration: [ rugs, carpets, trash ]
	Layer2 = Items: [ weapons, armor, gold, potions ]
	Layer3 = Players [ { name, x, y, color } ]
	Layer4 = Trees || Walls
	Layer5 = 2nd floor walls
*/

// these numbers are for 1280x760 resolution.
var tileWidth = 40;
var tileHeight = 40;
var mapWidthInPixels = 1280;
var mapHeightInPixels = 760;
var mapWidthInTiles = 32;
var mapHeightInTiles = 19;

(function() {

	module.exports.CreateMap = function(mapName) {
		switch (mapName) {
			case "destiny":
				return module.exports.CreateDestiny();
				break;

			case "crucible":
				return module.exports.CreateCrucible();
				break;

			case "icefortress":
				return module.exports.CreateIceFortress();
			default:
				return [];
				break;
		}
	};

	module.exports.CreateDestiny = function() {

		var mapData = { 
			"mapWidthInPixels": mapWidthInPixels, 
			"mapHeightInPixels": mapHeightInPixels, 
			"mapWidthInTiles": mapWidthInTiles, 
			"mapheightInTiles": mapHeightInTiles, 
			"spawnPoints": [],
			"tiles": [] 
		};
		var index = 0;

		// ///////////////////
		// spawning code begin
		var spawnX1 = mapWidthInPixels / 4;			// 1280x760 is our resolution.
		var spawnX2 = (mapWidthInPixels / 4) + (mapWidthInPixels / 2); 
		var spawnY1 = (mapHeightInPixels - 40) / 4;	// 760 / 40 has a remainder. That remainder
		var spawnY2 = ((mapHeightInPixels - 40) / 4) + ((mapHeightInPixels - 40) / 2);	// is screwing up my math.

		var spawnX3 = mapWidthInPixels / 2;
		// var spawnX4 =
		var spawnY3 = (mapHeightInPixels - 40) / 2;
		// var spawnY4 =

		mapData.spawnPoints = [
			{ "name": "spawn1", "x": spawnX1, "y":spawnY1 },
			{ "name": "spawn2", "x": spawnX2, "y":spawnY1 },
			{ "name": "spawn3", "x": spawnX2, "y":spawnY2 },
			{ "name": "spawn4", "x": spawnX1, "y":spawnY2 },
			{ "name": "spawn5", "x": spawnX3, "y":spawnY1 },
			{ "name": "spawn6", "x": spawnX2, "y":spawnY3 },
			{ "name": "spawn7", "x": spawnX3, "y":spawnY2 },
			{ "name": "spawn8", "x": spawnX1, "y":spawnY3 }
		];

		// NORTH WALL LEFT SIDE
		// 2 tiles from the left, two tiles down.
		for(index = 2; index < 15; index++)
		{
			var newTile = { "x": (index * tileWidth), "y": (tileHeight * 2), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// NORTH WALL RIGHT SIDE
		// leave a gap 2 tiles wide at the top middle
		// and a gap on the right side (also two tiles)
		for(index = 17; index < 30; index++)
		{
			var newTile = { "x": (index * tileWidth), "y": (tileHeight * 2), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// SOUTH WALL LEFT SIDE
		for(index = 2; index < 15; index++)
		{
			var newTile = { "x": (index * tileWidth), "y": (tileHeight * 15), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// SOUTH WALL RIGHT SIDE
		for(index = 17; index < 30; index++)
		{
			var newTile = { "x": (index * tileWidth), "y": (tileHeight * 15), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// WEST WALL TOP 
		for(index = 3; index < 9; index++)
		{
			var newTile = { "x": (tileWidth * 2), "y": (index * tileHeight), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// WEST WALL BOTTOM 
		for(index = 11; index < 15; index++)
		{
			var newTile = { "x": (tileWidth * 2), "y": (index * tileHeight), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// EAST WALL TOP 
		for(index = 3; index < 9; index++)
		{
			// 30 is two tiles away from the edge (tile 32)
			var newTile = { "x": (tileWidth * 29), "y": (index * tileHeight), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// EAST WALL BOTTOM 
		for(index = 11; index < 15; index++)
		{
			var newTile = { "x": (tileWidth * 29), "y": (index * tileHeight), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// center quad
		var c1 = { "x": (tileWidth * 15), "y": (tileHeight * 9), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
		var c2 = { "x": (tileWidth * 15), "y": (tileHeight * 10), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
		var c3 = { "x": (tileWidth * 16), "y": (tileHeight * 9), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };
		var c4 = { "x": (tileWidth * 16), "y": (tileHeight * 10), "width": tileWidth, "height": tileHeight, "type": "wall", "color": "white" };

		mapData.tiles.push(c1);
		mapData.tiles.push(c2);
		mapData.tiles.push(c3);
		mapData.tiles.push(c4);

		return mapData;
	};

	module.exports.CreateCrucible = function() {
		
		var mapData = { 
			"mapWidthInPixels": mapWidthInPixels, 
			"mapHeightInPixels": mapHeightInPixels, 
			"mapWidthInTiles": mapWidthInTiles, 
			"mapheightInTiles": mapHeightInTiles, 
			"tiles": [] 
		};
		var index = 0;

		for(index = 3; index < 15; index++)
		{
			var newTile = { "x": (tileWidth * 15), "y": (index * tileHeight), 
								 "width": tileWidth, "height": tileHeight, 
								 "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		for(index = 3; index < 16; index++)
		{
			var newTile = { "x": (tileWidth * 15), "y": (index * tileHeight), 
								 "width": tileWidth, "height": tileHeight, 
								 "type": "wall", "color": "white" };
			mapData.tiles.push(newTile);
		}

		// ///////////////////
		// spawning code begin
		var spawnX1 = mapWidthInPixels / 4;			// 1280x760 is our resolution.
		var spawnX2 = (mapWidthInPixels / 4) + (mapWidthInPixels / 2); 
		var spawnY1 = (mapHeightInPixels - 40) / 4;	// 760 / 40 has a remainder. That remainder
		var spawnY2 = ((mapHeightInPixels - 40) / 4) + ((mapHeightInPixels - 40) / 2);	// is screwing up my math.

		var spawnX3 = mapWidthInPixels / 2;
		// var spawnX4 =
		var spawnY3 = (mapHeightInPixels - 40) / 2;
		// var spawnY4 =

		mapData.spawnPoints = [
			{ "name": "spawn1", "x": spawnX1, "y":spawnY1 },
			{ "name": "spawn2", "x": spawnX2, "y":spawnY1 },
			{ "name": "spawn3", "x": spawnX2, "y":spawnY2 },
			{ "name": "spawn4", "x": spawnX1, "y":spawnY2 },
			{ "name": "spawn5", "x": spawnX3, "y":spawnY1 },
			{ "name": "spawn6", "x": spawnX2, "y":spawnY3 },
			{ "name": "spawn7", "x": spawnX3, "y":spawnY2 },
			{ "name": "spawn8", "x": spawnX1, "y":spawnY3 }
		];

		return mapData;
	};

}());