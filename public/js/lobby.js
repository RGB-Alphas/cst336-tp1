/* global $ */
/* global io */

$(document).ready(function() {
	
	var socket = io();
	var input = document.getElementById("messageInput")

	socket.emit("enter_lobby", {
		lobbyName: lobbyName,
		userName: userName
	});

	socket.on('lobby_entered', (data) => {
		var playerCount = data.playerCount;
		var players = data.players;
		var options = data.options;

		console.log(playerCount);
		console.log(JSON.stringify(players))
		console.log(JSON.stringify(options));
		// console.log("Lobby Name: lo")

		$("#playerListHeading").html(`Users: (${playerCount})`);
		$("#playerList").empty();
		for(i = 0; i < playerCount; i++)
		{
			$("#playerList").append(
				`<li>${players[i]}</li>`
			)
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
  
  // button events
  var input = document.getElementById("messageInput")
	
	// Ready Button
	$("#readyBtn").on("click", function(){
	    if ($(this).hasClass("btn-info")){
	        $(this).removeClass("btn-info");
	        $(this).addClass("btn-dark");
	        $(this).html(`<strong>Ready <i class="fas fa-check ml-2"></i></strong>`);
	    }
	    else{
	        $(this).removeClass("btn-dark");
	        $(this).addClass("btn-info");
	        $(this).html(`Ready <i class="fas fa-times ml-2"></i>`);
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
	});

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
});