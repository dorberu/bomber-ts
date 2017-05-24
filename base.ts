class Pos {
    public x: number;
    public y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getIntArray(): number[] {
        return [ this.x, this.y ];
    }

    public equals(target: Pos) {
        if (this.x != target.x) return false;
        if (this.y != target.y) return false;
        return true;
    }
}

class Size {
    public width: number;
    public height: number;

    constructor (width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public getIntArray(): number[] {
        return [ this.width, this.height ];
    }

    public equals(target: Size) {
        if (this.width != target.width) return false;
        if (this.height != target.height) return false;
        return true;
    }
}

abstract class Base {
    public pos: Pos;
    public size: Size;
    public colFlag;
    
    constructor(pos: Pos, size: Size, colFlag: boolean) {
        this.pos = pos;
        this.size = size;
        this.colFlag = colFlag;
    }

    abstract update(): void;
    abstract draw(): void;

    public isHit(target: Base): boolean {
        if (Math.abs(this.pos.x - target.pos.x) < this.size.width / 2 + target.size.width / 2
            && Math.abs(this.pos.y - target.pos.y) < this.size.height / 2 + target.size.height / 2) {
            return true;
        }

        return false;
    }

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
