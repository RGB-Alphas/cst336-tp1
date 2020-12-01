var userRegistry = require('./userRegistrar');
var lobbyRegistry = require('./lobbyRegistrar');

module.exports = function(socket, client) {
	client.on("enter_game", function (data) {
		
		// socket.sockets.emit("login_success", data);

		client.on('enter_game', (data) => {
			var userName = data.userName;
			// alias too

			userRegistry.AddUser(userName, "");

			client.join(`${lobbyName}`);

		});

	});
};