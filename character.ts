class Character extends Base {
    public map;
    public life;
    public speed;

    constructor(canvas: HTMLCanvasElement, map: Map, x: number, y: number, width: number, height: number) {
        super(canvas, x, y, width, height);
        this.map = map;
        this.life = 1;
        this.speed = 5;
    }

    public move(x: number, y: number) {
        this.x = Math.min(Math.max(this.x + x, 0), this.map.x + this.map.width - this.width);
        this.y = Math.min(Math.max(this.y + y, 0), this.map.y + this.map.height - this.height);
    }
}

class Player extends Character {
    constructor(canvas: HTMLCanvasElement, map: Map) {
        super(canvas, map, 0, 0, 20, 20);
        this.color = "#00f";
    }

    public update(key : KeyController) {
        var addX = 0;
        var addY = 0;
        addX -= (key.left) ? this.speed : 0;
        addY -= (key.up) ? this.speed : 0;
        addX += (key.right) ? this.speed : 0;
        addY += (key.down) ? this.speed : 0;
        this.move(addX, addY);
    }
}

class Enemy extends Character {
    constructor(canvas: HTMLCanvasElement, map: Map) {
        super(canvas, map, 580, 580, 20, 20);
        this.color = "#f00";
    }

    public update() {
        var addX = 0;
        var addY = 0;
        addX -= (Math.random() < 0.2) ? this.speed : 0;
        addY -= (Math.random() < 0.2) ? this.speed : 0;
        addX += (Math.random() < 0.2) ? this.speed : 0;
        addY += (Math.random() < 0.2) ? this.speed : 0;
        this.move(addX, addY);
    }
}