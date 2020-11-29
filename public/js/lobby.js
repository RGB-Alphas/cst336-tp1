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
});