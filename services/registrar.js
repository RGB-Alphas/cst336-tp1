
var userProfiles = [];
let UserID = 10000; // user id's start at 10,000 (for now)

(function() {

	module.exports.AddUser = function(accountName, password, alias) {
		id = UserID++;
		const user = { id, accountName, password, alias };
		userProfiles.push(user);
		UserID++;
		return true; // make this return false if the user name is unavailable
	};

module.exports.VerifyUser = function(name, password) {
	
	userProfiles.forEach(user => {
		if(user.name === name && user.password === password) {
		return true;
	}});
	return false;
};
}());