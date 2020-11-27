

// This data does not need to exist in a database.
// only users (for now at least).


var lobbyList = [
	{ "id": 996, "name": "lobby1", "password": "123", "occupants": 0, "capacity": 0, "players": [ "Generic Host" ] },
	{ "id": 997, "name": "lobby2", "password": "123", "occupants": 0, "capacity": 0, "players": [ "Generic Host" ] },
	{ "id": 998, "name": "lobby3", "password": "123", "occupants": 0, "capacity": 0, "players": [ "Generic Host" ] },
	{ "id": 999, "name": "lobby4", "password": "123", "occupants": 0, "capacity": 0, "players": [ "Generic Host" ] }
];
var lobbyCount = lobbyList.length;
let LobbyID = 1000; // user id's start at 1,000 (for now)

module.exports = { lobbies: lobbyList };
module.exports = { lobbyCount: lobbyCount };

(function() {

	// Adds a lobby to the lobby registry.
	// name = lobby name
	// password = lobby password
	module.exports.AddLobby = function(name, password, hostAlias, playerCapacity) {

		// lobby exists, exit
		if(lobbyList.find(lobby => lobby.name === name))
			return false;

		// it's unique, let's add it.
		var id = LobbyID;
		var players = [ hostAlias ];
		const lobby = {"id": id, "name": name, "password": password, "players": players};
		console.log(`Adding lobby: ${lobby.id}, ${lobby.name}, ${lobby.password}`);
		lobbyList.push(lobby);
		lobbyCount++;
		LobbyID++;
		return true; // make this return false if the user name is unavailable
	};

	// returns true if the player name was registered to the lobby.
	// returns false if the player name could not be added.
	module.exports.JoinLobby = function(lobbyName, playerName) {

		// if the lobby doesn't exist, exit.
		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		var current = lobbyList[lobbyIndex].occupants;
		var capacity = lobbyList[lobbyIndex].capacity;

		if(current < capacity)
			lobbyList[lobbyIndex].push(playerName);
	};

	module.exports.Authenticate = function(name, password) {
		
		var lobby = lobbyList.find(lobby => 
			lobby.name === name && 
			lobby.password === password);
		
		if(lobby === null)
		{
			return false;
		}
		else
		{
			return true;
		}
	};

	module.exports.GetLobbyID = function(name) {
		var lobby = lobbyList.find(lobby =>
			lobby.name === name);
		if(lobby === null) {
			return -1;
		} else {
			return lobby.id;
		}
	};

	module.exports.GetAllLobbies = function() {
		return lobbyList.map(lobby => { return { id: lobby.id, name: lobby.name, occupants: lobby.occupants, capacity: lobby.capacity, players: lobby.players  }} );
	};

	module.exports.GetLobbyCount = function() {
		return lobbyList.length;
	}

}());