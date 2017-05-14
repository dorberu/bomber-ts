class Map extends Base {
    public static BLOCK_NUM = 21;

    public color: string;
    public room: BattleRoom;
    public blockSize: Size;
    public blocks: Block[];
    public bombs: Bomb[];
    
    constructor (room: BattleRoom) {
        var pos = new Pos(0, 0);
        var width = Math.floor(room.canvas.width / Map.BLOCK_NUM) * Map.BLOCK_NUM;
        var height = Math.floor(room.canvas.height / Map.BLOCK_NUM) * Map.BLOCK_NUM;
        var size = new Size(width, height);

        super(pos, size, true, canvas);
        this.color = "#0c0";
        this.room = room;
        this.blockSize = new Size(this.size.width / Map.BLOCK_NUM, this.size.height / Map.BLOCK_NUM);
        this.blocks = [];
        this.bombs = [];
    }

    public init() {
        this.makeBlocks();
    }

    private makeBlocks() {
        for (var i = 0; i < Map.BLOCK_NUM; i++) {
            this.blocks.push(new Block(new Pos(i * this.blockSize.width, 0), this));
            this.blocks.push(new Block(new Pos(i * this.blockSize.width, this.size.height - this.blockSize.height), this));

            if (i == 0 || i == Map.BLOCK_NUM - 1) {
                continue;
            }
            this.blocks.push(new Block(new Pos(0, i * this.blockSize.width), this));
            this.blocks.push(new Block(new Pos(this.size.width - this.blockSize.width, i * this.blockSize.height), this));

            if (i % 2 == 1) {
                continue;
            }
            for (var j = 1; j < Map.BLOCK_NUM - 1; j++) {
                if (j % 2 == 0) {
                    this.blocks.push(new Block(new Pos(i * this.blockSize.width, j * this.blockSize.height), this));
                }
            }
        }
    }
    
    public update() {
        for (var i = 0; i < this.bombs.length; i++) {
            this.bombs[i].update();
            if (this.bombs[i].isKill) {
                this.bombs.splice(i, 1);
            }
        }
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();

        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw();
        }
        for (var i = 0; i < this.bombs.length; i++) {
            this.bombs[i].draw();
        }
    }

    public isHitBlock(target: Base) {
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].isHit(target)) {
                return true;
            }
        }

        return false;
    }

    public isHitBomb(target: Base) {
        for (var i = 0; i < this.bombs.length; i++) {
            if (this.bombs[i].isHit(target)) {
                return true;
            }
        }

        return false;
    }

    public isHit(target: Base) {
        if (this.isHitBlock(target) || this.isHitBomb(target)) {
            return true;
        }

        return false;
    }

    public checkAdd(target: Base, add: Pos): Pos {
        var after = new Pos(target.pos.x, target.pos.y);
        after.x = Math.max(after.x + add.x, this.pos.x);
        after.y = Math.max(after.y + add.y, this.pos.y);
        after.x = Math.min(after.x, this.pos.x + this.size.width - target.size.width);
        after.y = Math.min(after.y, this.pos.y + this.size.height - target.size.height);

        var ret = new Pos(after.x - target.pos.x, after.y - target.pos.y);
        for (var i = 0; i < this.blocks.length; i++) {
            ret = this.blocks[i].checkAdd(target, ret);
        }
        for (var i = 0; i < this.bombs.length; i++) {
            ret = this.bombs[i].checkAdd(target, ret);
        }

        return ret;
    }

    public setBomb(character: Character) {
        var x = Math.round(character.pos.x / character.size.width) * character.size.width;
        var y = Math.round(character.pos.y / character.size.height) * character.size.height;
        var pos = new Pos(x, y);
        var size = new Size(character.size.width, character.size.height);
        var bomb = new Bomb(pos, 3 * FPS, this.room);
        
        if (!this.isHit(bomb)) {
            this.bombs.push(bomb);
        }
    }
}

class Block extends Base {
    public color: string;

    constructor(pos: Pos, map: Map) {
        super(pos, map.blockSize, true, map.canvas);
        this.color = "#999";
    }
    
    public update() {}

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();
    }
}
