class Map extends Base {
    public color: string;
    public room: BattleRoom;
    public baseBlockSize: Size;
    public blockSize: Size;
    public blockNum: Size;
    public blocks: Block[];
    public bombs: Bomb[];
    
    constructor (room: BattleRoom, baseBlockSize: Size, blockNum: Size, mapInfo: number[][]) {
        var pos = new Pos(0, 0);
        var width = Math.floor(canvas.width / blockNum.width) * blockNum.width;
        var height = Math.floor(canvas.height / blockNum.height) * blockNum.height;
        var size = new Size(width, height);
        super(pos, size, true);
        
        this.color = "#0c0";
        this.room = room;
        this.baseBlockSize = baseBlockSize;
        this.blockSize = new Size(this.size.width / blockNum.width, this.size.height / blockNum.height);
        this.blockNum = blockNum;
        this.setBlocks(mapInfo);
        this.bombs = [];
    }

    private setBlocks(mapInfo: number[][]) {
        this.blocks = [];
        for (var i = 0; i < mapInfo.length; i++) {
            for (var j = 0; j < mapInfo[i].length; j++) {
                if (mapInfo[i][j] == 1) {
                    this.blocks.push(new Block(new Pos(i * this.blockSize.width, j * this.blockSize.height), this));
                }
            }
        }
    }

    public baseToCurrentScale(pos: Pos) {
        var x = pos.x * this.blockSize.width / this.baseBlockSize.width;
        var y = pos.y * this.blockSize.height / this.baseBlockSize.height;
        return new Pos(x, y);
    }

    public currentToBaseScale(pos: Pos) {
        var x = pos.x * this.baseBlockSize.width / this.blockSize.width;
        var y = pos.y * this.baseBlockSize.height / this.blockSize.height;
        return new Pos(x, y);
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
        const ctx = canvas.getContext("2d");
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
        super(pos, map.blockSize, true);
        this.color = "#999";
    }
    
    public update() {}

    public draw() {
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();
    }
}
