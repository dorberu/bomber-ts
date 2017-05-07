const WIDTH = 600;
const HEIGHT = 600;
const FPS = 30;

var field : HTMLElement;
var canvas : HTMLCanvasElement;

var map : Map;
var player : Player;
var enemy : Enemy;

function init() {
    field = document.getElementById('field');
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    field.appendChild(canvas);

    map = new Map(canvas, WIDTH, HEIGHT);
    enemy = new Enemy(canvas, map);
    player = new Player(canvas, map);

    keyController = new KeyController();
}

function draw() {
    map.draw();
    enemy.draw();
    player.draw();
}

function update() {
    enemy.update();
    player.update(keyController);
    draw();
    setTimeout(update, 1000 / FPS);
}

window.onload = function() {
    init();
    update();
    document.addEventListener(EventName.DOWN, keyDown);
    document.addEventListener(EventName.UP, keyUp);
};
