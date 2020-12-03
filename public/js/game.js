import Circle from "./GameObjects/Circle.js"
import {drawCircle} from "./GameFunctions/drawCircle.js"
import {controller} from "./GameFunctions/controller.js"
import {checkCollision} from "./GameFunctions/checkCollision.js"
// import {map1} from "./GameFunctions/mapping.js"

console.log("game.js connected");

const socket = io('http://localhost:3000/game');
socket.on('step', handleInit);

console.log(socket);

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;

var circle1 = new Circle(100,100,15,0, "turquoise",0);	// Player
var circle2 = new Circle(200,100,15,0, "yellow",0);		// CPU

var step = function() {
	document.addEventListener('keydown', keydown);
	controller(circle1);
	ctx.clearRect(0,0,screenWidth,screenHeight);
	if (checkCollision(circle1, circle2)) {
		circle1.speed = -circle1.speed;
		circle1.x += circle1.speed;
		circle1.y += circle1.speed;
		circle2.color = "white";
	}
	drawCircle(circle1, ctx);
	drawCircle(circle2, ctx);
	window.requestAnimationFrame(step);
}

step();

function keydown(e) {
	console.log(e.keyCode);
}

function handleInit(msg) {
	console.log(msg);
}