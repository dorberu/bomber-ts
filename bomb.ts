class Bomb extends Base {
    public map: Map;
    public rest: number;
    public end: boolean;
    public color: string;

    constructor(pos: Pos, size: Size, rest: number, canvas: HTMLCanvasElement, map: Map) {
        super(pos, size, true, canvas);
        this.map = map;
        this.rest = rest;
        this.end = false;
        this.color = "#000";
    }

    public update() {
        this.rest = Math.max(this.rest - 1, 0);
        if (this.rest <= 0) {
            this.end = true;
        }
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();
    }
}