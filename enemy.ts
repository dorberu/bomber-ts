class Enemy extends Character {
    constructor(canvas: HTMLCanvasElement, map: Map) {
        var size = new Size(20, 20);
        var pos = new Pos(canvas.width - size.width * 2, canvas.height - size.height * 2);
        super(pos, size, canvas, map, "#f00");
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

        add = this.map.checkAdd(this, add);
        add = this.map.player.checkAdd(this, add);
        this.pos.x += add.x;
        this.pos.y += add.y;
    }
}