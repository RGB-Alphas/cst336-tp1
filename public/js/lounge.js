$(document).ready(function() {

	var socket = io();

	console.log("Emitting: %s", userName);
	socket.emit('enter_lounge', userName);

	/* SOCKET EVENTS */
	socket.on('lounge_entered', (data) => {
		console.log("Users Online: %d", data.onlineCount);
		
		for(var i = 0; i < data.onlineCount; i++)
		{
			// add these to the html of the user list ( <ul> will be fine ).
			// see david's hw2 if you need to see how he did it (index.html and main.js)
			const id = data.onlineUsers[i].sessionID; // for private messages.
			const alias = data.onlineUsers[i].alias
			console.log("%s", alias);
			//$("#<UL Tag ID").append(
			//	`<li class="users-list-item">${data.onlineUsers[i]}</li>`)
		}

		// we recieve lobbies as lists of lobby names. the user types or clicks the
		// lobby name and clicks a button that will send a socket message
		// to the server asking to join that lobby (names are unique, don't worry).
		// see the lobby creation flow towards the bottom of this page.
		for(var lobbyIndex = 0; lobbyIndex < data.lobbyCount; lobbyIndex++)
		{
			console.log(data.lobbies[lobbyIndex]);
			console.log(data.lobbies[lobbyIndex].name);
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
		const lobbyName = data.name;
		const lobbyID = data.id; // don't show this visibly on the page.
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
			lobbyPassword: $("#lobbyPassword").val()
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