/* global $ */
/* global io */

$(document).ready(function() {

	var socket = io();

	var input = document.getElementById("messageInput")

	// keep this stuff updated via socket events and append it to our UI.
	// var users = [];
	// var userCount = 0;
	var lobbies = [];
	var lobbyCount = 0;
	var skinId = 0;
	var maxSkinId = 13;
	var skins = {0: "blue",
				 1: "lightblue",
				 2: "steelblue",
				 3: "turquoise", 
				 4: "green", 
				 5: "lime", 
				 6: "yellow", 
				 7: "orange", 
				 8: "rosybrown", 
				 9: "red", 
				 10: "maroon",
				 11: "purple",
				 12: "lavender", 
				 13: "pink"};

	var selectedLobby = "";
	var selectedPlayer = "";

	console.log("Emitting: %s, %s", userName, displayName);
	socket.emit('enter_lounge', { userName: userName, alias: displayName } );

	/* SOCKET EVENTS */
	socket.on('lounge_entered', (data) => {
		// console.log("Users Online: %d", data.onlineCount);

		var users = data.onlineUsers;
		var userCount = data.onlineCount;
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
				`<li id="${alias}" class="player list-item">${alias}</li>`);
			
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
				`<li id="${name}" class="lobby list-item lobby-link my-1 rounded"><i class="fas fa-users pr-1"></i> ${name} (${occupants}/${capacity}) - Host: ${host}</li>`)
		}
		
		// a 2nd onclick listener is added for each new lobby as well. 
		$('#lobbyList').on("click", '.lobby', function (e) {
			
			selectedLobby = this.id;
			$("#inputLobbyName").val(selectedLobby);
			// we are using dynamic html. the click event needs to go here (defined after the page loaded)
			socket.emit('join_lobby_request', {
				lobbyName: this.id
			});
			console.log(this.id);
		 });

		 $('#playerList').on("click", '.player', function (e) {
		 
			selectedPlayer = this.id;
			socket.emit('private message', {
				alias: this.id
			});
			console.log(this.id);
		 });
	});

	socket.on('password_required', () => {
		$("#joinLobbyDialogValidation").html("Password Required");
		$("#joinLobbyDialogValidation").css("color", "red");
	});

	socket.on('join_lobby_request_rejected', () => {
		$("#joinLobbyDialogValidation").html("Unable to join.");
		$("#joinLobbyDialogValidation").css("color", "red");
		console.log("Join unsuccessful.");
	});

	socket.on('join_lobby_request_accepted', () => {
		console.log("Join Success. Moving to the lobby.");
		window.location = `/lobby?lobbyName=${selectedLobby}`;
		// $("#joinLobbyForm").submit();
	});

	$("#joinLobby").on("click", function() {

		var password = $("#inputLobbyPassword").val();

		socket.emit('join_lobby_with_password', {
			lobbyName: selectedLobby,
			lobbyPassword: password
		});
	});

	socket.on('user joined', (data) => {
		const alias = data.userAlias;
		var userCount = data.onlineCount;
		//console.log(data.userAlias + ' joined');
		//console.log("%d users online.", data.onlineCount);

		$("#playerListHeading").html(`Users: ${userCount}`);
		$("#playerList").append(
			`<li id="${alias}" class="player list-item">${alias}</li>`);
		$("#messageList").append(
			`<li id="${alias}" class="player list-item">${alias} has joined.</li>`);

		/*
		$('#playerList').on("click", '.player', function (e) {
		
			socket.emit('private message', {
				alias: this.id
			});
			console.log(this.id);
			});
		*/
	});

	socket.on('user left', (data) => {
		const alias = data.alias;
		var userCount = data.onlineCount;
		var users = data.onlineUsers;
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
				`<li class="player list-item">${users[i].alias}</li>`);
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

	socket.on('typing', (data) => {
		$("#typingNotice").html(`${data.alias} is typing...`)
		//console.log("%s is typing", alias);
	});

	socket.on('stop typing', (data) => {
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
			`<li id="${name}" class="lobby list-item lobby-link my-1 rounded"><i class="fas fa-users pr-1"></i> ${name} (${occupants}/${capacity}) - Host: ${host}</li>`)
		$("#messageList").append(
			`<li id="${name}" class="lobby list-item">${host} has created a new lobby.</li>`);
			let newLobby = { "id": id, "name": name, "capacity": capacity };
		lobbies.push(newLobby);
		console.log(`${host} has created a lobby: ${name}`);

		/* Redundant, can delete
		$('#lobbyList').on("click", '.lobby', function (e) {
			
			// we are using dynamic html. the click event needs to go here (defined after the page loaded)
			socket.emit('join_lobby_request', {
				lobbyName: this.id
			});
			console.log(this.id);
		 });
		 */
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
		$("#createlobbyForm").submit();
	});

	// lobby creation didn't happen. show span text on the create-lobby dialogue.
	socket.on('lobby-add-request-denied', () => {
		$("#createLobbyDialogValidation").html("Lobby name unavailable.");
		$("#createLobbyDialogValidation").css("color", "red");
	});

	// item clicking events end
	// ////////////////////////

	/***** Loung Panels *****/
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
	
	// Toggle Create Tab
	$("#createBtn").on("click", function(){
		console.log("join btn clicked");
		$("#chatPanel").hide();
		$("#profilePanel").hide();
		$("#joinPanel").hide();
		$("#createPanel").show();
	})
	
	// Close Create tab, return to chat
	$(".close-button").on("click", function(){
		$("#createPanel").hide();
		$("#chatPanel").show();
	})
	
	// Toggle Chat Tab
	$("#chatBtn").on("click", function(){
		console.log("chat btn clicked");
		$("#createPanel").hide();
		$("#profilePanel").hide();
		$("#joinPanel").hide();
		$("#chatPanel").show();
	})
	
	// Toggle Join Lobby Tab
	$("#joinBtn").on("click", function(){
		console.log("chat btn clicked");
		$("#profilePanel").hide();
		$("#createPanel").hide();
		$("#chatPanel").hide();
		$("#joinPanel").show();
	})
	
	// Toggle Profile Tab
	$("#profileBtn").on("click", function(){
		console.log("chat btn clicked");
		$("#createPanel").hide();
		$("#chatPanel").hide();
		$("#joinPanel").hide();
		$("#profilePanel").show();
		updateSelector();
	})
	
	// Skin Selection - Right Arrow
	$("#rightArrow").on("click", function(){
		console.log(skins.count);
		if(skinId == maxSkinId){
			skinId = 0;
		}
		else{
			skinId += 1;
		}
		updateSelector();
	})
	
	// Skin Selection - Left Arrow
	$("#leftArrow").on("click", function(){
		if(skinId == 0){
			skinId = maxSkinId;
		}
		else{
			skinId -= 1;
		}
		updateSelector();
	})
	
	// Update skin selector icon
	function updateSelector(){
		$("#skinSelect").css("color", skins[skinId]);
	}
});