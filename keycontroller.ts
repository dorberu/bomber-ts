class KeyCode {
    static SPACE = 32;
    static LEFT = 37;
    static UP = 38;
    static RIGHT = 39;
    static DOWN = 40;
}

class EventName {
    static DOWN = "keydown";
    static UP  = "keyup";
}

class KeyController {
    public left : boolean;
    public up : boolean;
    public right : boolean;
    public down : boolean;
    public space : boolean;

    constructor() {
        this.left = false;
        this.up = false;
        this.right = false;
        this.down = false;
        this.space = false;
    }
}

var keyController : KeyController;

function keyDown(event) {
    if (keyController != null) {
        keyController.left = (event.keyCode == KeyCode.LEFT) ? true : keyController.left;
        keyController.up = (event.keyCode == KeyCode.UP) ? true : keyController.up;
        keyController.right = (event.keyCode == KeyCode.RIGHT) ? true : keyController.right;
        keyController.down = (event.keyCode == KeyCode.DOWN) ? true : keyController.down;
        keyController.space = (event.keyCode == KeyCode.SPACE) ? true : keyController.space;
    }
}

function keyUp(event) {
    if (keyController != null) {
        keyController.left = (event.keyCode == KeyCode.LEFT) ? false : keyController.left;
        keyController.up = (event.keyCode == KeyCode.UP) ? false : keyController.up;
        keyController.right = (event.keyCode == KeyCode.RIGHT) ? false : keyController.right;
        keyController.down = (event.keyCode == KeyCode.DOWN) ? false : keyController.down;
        keyController.space = (event.keyCode == KeyCode.SPACE) ? false : keyController.space;
    }
}
