import Circle from "./GameObjects/Circle.js"
import {drawCircle} from "./GameFunctions/drawCircle.js"
import {controller} from "./GameFunctions/controller.js"
import {checkCollision} from "./GameFunctions/checkCollision.js"

console.log("game.js connected");

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;

var circle1 = new Circle(50,50,10,0, "white",0);
var circle2 = new Circle(80,50,10,0, "yellow",0);

var step = function() {
	controller(circle1);
	ctx.clearRect(0,0,screenWidth,screenHeight);
	if (checkCollision(circle1, circle2)) {
		circle1.speed = -circle1.speed;
		circle1.x += circle1.speed;
		circle1.y += circle1.speed;
		circle2.color = circle1.color;
	}
	drawCircle(circle1, ctx);
	drawCircle(circle2, ctx);
	window.requestAnimationFrame(step);
}

step();