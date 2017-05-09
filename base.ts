class Pos {
    public x: number;
    public y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Size {
    public width: number;
    public height: number;

    constructor (width: number, height: number) {
        this.width = width;
        this.height = height;
    }

}

abstract class Base {
    public pos: Pos;
    public size: Size;
    public colFlag;
    public canvas;
    
    constructor(pos: Pos, size: Size, colFlag: boolean, canvas: HTMLCanvasElement) {
        this.pos = pos;
        this.size = size;
        this.colFlag = colFlag;
        this.canvas = canvas;
    }

    abstract update(): void;
    abstract draw(): void;

    public checkAdd(target: Base, add: Pos): Pos {
        var ret = new Pos(add.x, add.y);

        if (!this.colFlag || !target.colFlag) {
            return ret;
        }

        if (Math.abs(this.pos.y - target.pos.y) < this.size.height / 2 + target.size.height / 2) {
            if (this.pos.x > target.pos.x + target.size.width - 1 && add.x > 0) {
                ret.x = Math.min(add.x, this.pos.x - target.pos.x - target.size.width);
            }
            else if (this.pos.x + this.size.width < target.pos.x + 1 && add.x < 0) {
                ret.x = Math.max(add.x, this.pos.x + this.size.width - target.pos.x);
            }
        }
        if (Math.abs(this.pos.x - target.pos.x - ret.x) < this.size.width / 2 + target.size.width / 2) {
            if (this.pos.y > target.pos.y + target.size.height - 1 && add.y > 0) {
                ret.y = Math.min(add.y, this.pos.y - target.pos.y - target.size.height);
            }
            else if (this.pos.y + this.size.height < target.pos.y + 1 && add.y < 0) {
                ret.y = Math.max(add.y, this.pos.y + this.size.height - target.pos.y);
            }
        }
        return ret;
    }
}
