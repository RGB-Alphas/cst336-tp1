import Circle from "./GameObjects/Circle.js"
import {drawCircle} from "./GameFunctions/drawCircle.js"
import {controller} from "./GameFunctions/controller.js"
import {checkCollision} from "./GameFunctions/checkCollision.js"
// import {map1} from "./GameFunctions/mapping.js"

console.log("game.js connected");

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;

var circle1 = new Circle(100,100,15,0, "turquoise",0);	// Player
var circle2 = new Circle(200,100,15,0, "yellow",0);		// CPU

var step = function() {
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