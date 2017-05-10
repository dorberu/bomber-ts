class Player extends Character {
    private keyController : KeyController;

    constructor(canvas: HTMLCanvasElement, map: Map, keyController : KeyController) {
        var size = new Size(20, 20);
        var pos = new Pos(size.width, size.height);
        super(pos, size, canvas, map, "#00f");
        this.keyController = keyController;
    }

    public update() {
        this.setBomb();
        this.move();
    }

    public setBomb() {
        if (this.keyController.space) {
            this.map.setBomb(this);
        }
    }

    public move() {
        var add = new Pos(0, 0);
        add.x -= (this.keyController.left) ? this.speed : 0;
        add.y -= (this.keyController.up) ? this.speed : 0;
        add.x += (this.keyController.right) ? this.speed : 0;
        add.y += (this.keyController.down) ? this.speed : 0;

        add = this.map.checkAdd(this, add);
        add = this.map.enemy.checkAdd(this, add);
        this.pos.x += add.x;
        this.pos.y += add.y;
    }
}