const WIDTH = 420;
const HEIGHT = 420;
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

    keyController = new KeyController();

    map = new Map(canvas, FPS);
    enemy = new Enemy(canvas, map);
    player = new Player(canvas, map, keyController);
    map.setCharacter(player, enemy);
}

function draw() {
    map.draw();
    enemy.draw();
    player.draw();
}

function update() {
    map.update();
    enemy.update();
    player.update();
    draw();
    setTimeout(update, 1000 / FPS);
}

window.onload = function() {
    init();
    update();
    document.addEventListener(EventName.DOWN, keyDown);
    document.addEventListener(EventName.UP, keyUp);
};
