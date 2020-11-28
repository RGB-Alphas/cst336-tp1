/* global $ */
/* global io */


$(document).ready(function() {

	var socket = io();

	var input = document.getElementById("messageInput")

	// keep this stuff updated via socket events and append it to our UI.
	var users = [];
	var userCount = 0;
	var lobbies = [];
	var lobbyCount = 0;

	console.log("Emitting: %s", userName);
	socket.emit('enter_lounge', userName);

	/* SOCKET EVENTS */
	socket.on('lounge_entered', (data) => {
		// console.log("Users Online: %d", data.onlineCount);

		users = data.onlineUsers;
		userCount = data.onlineCount;
		lobbies = data.lobbies;
		lobbyCount = data.lobbyCount;
		
		$("#playerListHeading").html(`Users: ${userCount}`);
		$("#playerList").empty();
		for(var i = 0; i < userCount; i++)
		{
			// add these to the html of the user list ( <ul> will be fine ).
			// see david's hw2 if you need to see how he did it (index.html and main.js)
			const id = users[i].sessionID; // for private messages.
			const alias = users[i].alias;
			$("#playerList").append(
				`<li class="list-item">${alias}</li>`);
			
		}

		// we recieve lobbies as lists of lobby names. the user types or clicks the
		// lobby name and clicks a button that will send a socket message
		// to the server asking to join that lobby (names are unique, don't worry).
		// see the lobby creation flow towards the bottom of this page.

		for(var lobbyIndex = 0; lobbyIndex < lobbyCount; lobbyIndex++)
		{
			var id = lobbies[lobbyIndex].id;
			var name = lobbies[lobbyIndex].name;
			var occupants = lobbies[lobbyIndex].occupants;
			var capacity = lobbies[lobbyIndex].capacity;
			var players = lobbies[lobbyIndex].players;
			var host = players[0];
			// console.log("Adding Lobby: %s", name);
			$("#lobbyList").append(
				`<li class="list-item"><a href="/lobby?lobbyName=${name}">${name} (${occupants}/${capacity}) - Host: ${host}</a></li>`)
		}
	});

	socket.on('user joined', (data) => {
		const alias = data.userAlias;
		userCount = data.onlineCount;
		//console.log(data.userAlias + ' joined');
		//console.log("%d users online.", data.onlineCount);

		$("#playerListHeading").html(`Users: ${userCount}`);
		$("#playerList").append(
			`<li class="list-item">${alias}</li>`);
		$("#messageList").append(
			`<li class="list-item">${alias} has joined.</li>`);
	});

	socket.on('user left', (data) => {
		const alias = data.alias;
		userCount = data.onlineCount;
		users = data.onlineUsers;
		//console.log('User %s has left.', data.alias);
		//console.log('%d users online.', data.userCount);
		//console.log("Online users:");
		
		$("#playerListHeading").html(`Users: ${userCount}`);
		$("#messageList").append(
			`<li class="list-item">${alias} has left.</li>`);
		$("#playerList").empty();
		for(i = 0; i < userCount; i++)
		{
			$("#playerList").append(
				`<li class="list-item">${users[i].alias}</li>`);
		}
	});

	// /////////////////
	// chat events begin

	input.addEventListener("keyup", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
		  // Cancel the default action, if needed
		  event.preventDefault();
		  // Trigger the button element with a click
		  $("#messageSend").click();
		}
		
	});

	$("#messageInput").on('input', function() {
		var message = $("#messageInput").val();
		var isTyping = false;

		if(message !== "" && !isTyping) {
			socket.emit('typing');
			isTyping = true;
		} else {
			socket.emit('stop typing');
			isTyping = false;
		}
	});

	socket.on('typing', (alias) => {
		$("#typingNotice").html(`${alias} is typing...`)
		//console.log("%s is typing", alias);
	});

	socket.on('stop typing', (alias) => {
		$("#typingNotice").html("")
		//console.log("%s stopped typing", alias);
	});

	socket.on('new message', (data) => {
		const alias = data.alias;
		const message = data.message;
		
		var avatar = document.createElement("img");
		avatar.setAttribute("src", "../img/avatar-male.jpg");
		avatar.setAttribute("class", "avatar-margin");
		avatar.setAttribute("alt", "avatar");
		avatar.setAttribute("width", "25px");
		avatar.setAttribute("height", "25px");

		var span = document.createElement("span");
		// span.setAttribute("class", "app-message-received");
		span.append(`${alias}: ${message}`);

		var div = document.createElement("div");
		div.append(avatar);
		div.append(span);

		var item = document.createElement("li");
		item.setAttribute("class", "list-item");
		item.append(div);

		$("#messageList").append(item);
	})

	// chat events end
	// ///////////////

	// ////////////////////
	// chat functions begin
	$("#messageSend").click( function() {
		var message = $("#messageInput").val(); // get message
		$("#messageInput").val("");
		socket.emit('stop typing');

		if(message == "")
			return;

		socket.emit('new message', message);

		var avatar = document.createElement("img");
		avatar.setAttribute("src", "../img/avatar-male.jpg");
		avatar.setAttribute("class", "avatar-margin");
		avatar.setAttribute("alt", "avatar");
		avatar.setAttribute("width", "25px");
		avatar.setAttribute("height", "25px");

		var span = document.createElement("span");
		// span.setAttribute("class", "app-message-sent");
		span.append(message);

		var div = document.createElement("div");
		// div.setAttribute("class", "sent-message-wrapper");
		div.append(avatar);
		div.append(span);

		var item = document.createElement("li");
		item.setAttribute("class", "list-item");
		item.append(div);

		$("#messageList").append(item);
	});

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
			`<li class="list-item"><a href="/lobby?lobbyName=${name}">${name} (${occupants}/${capacity}) - Host: ${host}</a></li>`);
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
	
	$("#createBtn").on("click", function(){
		console.log("join btn clicked");
		$("#chatPanel").hide();
		$("#createPanel").show();
	})

	$("#chatBtn").on("click", function(){
		console.log("chat btn clicked");
		$("#createPanel").hide();
		$("#chatPanel").show();
	})
	
	$(".close-button").on("click", function(){
		console.log("chat btn clicked");
		$("#createPanel").hide();
		$("#chatPanel").show();
	})

	// dialogue end
	// ////////////
});