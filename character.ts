abstract class Character extends Base {
    public room: BattleRoom;
    public id: number;
    public phase: number;
    public life: number;
    public speed: number;
    public color: string;

    public static PHASE_INIT = 1;
    public static PHASE_PLAY = 2;
    public static PHASE_CPU = 3;
    public static PHASE_DEAD = 4;
    public static PHASE_LOGOUT = 5;

    constructor(room: BattleRoom, id: number, pos: Pos) {
        super(pos, room.map.blockSize, true);
        this.room = room;
        this.id = id;
        this.phase = Character.PHASE_INIT;
        this.life = 1;
        this.speed = room.map.blockSize.width / 4;
    }

    public draw() {
        const ctx = canvas.getContext("2d");
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
    constructor(room: BattleRoom, id: number, pos: Pos) {
        super(room, id, pos);
        this.color = "#00f";
        this.phase = Character.PHASE_PLAY;
    }

    public update() {
        this.setBomb();
        this.move();
    }

    public move() {
        var add = new Pos(0, 0);
        add.x -= (keyController.left) ? this.speed : 0;
        add.y -= (keyController.up) ? this.speed : 0;
        add.x += (keyController.right) ? this.speed : 0;
        add.y += (keyController.down) ? this.speed : 0;

        add = this.room.map.checkAdd(this, add);
        for (var i = 0; i < this.room.enemies.length; i++) {
            add = this.room.enemies[i].checkAdd(this, add);
        }
        this.pos.x += add.x;
        this.pos.y += add.y;

        var packet = new MovePacket(this.room.wsc, this.room);
        packet.send(this.pos, add);
    }

    public setBomb() {
        if (keyController.space) {
            this.room.map.setBomb(this);
        }
    }
}

class Enemy extends Character {
    public currentAdd: Pos;

    constructor(room: BattleRoom, id: number, pos: Pos) {
        super(room, id, pos);
        this.color = "#f0f";
        this.currentAdd = new Pos(0, 0);
        this.phase = Character.PHASE_PLAY;
    }

    public update() {
        this.move();
    }

    public move() {
        var add = new Pos(this.currentAdd.x, this.currentAdd.y);
        add = this.room.map.checkAdd(this, add);
        add = this.room.player.checkAdd(this, add);
        this.pos.x += add.x;
        this.pos.y += add.y;
    }

    public reload(pos: Pos, add: Pos) {
        this.pos = pos;
        this.currentAdd = add;
    }
}