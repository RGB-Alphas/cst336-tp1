export default class Circle {
    constructor(x, y, rad, full, color, speed) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.full = full;
        this.color = color;
        this.speed = speed;
        this.move = 10;
        this.maxY = 500;
        this.maxX = 1000;
    }
    
    // Move circle left
    moveLeft() {
        // Do nothing if next position is outside of map
        if (this.x - this.move < this.rad) {
            return;
        }
        this.x -= this.speed;
    }
    
    // Move circle right
    moveRight() {
        // Do nothing if next position is outside of map
        if (this.x + this.move > this.maxX - this.rad) {
            return;
        }
        this.x += this.speed;
    }
    
    // Move circle up
    moveUp() {
        // Do nothing if next position is outside of map
        if (this.y - this.move < this.rad) {
            return;
        }
        this.y -= this.speed;
    }
    
    // Move circle down
    moveDown() {
        // Do nothing if next position is outside of map
        if (this.y + this.move > this.maxY - this.rad) {
            return;
        }
        this.y += this.speed;
    }
}