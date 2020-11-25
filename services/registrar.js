
var userProfiles = [];
let UserID = 10000; // user id's start at 10,000 (for now)

(function() {

	module.exports.AddUser = function(accountName, password, alias) {
		const id = UserID;

		console.log("User Details:");
		console.log(`${accountName}, ${password}, ${alias}`);

		// account exists, exit
		if(userProfiles.find(profile => profile.name === accountName))
			return false;

		// it's unique, let's add it.
		const user = {"id": id, "name": accountName, "password": password, "alias": alias};
		console.log("Adding: ");
		console.log(user);
		userProfiles.push(user);
		UserID++;
		return true; // make this return false if the user name is unavailable
	};

module.exports.VerifyUser = function(name, password) {
	
	var user = userProfiles.find(profile => 
		profile.name === name && 
		profile.password === password);
	
	if(user === null)
	{
		return false;
	}
	else
	{
		return true;
	}
};

module.exports.GetUserCredentials = function() {

	console.log("User Profile: ");

	userProfiles.forEach(profile => {
		
		console.log(profile);
	})
};

}());