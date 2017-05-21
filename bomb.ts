class Bomb extends Base {
    public color: string;
    public room: BattleRoom;
    public rest: number;
    public power: number;
    public isKill: boolean;
    public fires: Fire[];

    constructor(pos: Pos, rest: number, room: BattleRoom) {
        super(pos, room.map.blockSize, true);
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
                for (var l = 1; l <= this.power; l++) {
                    var pos = new Pos(this.pos.x - this.room.map.blockSize.width * l, this.pos.y);
                    if (!this.setFire(pos)) break;
                }
                for (var u = 1; u <= this.power; u++) {
                    var pos = new Pos(this.pos.x, this.pos.y - this.room.map.blockSize.height * u);
                    if (!this.setFire(pos)) break;
                }
                for (var r = 1; r <= this.power; r++) {
                    var pos = new Pos(this.pos.x + this.room.map.blockSize.width * r, this.pos.y);
                    if (!this.setFire(pos)) break;
                }
                for (var d = 1; d <= this.power; d++) {
                    var pos = new Pos(this.pos.x, this.pos.y + this.room.map.blockSize.height * d);
                    if (!this.setFire(pos)) break;
                }

                var pos = new Pos(this.pos.x, this.pos.y);
                this.setFire(pos);
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
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
            ctx.fill();
        }
    }

    public setFire(pos: Pos): boolean {
        var fire = new Fire(pos, this.room.map.blockSize, FPS, this.room);
        if (this.room.map.isHitBlock(fire)) {
            return false;
        }
        this.fires.push(fire);
        return true;
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
        super(pos, size, false);
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
            for (var i = 0; i < this.room.enemies.length; i++) {
                if (this.isHit(this.room.enemies[i])) {
                    this.room.enemies[i].life = Math.max(--this.room.enemies[i].life, 0);
                }
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

        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();
    }
}
