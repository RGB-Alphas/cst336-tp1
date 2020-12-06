export function controller(obj) {
    document.onkeydown = function(event) {
        obj.speed = obj.move;
        switch(event.key) {
            case 'ArrowRight':
                obj.moveRight();
                break;
            case 'ArrowLeft':
                obj.moveLeft();
                break;
            case 'ArrowUp':
                obj.moveUp();
                break;
            case 'ArrowDown':
                obj.moveDown();
                break;
        }
    }
    
    //
    document.onkeyup = function(event) {
        obj.speed = 0;
    }
    
}