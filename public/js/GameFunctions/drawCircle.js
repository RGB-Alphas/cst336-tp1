export function drawCircle(object, ctx) {
    ctx.fillStyle = object.color;
    ctx.beginPath();
	ctx.arc(object.x, object.y, object.rad, object.full, 2 * Math.PI, false);
	ctx.fillStyle = object.color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'white';
	ctx.stroke();
}