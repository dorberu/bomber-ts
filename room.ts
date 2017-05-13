class Room {
    public canvas : HTMLCanvasElement;

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }
}

class BattleRoom extends Room {
    public map : Map;
    public enemy : Enemy;
    public player : Player;

    constructor (canvas: HTMLCanvasElement) {
        super(canvas);
        this.map = new Map(this);
        this.enemy = new Enemy(this);
        this.player = new Player(this, keyController);
    }

    public init() {
        this.map.init();
        this.enemy.init();
        this.player.init();
    }

    public update() {
        this.map.update();
        this.enemy.update();
        this.player.update();
    }

    public draw() {
        this.map.draw();
        this.enemy.draw();
        this.player.draw();
    }
}
