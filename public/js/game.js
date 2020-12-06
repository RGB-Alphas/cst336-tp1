/*global Path*/
/*global view*/
/*global Point*/
/*global $*/
$(document).ready(function() {

	socket.emit('enter_game', { userName: userName, alias: displayName } );

	socket.on('entered_game', (data) => {

	});

	var maxWidth = view.size.width;
	var maxHeight = view.size.height;
	var step = 15;				// Number of pixels to move each keypress
	var circles = [];    		// Store circles

	AddCircle("turquoise");		// Player == Blue
	AddCircle("red");			// CPU 1
	AddCircle("lime");      	// CPU 2
	AddCircle("yellow");        // CPU 3

	// Adds a circle to the screen w/ random color & position
	function AddCircle(color){
		var maxPoint = new Point(view.size.width, view.size.height);
		var randomPoint = Point.random();
		var point = maxPoint * randomPoint;
		var newCircle = new Path.Circle(point, 15);
		newCircle.fillColor = color;
		circles.push(newCircle);
	}

	// 'WASD' Movement Listeners
	function onKeyDown(event) {
		if(event.key == 'a'){
			// Only move if next position is within boundaries
			if (circles[0].position.x - step <= 10){
				return;
			}
			else{
				circles[0].position.x -= step;
			}
		}

		if(event.key == 'd') {
			// Only move if next position is within boundaries
			if (circles[0].position.x + step >= maxWidth - 10){
				return;
			}
			else{
				circles[0].position.x += step;
			}
		}

		if(event.key == 'w') {
			// Only move if next position is within boundaries
			if (circles[0].position.y - step <  10){
				return;
			}
			else{
				circles[0].position.y -= step;
			}
		}

		if(event.key == 's') {
			// Only move if next position is within boundaries
			if (circles[0].position.y + step > maxHeight - 10){
				return;
			}
			else{
				circles[0].position.y += step;
			}
		}
	}

	// Collision Detection
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

	// For removing circles
	function removeCircle(circle){
		circles[circle].remove();
		circles.splice(circle, 1);
		console.log(circles);
	}
});