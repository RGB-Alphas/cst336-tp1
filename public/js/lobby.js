/* global $ */
/* global io */

$(document).ready(function() {
	var socket = io();
	
	// Ready Button
	$("#readyBtn").on("click", function(){
	    if ($(this).hasClass("btn-info")){
	        $(this).removeClass("btn-info");
	        $(this).addClass("btn-dark");
	        $(this).html(`Ready <i class="fas fa-check pl-2"></i>`);
	    }
	    else{
	        $(this).removeClass("btn-dark");
	        $(this).addClass("btn-info");
	        $(this).html(`Not Ready`);
	    }
	})
	
	// Lobby Button
	$("#lobbyBtn").on("click", function(){
	    $("#chatPanel").hide();
	    $("#lobbyPanel").show();
	})
	
	// Chat Button
	$("#chatBtn").on("click", function(){
	    $("#lobbyPanel").hide();
	    $("#chatPanel").show();
	})
	
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