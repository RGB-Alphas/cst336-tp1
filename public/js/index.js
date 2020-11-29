/* global $ */
/* global io */

$(document).ready(function() {
	var socket = io();
	
	// Prompt user to login or register
	$('#main-dialog').show();

	// the input elements on the login form
	var loginName = document.getElementById("loginName");
	var loginPassword = document.getElementById("loginPassword");
	var loginButton = document.getElementById("loginButton");

	// the input elements on the registration form
	var accountName = document.getElementById("accountName");
	var accountPassword = document.getElementById("password");
	var accountPasswordRepeat = document.getElementById("repeatPassword");
	var accountDisplayName = document.getElementById("displayName");
	var registerButton = document.getElementById("registerButton");

	const input = document.querySelectorAll('input');

	// added event listeners for all input fields 
	// (enter key will submit any form from any input field)
	input.forEach( inp => inp.addEventListener("keyup", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
	   	// Cancel the default action, if needed
	  		//event.preventDefault();
	  		// Trigger the button element with a click
	  		$(this).closest('form').trigger('submit');
		}
	}));

	$('a.dialog-link').click(function() {
		var dialog_id = $(this).attr('data-selector');
		$('#main-dialog').hide();
		$('#dialog-overlay').fadeIn(200);
		$(dialog_id).fadeIn(200);
		return false;
	});

	/* Login Form Begin */
	$("#loginForm").submit(function(event) {
		// event.preventDefault();
		const loginName = $("#loginName").val();
		const loginPassword = $("#loginPassword").val();
		
		// socket.emit('login_request', { name: loginName, pass: loginPassword });

	});

	$("#loginButton").click(function(){
		$("#loginForm").submit();
	});
	/* Login Form End */

	/* Register Form Begin */
	$("#registerForm").submit(function(event) {
		console.log($("#accountName").val());
		console.log($("#password").val());
		console.log($("#repeatPassword").val());
		console.log($("#displayName").val());
	});

	$("#registerButton").click(function(){
		$("#registerForm").submit();
	});
	/* Register Form End */

	$('.close-button, #dialog-overlay').click(function() { 
		$('.dialog-popup').hide();
		$('#dialog-overlay').hide();
		$('#main-dialog').show();
		return false;
	});
});