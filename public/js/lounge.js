$(document).ready(function() {

	var socket = io();

	// keep this stuff updated via socket events and append it to our UI.
	var users = [];
	var userCount = 0;
	var lobbies = [];
	var lobbyCount = 0;

	console.log("Emitting: %s", userName);
	socket.emit('enter_lounge', userName);

	/* SOCKET EVENTS */
	socket.on('lounge_entered', (data) => {
		console.log("Users Online: %d", data.onlineCount);

		users = data.onlineUsers;
		userCount = data.onlineCount;
		lobbies = data.lobbies;
		lobbyCount = data.lobbyCount;
		
		for(var i = 0; i < data.onlineCount; i++)
		{
			// add these to the html of the user list ( <ul> will be fine ).
			// see david's hw2 if you need to see how he did it (index.html and main.js)
			const id = data.onlineUsers[i].sessionID; // for private messages.
			const alias = data.onlineUsers[i].alias;
			console.log("%s", alias);
			
		}

		// we recieve lobbies as lists of lobby names. the user types or clicks the
		// lobby name and clicks a button that will send a socket message
		// to the server asking to join that lobby (names are unique, don't worry).
		// see the lobby creation flow towards the bottom of this page.

		for(var lobbyIndex = 0; lobbyIndex < data.lobbyCount; lobbyIndex++)
		{
			var id = data.lobbies[lobbyIndex].id;
			var name = data.lobbies[lobbyIndex].name;
			var occupants = data.lobbies[lobbyIndex].occupants;
			var capacity = data.lobbies[lobbyIndex].capacity;
			console.log("Adding Lobby: %s", name);
			$("#lobbyList").append(
				`<li>${name} (${occupants}/${capacity})</li>`)
		}
	});

	socket.on('user joined', (data) => {
		console.log(data.userAlias + ' joined');
		console.log("%d users online.", data.onlineCount);
	});

	socket.on('user left', (data) => {
		console.log('User %s has left.', data.alias);
		console.log('%d users online.', data.onlineCount);
		console.log("Online users:");
		for(i = 0; i < data.onlineUsers.length; i++)
		{
			console.log(data.onlineUsers[i].alias);
		}
	});

	// ///////////
	// chat events

	socket.on('typing', (alias) => {
		console.log("%s is typing", alias);
	});

	socket.on('stop typing', (alias) => {
		console.log("%s stopped typing", alias);
	});

	socket.on('new message', (data) => {

		const alias = data.alias;
		const message = data.message;
		console.log("%s: %s", alias, message);
	})

	// chat events end
	// ///////////////

	// ////////////
	// lobby events
	socket.on('lobby created', (data) => {
		var id = data.id; // dont show this but save it.
		var name = data.name;
		var occupants = data.occupants;
		var capacity = data.capacity;
		var host = data.players[0];
		console.log("Adding Lobby: %s", name);
		$("#lobbyList").append(
			`<li>${name} (${occupants}/${capacity}) - Host: ${host}</li>`);
		newLobby = { "id": id, "name": name, "capacity": capacity };
		lobbies.push(newLobby);
		console.log(`${host} has created a lobby: ${name}`);
	});

	socket.on('lobby destroyed', (data) => {
		const lobbies = data.name;
		const lobbyCount = data.id; // don't show this visibly on the page.
	});


	// ///////////////////////
	// Create lobby flow Begin

	// emit a request to add lobby, act on response.
	$("#createButton").click(function(){
		socket.emit('lobby-add-request', {
			lobbyName: $("#lobbyName").val(),
			lobbyPassword: $("#lobbyPassword").val(),
			lobbyCapacity: $("#lobbyCapacity").val()
		});
		
	});

	// our lobby was accepted.
	socket.on('lobby-add-request-accepted', () => {
		console.log("Lobby: %s created successfully.", $("#lobbyName").val());
		// submit the form and we will go to the next page to wait for players.
		$("#lobbyForm").submit();
	});

	// lobby creation didn't happen. show span text on the create-lobby dialogue.
	socket.on('lobby-add-request-denied', () => {
		$("#lobbyDialogValidation").html("Lobby name unavailable.");
		$("#lobbyDialogValidation").css("color", "red");
	});

	// create lobby flow end
	// /////////////////////

	// ///////////////////
	// dialogue flow begin
	$('a.dialog-link').click(function() {
		var dialog_id = $(this).attr('data-selector');
		$('#dialog-overlay').fadeIn(200);
		$(dialog_id).fadeIn(200);
		$(dialog_id).css({ 
			 'margin-top' : -($(dialog_id).height() + 4) / 2,
			 'margin-left' : -($(dialog_id).width() + 4) / 2
		});
		return false;
	});

	$('.dialog-popup a.close, #dialog-overlay').click(function() { 
		$('.dialog-popup').fadeOut(200);
		$('#dialog-overlay').fadeOut(200);
		return false;
	});

	// dialogue end
	// ////////////
});