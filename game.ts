var field: HTMLElement;
var canvas: HTMLCanvasElement;

var room: BattleRoom;

function init() {
    field = document.getElementById('field');
    canvas = document.createElement("canvas");
    var size = Math.min(window.innerWidth, window.innerHeight) * 0.98;
    canvas.width = size;
    canvas.height = size;
    field.appendChild(canvas);

    room = new BattleRoom();
}

function update() {
    room.update();
    draw();
    setTimeout(update, 1000 / FPS);
}

function draw() {
    room.draw();
}

window.onload = function() {
    init();
    update();
    document.addEventListener(EventName.DOWN, keyDown);
    document.addEventListener(EventName.UP, keyUp);
};
