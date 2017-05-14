class Bomb extends Base {
    public color: string;
    public room: BattleRoom;
    public rest: number;
    public power: number;
    public isKill: boolean;
    public fires: Fire[];

    constructor(pos: Pos, rest: number, room: BattleRoom) {
        var size = new Size(20, 20);
        super(pos, size, true, room.canvas);
        this.color = "#000";
        this.room = room;
        this.rest = rest;
        this.power = 5;
        this.isKill = false;
        this.fires = [];
    }

    public update() {
        if (this.isKill) {
            return;
        }
        else if (this.isFire()) {
            for (var i = 0; i < this.fires.length; i++) {
                this.fires[i].update();
                if (this.fires[i].isKill) {
                    this.fires.splice(i, 1);
                }
            }
            if (!this.isFire()) {
                this.isKill = true;
            }
        }
        else {
            this.rest = Math.max(this.rest - 1, 0);
            if (this.rest <= 0) {
                var map = this.room.map;
                var size = new Size(20, 20);

                for (var i = -this.power; i <= this.power; i++) {
                    var pos = new Pos(this.pos.x + size.width * i, this.pos.y);
                    var fire = new Fire(pos, size, 1 * FPS, this.room);

                    if (fire.pos.x < 0 || fire.pos.x + fire.size.width > map.pos.x + map.size.width) {
                        continue;
                    }
                    if (map.isHitBlock(fire)) {
                        continue;
                    }
                    
                    this.fires.push(fire);
                }

                for (var j = -this.power; j <= this.power; j++) {
                    var pos = new Pos(this.pos.x, this.pos.y + size.height * j);
                    var fire = new Fire(pos, size, FPS, this.room);

                    if (fire.pos.y < 0 || fire.pos.y + fire.size.height > map.pos.y + map.size.height) {
                        continue;
                    }
                    if (fire.pos.y == this.pos.y) {
                        continue;
                    }
                    if (map.isHitBlock(fire)) {
                        continue;
                    }
                    
                    this.fires.push(fire);
                }
            }
        }
    }

    public draw() {
        if (this.isKill) {
            return;
        }
        else if (this.isFire()) {
            for (var i = 0; i < this.fires.length; i++) {
                this.fires[i].draw();
            }
        }
        else {
            const ctx = this.canvas.getContext("2d");
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
            ctx.fill();
        }
    }

    public isFire() {
        if (this.fires.length > 0) {
            return true;
        }
        return false;
    }
}

class Fire extends Base {
    public room: BattleRoom;
    public rest: number;
    public isKill: boolean;
    public color: string;

    constructor(pos: Pos, size: Size, rest: number, room: BattleRoom) {
        super(pos, size, false, room.canvas);
        this.room = room;
        this.rest = rest;
        this.isKill = false;
        this.color = "#f00";
    }

    public update() {
        if (this.isKill) {
            return;
        }
        else {
            this.rest = Math.max(this.rest - 1, 0);
            if (this.rest <= 0) {
                this.isKill = true;
            }
            if (this.isHit(this.room.enemy)) {
                this.room.enemy.life = Math.max(--this.room.enemy.life, 0);
            }
            if (this.isHit(this.room.player)) {
                this.room.player.life = Math.max(--this.room.player.life, 0);
            }
        }
    }

    public draw() {
        if (this.isKill) {
            return;
        }

        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();
    }
}
