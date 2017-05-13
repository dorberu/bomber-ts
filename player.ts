class Player extends Character {
    private keyController : KeyController;

    constructor(room: BattleRoom, keyController : KeyController) {
        var size = new Size(20, 20);
        var pos = new Pos(0, 0);
        super(pos, size, room, "#00f");
        this.keyController = keyController;
    }

    public init() {
        this.pos = new Pos(this.size.width, this.size.height);
    }

    public update() {
        this.setBomb();
        this.move();
    }

    public move() {
        var add = new Pos(0, 0);
        add.x -= (this.keyController.left) ? this.speed : 0;
        add.y -= (this.keyController.up) ? this.speed : 0;
        add.x += (this.keyController.right) ? this.speed : 0;
        add.y += (this.keyController.down) ? this.speed : 0;

        add = this.room.map.checkAdd(this, add);
        add = this.room.enemy.checkAdd(this, add);
        this.pos.x += add.x;
        this.pos.y += add.y;
    }

    public setBomb() {
        if (this.keyController.space) {
            this.room.map.setBomb(this);
        }
    }
}