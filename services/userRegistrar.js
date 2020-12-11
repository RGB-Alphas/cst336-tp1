
var userProfiles = [];
var usersOnline = 0;

module.exports = { profiles: userProfiles };
module.exports = { usersOnline: usersOnline };

(function() { 

	module.exports.AddUser = function(name, alias, userId, sessionId) {
		
		var indexOfExistingUser = userProfiles.findIndex(user => user.name === name);

		if(indexOfExistingUser === -1) // user doesn't exist. we add them.
		{
			console.log(`Adding new user: ${name} with alias: ${alias}.`)
			const entry = { "name": name, "alias": alias, "userId": userId, "sessionId": sessionId };
			userProfiles.push(entry);
			usersOnline++;

			return true;
		}

		return false;
	};

	module.exports.RemoveUser = function(name) {

		var indexOfExistingUser = userProfiles.findIndex(profile => { return profile.name === name });

		if(indexOfExistingUser >= 0)
		{
			userProfiles.splice(indexOfExistingUser, 1);
			usersOnline--;
			console.log(`${name} is now logged out.`);
			return true;
		}

		console.log(`${name} can not be logged out because this person does not exist.`);
		return false;
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

	module.exports.GetUsers = function() {
		return userProfiles;
	};

	module.exports.GetUserCount = function() {
		return usersOnline;
	}

}());