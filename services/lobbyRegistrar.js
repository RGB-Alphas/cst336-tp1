

// This data does not need to exist in a database.
// only users (for now at least).


var lobbyList = [
	{ "id": 996, "name": "lobby1", "password": "123", "occupants": 1, "capacity": 1, "players": [ { "name:": "Dummy1", "isReady": false } ],
      "options": {
         "map": "destiny", "time": "30", "ruleset": "lastman" }
   	},
	{ "id": 997, "name": "lobby2", "password": "123", "occupants": 1, "capacity": 2, "players": [ { "name:": "Dummy1", "isReady": false } ],
		"options": {
			"map": "destiny", "time": "30", "ruleset": "lastman" }
		},
	{ "id": 998, "name": "lobby3", "password": "", "occupants": 1, "capacity": 4, "players": [ { "name:": "Dummy1", "isReady": false } ],
		"options": {
			"map": "destiny", "time": "30", "ruleset": "lastman" }
		},
	{ "id": 999, "name": "lobby4", "password": "", "occupants": 1, "capacity": 8, "players": [ { "name:": "Dummy1", "isReady": false } ],
		"options": {
			"map": "destiny", "time": "30", "ruleset": "lastman" }
		},
];
var lobbyCount = lobbyList.length;
let LobbyID = 1000; // user id's start at 1,000 (for now)

module.exports = { lobbies: lobbyList };
module.exports = { lobbyCount: lobbyCount };
module.exports = { LobbyID: LobbyID };

(function() {

	module.exports.WhereisPlayer = function(name)
	{
		
		for(var i = 0; i < lobbyList.length; i++)
		{
			var lobby = lobbyList[i];
			var players = lobby.players;
			for(var j = 0; j < lobby.occupants; j++)
			{
				//console.log(`Comparing (${name} === ${players[j]})`);
				if(name === players[j].name)
				{
					//console.log("match found!");
					return lobby.name;
				}
			}
		}

		var lobbyErrorText = `unknown`;
		return lobbyErrorText;
	};

	// Adds a lobby to the lobby registry.
	// name = lobby name
	// password = lobby password
	module.exports.AddLobby = function(name, password, playerCapacity) {

		// lobby exists, exit
		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === name);
		if(lobbyIndex != -1)
			return false;

		// it's unique, let's add it.
		var id = LobbyID;

		const lobby = {"id": id, "name": name, "password": password, "occupants": 0, "capacity": playerCapacity,
			"players": [],
			"options": {
			"map": "destiny", "time": "30", "ruleset": "lastman" }};
	
		console.log(`Adding lobby: ${lobby.id}, ${lobby.name}, ${lobby.password}`);
		lobbyList.push(lobby);
		lobbyCount++;
		LobbyID++;
		return true; // make this return false if the lobby name is unavailable
	};

	/*
	module.exports.UpdateLobbyOptions = function(lobbyName, map, time, ruleset) {

		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		lobbyList[lobbyIndex].options.map = map;
		lobbyList[lobbyIndex].options.time = time;
		lobbyList[lobbyIndex].options.ruleset = ruleset;
	}
	*/

	module.exports.WhoIsNotReady = function(lobbyName)
	{
		var lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);
		// var players = lobbyList[lobbyIndex].players;

		if(lobbyIndex === -1)
			return [];

		var playerCount = lobbyList[lobbyIndex].occupants;

		unreadyPlayers = [];

		for(var i = 0; i < playerCount; i++)
		{
			if(!lobbyList[lobbyIndex].players[i].isReady)
				unreadyPlayers.push(lobbyList[lobbyIndex].players[i].name);
		}

		console.log(JSON.stringify(unreadyPlayers));

		return unreadyPlayers;
	};

	module.exports.SetPlayerReadyState = function(lobbyName, alias, state) {
		var lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		if(lobbyIndex === -1)
			return;

		var playerIndex = lobbyList[lobbyIndex].players.findIndex(player => player.name === alias);

		lobbyList[lobbyIndex].players[playerIndex].isReady = state;

		console.log(`${lobbyList[lobbyIndex].name}'s ${lobbyList[lobbyIndex].players[playerIndex].name} is set to ${lobbyList[lobbyIndex].players[playerIndex].isReady}`);
	};

	module.exports.UpdateLobbyMap = function(lobbyName, map) {
		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		if(lobbyIndex === -1)
			return;

		lobbyList[lobbyIndex].options.map = map;
	};

	module.exports.UpdateLobbyTime = function(lobbyName, time) {
		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		if(lobbyIndex === -1)
			return;

		lobbyList[lobbyIndex].options.time = time;
	};

	module.exports.UpdateLobbyRuleSet = function(lobbyName, ruleset) {
		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		if(lobbyIndex === -1)
			return;

		lobbyList[lobbyIndex].options.ruleset = ruleset;
	};

	module.exports.ExitPlayerFromLobby = function(lobbyName, alias) {
		const lobbyIndex = lobbyList.findIndex(lobby => lobby.name === lobbyName);

		if(lobbyIndex === -1)
			return;
		const playerIndex = lobbyList[lobbyIndex].players.findIndex(player => player.name === alias);
		lobbyList[lobbyIndex].players.splice(playerIndex, 1);
		lobbyList[lobbyIndex].occupants--;

		// example splice() from socket disconnect event
		// userList.splice(userList.indexOf(client.username), 1);
	};

	// returns true if the player name was registered to the lobby.
	// returns false if the player name could not be added.
	module.exports.JoinLobby = function(lobbyName, playerName) {

		// if the lobby doesn't exist, exit.
		const lobbyIndex = lobbyList.findIndex(lobby => { return lobby.name === lobbyName } );

		if(lobbyIndex === -1)
		{
			console.log("Can not add player to lobby: Lobby not found.");
			return false
		}

		var current = lobbyList[lobbyIndex].occupants;
		var capacity = lobbyList[lobbyIndex].capacity;

		if(current < capacity)
		{
			console.log(`Adding ${playerName} to lobby: ${lobbyName}.`);
			lobbyList[lobbyIndex].players.push( { "name": playerName, "isReady": false } );
			lobbyList[lobbyIndex].occupants++;
			return true;
		}
		else
		{
			console.log(`Could not add ${playerName} to lobby: ${lobbyName}.`);
			return false;
		}
			
	};

	module.exports.RemoveLobbyIfEmpty = function(lobbyName) {
		const lobbyIndex = lobbyList.findIndex(lobby => { return lobby.name === lobbyName } );

		if(lobbyIndex === -1)
			return false;

		if(lobbyList[lobbyIndex].players.length === 0)
			lobbyList.splice(lobbyIndex, 1);

		return true;
	};

	module.exports.SetLobbyOptions = function(lobbyName, options) {
		var index = lobbyList.indexOf(lobbyName);
		lobbyList[index].options = options;
	};

	module.exports.PasswordRequiredFor = function(lobbyName) {
		var lobby = lobbyList.find(L => { return L.name === lobbyName });

		console.log(`Checking if '${lobbyName}' requires a password`);

		if(!lobby) {
			console.log("Lobby not found. :(");
			return false;
		}

		if(lobby.password === "") {
			console.log("It does not.")
			return false;
		}
		else {
			console.log("It does.")
			return true;
		}
	};

	module.exports.Authenticate = function(name, password) {
		
		var lobby = lobbyList.find(L => { return L.name === name });
		
		if(lobby)
		{
			console.log(`Lobby password: [${lobby.password}] vs user password: [${password}]`);
			if(lobby.password === password)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	};

	module.exports.GetLobbyID = function(lobbyName) {
		var lobby = lobbyList.find(lobby => { 
			return lobby.name === lobbyName }) || {}.execs || [];
		if(lobby === null) {
			return -1;
		} else {
			return lobby.id;
		}
	};

	module.exports.GetLobbyByName = function(lobbyName) {
		var lobby = lobbyList.find(lobby => { 
			return lobby.name === lobbyName }); // || {}.execs || [];
		return lobby;
	};

	module.exports.UpdateLobbyPlayers = function(lobbyName, lobby) {
		const name = lobby.name;
		const id = lobby.id;
		var lobbyIndex = lobbyList.findIndex((element => element.name === lobbyName));

		if(lobbyIndex === -1)
			return [];

		lobbyList[lobbyIndex].players = lobby.players;
		lobbyList[lobbyIndex].occupants = lobby.players.length;
	};

	/*
	module.exports.UpdateLobbyOptions = function(lobbyName, lobby) {
		const name = lobby.name;
		const id = lobby.id;
		var index = lobbyList.findIndex((element => element.name === lobbyName));
		lobbyList[index].options = lobby.options;
	};
	*/

	module.exports.GetAllLobbies = function() {
		return lobbyList.map(lobby => { return { id: lobby.id, name: lobby.name, occupants: lobby.occupants, capacity: lobby.capacity, players: lobby.players, options: lobby.options  }} );
	};

	module.exports.GetLobbyCount = function() {
		return lobbyList.length;
	}

}());