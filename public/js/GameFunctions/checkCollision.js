export function checkCollision(obj1, obj2) {
    let cir1x2 = obj1.x + obj1.rad*2;
    let cir2x2 = obj2.x + obj2.rad*2;
    let cir1y2 = obj1.y + obj1.rad*2;
    let cir2y2 = obj2.y + obj2.rad*2;

    return obj1.x < cir2x2 && cir1x2 > obj2.x && obj1.y < cir2y2 && cir1y2 > obj2.y;
}