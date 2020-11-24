/*global Path*/
/*global view*/
/*global Point*/
/*global $*/

console.log("game.js connected");

var circles = []    // Store circles
AddCircle();        // Player 1
AddCircle();        // CPU 1
AddCircle();        // CPU 2
AddCircle();        // CPU 3
var step = 25;

// Adds a circle to the screen w/ random color & position
function AddCircle(){
    var colors = ["lime", "turquoise", "maroon"];
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var point = maxPoint * randomPoint;
    var newCircle = new Path.Circle(point, 20);
	newCircle.fillColor = randomColor(colors);;
	circles.push(newCircle);
}

// 'WASD' Movement Listeners
function onKeyDown(event) {
	if(event.key == 'a'){
		circles[0].position.x -= step;
	}

	if(event.key == 'd') {
		circles[0].position.x += step;
	}

	if(event.key == 'w') {
		circles[0].position.y -= step;
	}

	if(event.key == 's') {
		circles[0].position.y += step;
	}
}

// Collision Detection
//path.intersects(otherPath
function onFrame(event) {
	if (circles[0].intersects(circles[1])){
		circles[1].fillColor = "white";
	}
	
	if (circles[0].intersects(circles[2])){
		circles[2].fillColor = "white";
	}
	
	if (circles[0].intersects(circles[3])){
		circles[3].fillColor = "white";
	}
}


// Generate random color
function randomColor(colors){
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}

// For removing circles
function removeCircle(circle){
    circles[circle].remove();
    circles.splice(circle, 1);
    console.log(circles);
}
