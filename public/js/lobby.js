/* global $ */
/* global io */

$(document).ready(function() {
	var socket = io();
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
	
	input.addEventListener("keyup", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
		  // Cancel the default action, if needed
		  event.preventDefault();
		  // Trigger the button element with a click
		  $("#messageSend").click();
		}
		
	});
	
	// Chat functions
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