export default class Circle {
    constructor(x, y, rad, full, color, speed) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.full = full;
        this.color = color;
        this.speed = speed;
        this.move = 2;
    }
    moveHorizontally() {
        if (this.x > 293) {
            this.speed = -this.speed;
        }
        if (this.x < 7) {
            this.speed = -this.speed;
        }
        this.x += this.speed;
    }
    moveVertically() {
        if (this.y > 143) {
            this.speed = -this.speed;
        }
        if (this.y < 7) {
            this.speed = -this.speed;
        }
        this.y += this.speed;
    }
}