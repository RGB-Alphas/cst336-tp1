export function controller(obj) {
    document.onkeydown = function(event) {
        switch(event.key) {
            case 'ArrowRight':
                obj.speed = obj.move;
                obj.moveHorizontally();
                break;
            case 'ArrowLeft':
                obj.speed = -obj.move;
                obj.moveHorizontally();
                break;
            case 'ArrowUp':
                    obj.speed = -obj.move;
                    obj.moveVertically();
                    break;
            case 'ArrowDown':
                    obj.speed = obj.move;
                    obj.moveVertically();
                    break;
        }
    }
    document.onkeyup = function(event) {
        obj.speed = 0;
    }
    
}