$(document).ready(function() {

	var socket = io();

	console.log("Emitting: %s", userName);
	socket.emit('enter_lounge', userName);

	/* SOCKET EVENTS */
	socket.on('welcome', (data) => {
		console.log("Users Online: %d", data.onlineCount);
		
		for(i = 0; i < data.onlineUsers.length; i++)
		{
			// add these to the html of the user list ( <ul> will be fine ).
			// see david's hw2 if you need to see how he did it (index.html and main.js)
			console.log(data.onlineUsers[i]);
			//$("#app-sidebar-users-list").append(
			//	`<li class="app-users-list-item">${data.onlineUsers[i]}</li>`)
		}
	});

	socket.on('login_denied'), (data) => {
		console.log("Login Failure!");
	};

	$("#createButton").click(function(){
		$("#lobbyForm").submit();
	});

	// dialogue
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
});