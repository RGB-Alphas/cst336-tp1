/* global $ */
/* global io */

$(document).ready(function() {
	
	var socket = io();
	var input = document.getElementById("messageInput")

	var myAlias = "";

	var isHost = false;

	socket.emit("enter_lobby", {
		lobbyName: lobbyName,
		userName: userName,
		alias: displayName,
		userId: userId
	});

	socket.on('lobby_entered', (data) => {
		var playerCount = data.playerCount;
		var players = data.players;
		var options = data.options;
		myAlias = data.myAlias;

		var currentHost = players[0];

		$("#map").val(options.map);
		$("#timeLimit").val(options.time);
		$("#ruleSet").val(options.ruleset);

		if(currentHost === myAlias)
		{
			console.log("options should be enabled.");
			enableOptions();
			isHost = true;
		}
		else
		{
			console.log("options should be disabled.");
			disableOptions();
			isHost = false;
		}


		console.log(playerCount);
		console.log(JSON.stringify(players))
		console.log(JSON.stringify(options));
		// console.log("Lobby Name: lo")

		$("#messageList").append(`<li>${currentHost} is the host.</li>`);

		$("#playerListHeading").html(`Users: (${playerCount})`);
		$("#playerList").empty();
		for(i = 0; i < playerCount; i++)
		{
			$("#playerList").append(
				`<li>${players[i]}</li>`
			)
		}
		
	});

	// when a user tries to back-button his way to the lobby (out of the game)
	socket.on('redirect user home', () => {
		window.location.href = "/authenticated";
	});

	// starting the game

	$("#startBtn").on('click', function(e) {
		e.preventDefault();

		if(isHost)
			socket.emit('ready check');
	});

	socket.on('ready check success', () => {
		window.location.href = '/game';
	});

	socket.on('ready check failed', (data) => {
		var players = data.players.join(", ");
		$("#messageList").appent(
			`<li>Ready check failed for: ${players}</li>`);
	});

	// end start game routine

	function disableOptions() 
	{ 
		$("#map").prop('disabled', true);
		$("#timeLimit").prop('disabled', true);
		$("#ruleSet").prop('disabled', true);
	} 
	
	function enableOptions() 
	{ 
		$("#map").prop('disabled', false);
		$("#timeLimit").prop('disabled', false);
		$("#ruleSet").prop('disabled', false);
	}

	$("#map").on("change", function() {
		var map = $("#map").val();
		socket.emit("map changed", map);
	});

	$("#timeLimit").on("change", function() {
		var timeLimit = $("#timeLimit").val();
		socket.emit("timeLimit changed", timeLimit);
	});

	$("#ruleSet").on("change", function() {
		var ruleSet = $("#ruleSet").val();
		socket.emit("ruleSet changed", ruleSet);
	});

	socket.on('map changed', map => {
		$("#map").val(map);
		//$("#map").change();
	});

	socket.on('timeLimit changed', timeLimit => {
		$("#timeLimit").val(timeLimit);
		//$("#timeLimit").change();
	});

	socket.on('ruleSet changed', ruleSet => {
		$("#ruleSet").val(ruleSet);
		//$("#ruleSet").change();
	});



	socket.on('lobby user joined', (data) => {
		const newAlias = data.userAlias;
		const newAliasID = data.sessionID;
		userCount = data.playerCount;
		//console.log(data.userAlias + ' joined');
		//console.log("%d users online.", data.onlineCount);

		$("#playerListHeading").html(`Users: ${userCount}`);
		$("#playerList").append(
			`<li class="list-item">${newAlias}</li>`);
		$("#messageList").append(
			`<li class="list-item">${newAlias} has joined.</li>`);
	});

	socket.on('lobby user left', (data) => {
		const newAlias = data.alias;
		userCount = data.userCount;
		users = data.users;
		//console.log('User %s has left.', data.alias);
		//console.log('%d users online.', data.userCount);
		//console.log("Online users:");
		
		$("#playerListHeading").html(`Users: ${userCount}`);
		$("#messageList").append(
			`<li class="list-item">${newAlias} has left.</li>`);
		$("#playerList").empty();
		for(i = 0; i < userCount; i++)
		{
			$("#playerList").append(
				`<li class="list-item">${users[i]}</li>`);
		}
	});
  
  // button events
  var input = document.getElementById("messageInput")
	
	// Ready Button
	$("#readyBtn").on("click", function(){
	    if ($(this).hasClass("btn-info")){
	        $(this).removeClass("btn-info");
	        $(this).addClass("btn-dark");
			  $(this).html(`<strong>Ready <i class="fas fa-check ml-2"></i></strong>`);
			  socket.emit('player ready');
	    }
	    else{
	        $(this).removeClass("btn-dark");
	        $(this).addClass("btn-info");
			  $(this).html(`Ready <i class="fas fa-times ml-2"></i>`);
			  socket.emit('player not ready');
	    }
	})
	
	// Lobby Button
	$("#lobbyBtn").on("click", function(){
	    $("#optionsPanel").hide();
	    $("#lobbyPanel").show();
	})
	
	// Options Button
	$("#optionsBtn").on("click", function(){
	   $("#lobbyPanel").hide();
		$("#optionsPanel").show();
		 
	})

	// Quit Button
	$("#quitBtn").on("click", function() {
		socket.emit('leave lobby');
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
			socket.emit('lobby typing');
			isTyping = true;
		} else {
			socket.emit('lobby stop typing');
			isTyping = false;
		}
	});

	// add and remove aliases from an array and use array.join
	// to create the typing text.
	socket.on('lobby typing', (data) => {
		const alias = data.alias;
		$("#typingNotice").html(`${alias} is typing...`)
		//console.log("%s is typing", alias);
	});

	socket.on('lobby stop typing', (data) => {
		const alias = data.alias;
		$("#typingNotice").html("")
		//console.log("%s stopped typing", alias);
	});

	socket.on('lobby new message', (data) => {
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
	});

	// chat events end
	// ///////////////

	// ////////////////////
	// chat functions begin

	$("#messageSend").click( function() {
		var message = $("#messageInput").val(); // get message
		$("#messageInput").val("");
		socket.emit('lobby stop typing');

		if(message == "")
			return;

		socket.emit('lobby new message', message);

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
});