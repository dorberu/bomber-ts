class Enemy extends Character {
    constructor(room: BattleRoom) {
        var size = new Size(20, 20);
        var pos = new Pos(0, 0);
        super(pos, size, room, "#f00");
    }

    public init() {
        this.pos = new Pos(this.canvas.width - this.size.width * 2, this.canvas.height - this.size.height * 2);
    }

    public update() {
        this.move();
    }

    public move() {
        var add = new Pos(0, 0);
        add.x -= (Math.random() < 0.1) ? this.speed : 0;
        add.y -= (Math.random() < 0.1) ? this.speed : 0;
        add.x += (Math.random() < 0.1) ? this.speed : 0;
        add.y += (Math.random() < 0.1) ? this.speed : 0;

        add = this.room.map.checkAdd(this, add);
        add = this.room.player.checkAdd(this, add);
        this.pos.x += add.x;
        this.pos.y += add.y;
    }
}