import Circle from "./GameObjects/Circle.js"
import {drawCircle} from "./GameFunctions/drawCircle.js";
import {controller} from "./GameFunctions/controller.js";

console.log("game.js connected");

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;

var circle1 = new Circle(50,50,10,0, "white",0);
var circle2 = new Circle(120,50,10,0, "yellow",0);

var step = function() {
	controller(circle1);
	ctx.clearRect(0,0,screenWidth,screenHeight);
	if (checkCollision(circle1, circle2)) {
		console.log("collided");
		circle1.x = circle2.x - circle2.rad * 2 - 1;
	}
	drawCircle(circle1, ctx);
	drawCircle(circle2, ctx);
	window.requestAnimationFrame(step);
}

var checkCollision = function (circle1, circle2) {
	let cir1x2 = circle1.x + circle1.rad*2;
	let cir2x2 = circle2.x + circle2.rad*2;
	let cir1y2 = circle1.y + circle1.rad*2;
	let cir2y2 = circle1.y + circle1.rad*2;

	return circle1.x < cir2x2 && cir1x2 > circle2.x && circle1.y < cir2y2 && cir1y2 > circle2.y;
}

step();