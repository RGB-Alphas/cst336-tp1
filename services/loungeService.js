
var registry = require('./registrar');

let userList = [];


module.exports = function(socket, client) {

	// var addedUser = false;

	client.on("enter_lounge", (name) => {
		
		console.log("Received: %s", name);
		const alias = registry.GetAliasByUserName(name);
		userList.push(alias);

		// send the player a list of players.
		client.emit('welcome', {
			onlineCount: userList.length,
			onlineUsers: userList
		});

	});
};

(function() {

	module.exports.AddOnlineUser = function(alias) {
		userList.push(alias);
	};

}());