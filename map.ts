class Map extends Base {
    public color: string;
    public player: Player;
    public enemy: Enemy;
    public blocks: Block[];
    
    constructor (canvas: HTMLCanvasElement) {
        var pos = new Pos(0, 0);
        var size = new Size(canvas.width, canvas.height);
        super(pos, size, true, canvas);
        this.color = "#0c0";
        this.makeBlocks();
    }

    private makeBlocks() {
        this.blocks = [];
        var size = new Size(20, 20);
        for (var i = 0; i < this.size.width / size.width; i++) {
            this.blocks.push(new Block(new Pos(i * size.width, 0), size, this.canvas));
            this.blocks.push(new Block(new Pos(i * size.width, this.size.height - size.height), size, this.canvas));

            if (i == 0 || i == this.size.width / size.width - 1) {
                continue;
            }
            this.blocks.push(new Block(new Pos(0, i * size.height), size, this.canvas));
            this.blocks.push(new Block(new Pos(this.size.width - size.width, i * size.height), size, this.canvas));

            if (i % 2 == 1) {
                continue;
            }
            for (var j = 1; j < this.size.height / size.height - 1; j++) {
                if (j % 2 == 0) {
                    this.blocks.push(new Block(new Pos(i * size.width, j * size.height), size, this.canvas));
                }
            }
        }
    }

    public setCharacter(player: Player, enemy: Enemy) {
        this.player = player;
        this.enemy = enemy;
    }
    
    public update() {}

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();

        for (var num in this.blocks) {
            this.blocks[num].draw();
        }
    }

    public checkAdd(target: Base, add: Pos): Pos {
        var after = new Pos(target.pos.x, target.pos.y);
        after.x = Math.max(after.x + add.x, this.pos.x);
        after.y = Math.max(after.y + add.y, this.pos.y);
        after.x = Math.min(after.x, this.pos.x + this.size.width - target.size.width);
        after.y = Math.min(after.y, this.pos.y + this.size.height - target.size.height);

        var ret = new Pos(after.x - target.pos.x, after.y - target.pos.y);
        for (var num in this.blocks) {
            ret = this.blocks[num].checkAdd(target, ret);
        }

        return ret;
    }
}

class Block extends Base {
    public color: string;

    constructor(pos: Pos, size: Size, canvas: HTMLCanvasElement) {
        super(pos, size, true, canvas);
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
