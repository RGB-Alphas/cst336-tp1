
const mysql = require('mysql');

// Add this to any file that needs DB support
// var sql = require('./services/mysqlService');

// app.js has it already but lobbyRegistrar needs it for server Stats.
// lobbyRegistrar has a function for removing empty lobbies. stats can be grabbed there.
// there should be / will be a variable to tell if a game session has started. If that is set
// to true then stats should be collected, otherwise this is a lobby that was never played.
// userRegistrar has a function for players logging in and out.

var connection;

module.exports = { MySQLConnection: connection };


(function() {

	module.exports.Connect = function() {
		connection = mysql.createConnection({
			host: process.env.Host,
			user: process.env.User,
			password: process.env.Password,
			database: process.env.Database
		  });

		connection.connect((err) => {
		if(err){
				console.log('Error connection to DB');
				return;
		}
		console.log('Connected!');
		});


	};

}());