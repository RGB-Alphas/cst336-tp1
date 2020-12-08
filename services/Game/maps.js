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


var tileWidth = 40;
var tileHeight = 40;
var mapWidth = 32;
var mapheight = 19;

(function() {

	module.exports.CreateMap = function(mapName) {
		switch (mapName) {
			case "destiny":
				CreateDestiny();
				break;

			case "crucible":
				CreateCrucible();
				break;

			case "icefortress":
				CreateIceFortress();
			default:
				return [];
				break;
		}
	};

	module.exports.CreateDestiny = function() {

		var mapData = { "mapWidth": 32, "mapheight": 19, "tiles": [] };
		var index = 0;

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

}());