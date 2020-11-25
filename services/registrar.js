
var userProfiles = [];
let UserID = 10000; // user id's start at 10,000 (for now)

function AddUser(accountName, password, alias) {
	id = UserID++;
	const user = { id, accountName, password, alias };
	userProfiles.push(user);
	UserID++;
}

function VerifyUser(name, password) {
	
	userProfiles.forEach(user => {
		if(user.name === name && user.password === password) {
			return true;
		}
	});

}