

// This data does not need to exist in a database.
// only users (for now at least).


var lobbyList = [
	{ "id": 996, "name": "lobby1", "password": "123", },
	{ "id": 997, "name": "lobby2", "password": "123", },
	{ "id": 998, "name": "lobby3", "password": "123", },
	{ "id": 999, "name": "lobby4", "password": "123", }
];
var lobbyCount = lobbyList.length;
let LobbyID = 1000; // user id's start at 1,000 (for now)

module.exports = { lobbies: lobbyList };
module.exports = { lobbyCount: lobbyCount };

(function() {

	module.exports.AddLobby = function(name, password) {

		// lobby exists, exit
		if(lobbyList.find(lobby => lobby.name === name))
			return false;

		console.log(`Adding lobby: ${name}, ${password}`);

		// it's unique, let's add it.
		const lobby = {"id": id, "name": name, "password": password};
		lobbyList.push(lobby);
		lobbyCount++;
		LobbyID++;
		return true; // make this return false if the user name is unavailable
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
	return lobbyList.map(lobby => { lobby.id, lobby.name } );
};

/*
module.exports.GetAliasByUserName = function(userName) {

	var user = lobbyList.find(profile => 
		profile.name === userName);
	
	if(user === undefined)
	{
		return "Unknown Player";
	}
	else
	{
		console.log(user);
		return user.alias;
	}
};

module.exports.GetUserCredentials = function() {

	console.log("User Profile: ");

	lobbyList.forEach(profile => {
		
		console.log(profile);
	})
};
*/

}());