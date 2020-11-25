$(document).ready(function() {

	var socket = io();

	socket.emit('user joined', );

	/* SOCKET EVENTS */
	socket.on('login_success'), (data) => {
		console.log("Login Success!");
		window.location.href = '/authenticated';
	};

	socket.on('login_denied'), (data) => {
		console.log("Login Failure!");
	};
});