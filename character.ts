abstract class Character extends Base {
    public room: BattleRoom;
    public life: number;
    public speed: number;
    public color: string;

    constructor(room: BattleRoom) {
        super(new Pos(0, 0), room.map.blockSize, true, room.canvas);
        this.room = room;
        this.life = 1;
        this.speed = room.map.blockSize.width / 4;
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();

        if (this.life < 1) {
            ctx.beginPath();
            ctx.fillStyle = "#f00";
            var resize = this.size.height / 3;
            ctx.rect(this.pos.x, this.pos.y + resize, this.size.width, resize);
            ctx.fill();
        }
    }
}

class Player extends Character {
    private keyController : KeyController;

    constructor(room: BattleRoom, keyController : KeyController) {
        super(room);
        this.color = "#00f";
        this.keyController = keyController;
    }

    public init() {
        this.pos = new Pos(this.room.map.blockSize.width, this.room.map.blockSize.height);
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

class Enemy extends Character {
    constructor(room: BattleRoom) {
        super(room);
        this.color = "#f0f";
    }

    public init() {
        var x = this.room.map.blockSize.width * (Map.BLOCK_NUM - 2);
        var y = this.room.map.blockSize.height * (Map.BLOCK_NUM - 2);
        this.pos = new Pos(x, y);
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