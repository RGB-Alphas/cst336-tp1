import Circle from "./GameObjects/Circle.js"
import {drawCircle} from "./GameFunctions/drawCircle.js"
import {controller} from "./GameFunctions/controller.js"
import {checkCollision} from "./GameFunctions/checkCollision.js"
// import {map1} from "./GameFunctions/mapping.js"

$(document).ready(function(){
	var socket = io();
	var currentPlayer;
	var playerFromServer
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');

	let screenWidth = 1000;
	let screenHeight = 500;

	let x = Math.floor(Math.random() * Math.floor(800) + 100);
	let y = Math.floor(Math.random() * Math.floor(300) + 100);
	let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
	var player = new Circle(x,y,15,0,randomColor,0);
	socket.emit("playerJoined", JSON.stringify(player));

	var step = function() {
		ctx.clearRect(0,0,screenWidth,screenHeight);
		socket.on("received",async (data)=>{
			//console.log("This is the ", data);
			playerFromServer = JSON.parse(data);
			console.log("this is the player ", playerFromServer);
			for(let i = 0; i < playerFromServer.length; i++) {
				if( player.randomColor === playerFromServer[i].randomColor) {
					currentPlayer = playerFromServer[i];
				}
			}
			console.log("The current player is ", currentPlayer);
			// playerFromServer.forEach(player => {
			// 	drawCircle(player, ctx);
			// });
		});
		await playerFromServer.forEach(player => {
			drawCircle(player, ctx);
		});
		controller(currentPlayer);
		// 	if (checkCollision(circle1, circle2)) {
		// 		circle1.speed = -circle1.speed;
		// 		circle1.x += circle1.speed;
		// 		circle1.y += circle1.speed;
		// 		circle2.color = "white";
		// 	}
		//console.log(playerFromServer);
		window.requestAnimationFrame(step);
	}

	step();
})



// var socket = io();
// console.log(socket)
// socket.emit("login_success",{data: "hello world"});

// var canvas = document.getElementById("myCanvas");
// var ctx = canvas.getContext('2d');

// let screenWidth = 1000;
// let screenHeight = 500;

// var circle1 = new Circle(100,100,15,0, "turquoise",0);	// Player
// var circle2 = new Circle(200,100,15,0, "yellow",0);		// CPU

// var step = function() {
// 	controller(circle1);
// 	ctx.clearRect(0,0,screenWidth,screenHeight);
// 	if (checkCollision(circle1, circle2)) {
// 		circle1.speed = -circle1.speed;
// 		circle1.x += circle1.speed;
// 		circle1.y += circle1.speed;
// 		circle2.color = "white";
// 	}
// 	drawCircle(circle1, ctx);
// 	drawCircle(circle2, ctx);
// 	window.requestAnimationFrame(step);
// }

// step();

/******************************************************
				Sending data to server
socket.emit("login_success",{data: "hello world"});
socket.on("received",(data)=>{
	console.log(data)
});
*******************************************************/