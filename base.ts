class Base {
    public canvas;
    public x;
    public y;
    public width;
    public height;
    public color;
    
    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#abc";
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}