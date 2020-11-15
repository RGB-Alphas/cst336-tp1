$(document).ready(function() {

	// var socket = io();

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
		$('#dialog-overlay').fadeIn(200);
		$(dialog_id).fadeIn(200);
		$(dialog_id).css({ 
			 'margin-top' : -($(dialog_id).height() + 4) / 2,
			 'margin-left' : -($(dialog_id).width() + 4) / 2
		});
		return false;
	});

	$("#loginForm").submit(function(event) {
		console.log($("#loginName").val());
		console.log($("#loginPassword").val());
	});

	$("#loginButton").click(function(){
		$("#loginForm").submit();
	});

	$("#registerForm").submit(function(event) {
		console.log($("#accountName").val());
		console.log($("#password").val());
		console.log($("#repeatPassword").val());
		console.log($("#displayName").val());
	});

	$("#registerButton").click(function(){
		$("#registerForm").submit();
	});

	$('.dialog-popup a.close, #dialog-overlay').click(function() { 
		$('.dialog-popup').fadeOut(200);
		$('#dialog-overlay').fadeOut(200);
		return false;
	});
});