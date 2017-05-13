abstract class Character extends Base {
    public room: BattleRoom;
    public life: number;
    public speed: number;
    public color: string;

    constructor(pos: Pos, size: Size, room: BattleRoom, color: string) {
        super(pos, size, true, room.canvas);
        this.room = room;
        this.color = color;
        this.life = 1;
        this.speed = 5;
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.fill();
    }
}