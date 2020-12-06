var userRegistry = require('./userRegistrar');
var gameSessionManager = require('./gameSession');

module.exports = function(socket, client) {
	client.on("enter_game", function (data) {
		
		// socket.sockets.emit("login_success", data);

		client.on('enter_game', (data) => {
			var userName = data.userName;
			var alias = data.alias;

			userRegistry.AddUser(userName, alias);

			

			

			client.join(`${lobbyName}`);

		});

	});
};