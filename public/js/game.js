$(document).ready(function() {

	var socket = io();

	// globals
	//var mapWidth = view.size.width;
	//var mapHeight = view.size.height;

	var keyW = false;
	var keyA = false;
	var keyS = false;
	var keyD = false;

	// the input system will tick slowly.
	var inputFPS = 2;  // 2 frames per second
	var inputFrameTime = 1000/inputFPS; // Approx. 500ms per frame

	var playerList = [];

	var mapData;
	var timeLeft = 0;
	var score = 0;
	var timerInterval; // interval handle.
	var updatePlayerInterval;

	var isRunning = false;

	socket.emit('enter_game', { 
		userName: userName, 
		alias: displayName,
		userId: userId 
	});

	socket.on('game_entered', (data) => {
		console.log("Entered the game")

		mapData = data.mapData;
		timeLeft = data.options.time;

		// fire up the "input system"
		isRunning = true;
		initializeTimer();
		initializeInput();

		
	});

	socket.on('update players', (data) => {
		playerList = data.players;
		render(data.players);
		console.log("players updated");
	});

	function initializeTimer() {
		//add timer
		timerInterval = setInterval( () => {
			timeLeft--;
			$("#timer").text("Time Remaining: " + timeLeft);
			if(timeLeft < 1)
			{
				timeLeft = 0;
				isRunning = false;
				clearInterval(timerInterval);
			}
				
		},1000);
		// $("#timer").text("Clock: " + timerInterval);

		// add score
		// $("#score").text("Score: " + score);
	};

	// functions
	function initializeInput() {
		window.addEventListener("keydown", onKeyDown, false);
		window.addEventListener("keyup", onKeyUp, false);

		updatePlayerInterval = setInterval(function() {

			if(isRunning === true)
			{
				console.log("sending player input");
				socket.emit("update player", { 
					wasdState: { w: keyW, a: keyA, s: keyS, d: keyD }
				});
			}
			else
			{
				clearInterval(updatePlayerInterval);
				$("#gameover").css("visibility", "visible");
			}
			
			// console.log(`Input State: W: ${keyW} A: ${keyA} S: ${keyS} D: ${keyD}`);
		}, inputFrameTime);
	};

	function render(players) {

		console.log("Rendering: %d objects", mapData.tiles.length + players.length);
		
  		var canvas = document.getElementById("myCanvas");
		var context = canvas.getContext("2d");
		
		// clear the canvas to that color from the css sheet.
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.rect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "black";
		context.fill();

		// console.log(JSON.stringify(players));

		mapData.tiles.forEach(tile => {
			context.beginPath();
			// draw the tile
			context.rect(tile.x, tile.y, tile.width, tile.height);
			context.fillStyle = tile.color;
			context.fill();
			context.closePath();
		});

		// begin drawing circles
		players.forEach(player => {
			context.beginPath();

			// draw the player
			context.arc(player.x, player.y, 20, 0, Math.PI * 2, false);
			context.fillStyle = player.color;
			context.fill();

			// draw the "aura" for a glow effect.
			context.arc(player.x, player.y, 21, 0, Math.PI * 2, false);
			context.fillStyle = "orange";
			context.stroke();
			context.closePath();

			// draw the nameplate
			var offsetX = player.x - player.radius;
			var offsetY = player.y - player.radius - 10;
			context.font = '10px serif';
			context.fillStyle = "white";
			context.fillText(player.name, offsetX, offsetY);
		});
	};

	function onKeyDown(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
		  case 68: //d
			 keyD = true;
			 break;
		  case 83: //s
			 keyS = true;
			 break;
		  case 65: //a
			 keyA = true;
			 break;
		  case 87: //w
			 keyW = true;
			 break;
		}
	 }
	 
	 function onKeyUp(event) {
		var keyCode = event.keyCode;
	 
		switch (keyCode) {
		  case 68: //d
			 keyD = false;
			 break;
		  case 83: //s
			 keyS = false;
			 break;
		  case 65: //a
			 keyA = false;
			 break;
		  case 87: //w
			 keyW = false;
			 break;
		}
	 }

	// event listeners

	
});