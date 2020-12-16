
var userProfiles = [];
var usersOnline = 0;

module.exports = { profiles: userProfiles };
module.exports = { usersOnline: usersOnline };

(function() { 

	module.exports.AddUser = function(name, alias, userId, sessionId) {
		
		var indexOfExistingUser = userProfiles.findIndex(user => user.name === name );

		console.log("Before adding a user: ");
		console.log(userProfiles);

		if(indexOfExistingUser === -1) // user doesn't exist. we add them.
		{
			console.log(`Adding new user: ${name} with alias: ${alias}.`)
			const entry = { "name": name, "alias": alias, "userId": userId, "sessionId": sessionId };
			userProfiles.push(entry);
			usersOnline++;

			console.log("After adding a user: ");
			console.log(userProfiles);

			return true;
		}

		console.log("Add failed.");
		return false;
	};

	module.exports.RemoveUser = function(name) {

		var indexOfExistingUser = userProfiles.findIndex(user => user.name === name );

		console.log("Before removing a user: ");
		console.log(userProfiles);

		if(indexOfExistingUser === -1)
		{
			return false;
		}

		userProfiles.splice(indexOfExistingUser, 1);
		usersOnline--;
		console.log(`${name} is now logged out.`);

		console.log("After removing a user: ");
		console.log(userProfiles);
		return true;
	}

	module.exports.IsOnline = function(name) {
		
		for(var i = 0; i < userProfiles.length; i++)
		{
			// console.log(`Checking ${name} against ${userProfiles[i].name}'s profile`)
			if(userProfiles[i].name === name)
			{
				console.log("User is already online.");
				return true;
			}
				
		}

		console.log("No one else is online.");
		return false;
	};

	module.exports.GetAliasByUserName = function(userName) {

		for(var i = 0; i < usersOnline; i++)
		{
			var profileName = userProfiles[i].name;
			if(profileName === userName)
				return userProfiles[i].alias;
		}
		return "Unknown Alias";
	};

	module.exports.GetUserID = function(userName) {
		var userIndex = userProfiles.findIndex(profile => profile.name === userName);

		if(userIndex === -1)
			return false;

		return userProfiles[userIndex].userId;
	}

	module.exports.GetUsers = function() {
		return userProfiles;
	};

	module.exports.GetUserCount = function() {
		return usersOnline;
	}

}());