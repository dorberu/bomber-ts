const WIDTH = 420;
const HEIGHT = 420;
const FPS = 30;

var field: HTMLElement;
var canvas: HTMLCanvasElement;

var room: BattleRoom;

function init() {
    field = document.getElementById('field');
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    field.appendChild(canvas);

    keyController = new KeyController();
    room = new BattleRoom(canvas);
    room.init();
}

function update() {
    this.room.update();
    draw();
    setTimeout(update, 1000 / FPS);
}

function draw() {
    this.room.draw();
}

window.onload = function() {
    init();
    update();
    document.addEventListener(EventName.DOWN, keyDown);
    document.addEventListener(EventName.UP, keyUp);
};
