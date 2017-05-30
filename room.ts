class Room implements MessageHandler {
    constructor () {
        keyController = new KeyController();
    }

    public onMessageOpen() {
        console.log("websocket open.");
    }

    public onMessagePacket(strPacket: string) {
        console.log("websocket message: " + strPacket);
        var packetId = Packet.parsePacketId(strPacket);
        var packet = Packet.getPacket(this, packetId);
        if (packet != null) {
            packet.receive(strPacket);
        } else {
            console.log("websocket error. invalid packet id: " + packetId);
        }
    }

    public onMessageError() {
        console.log("websocket error.");
    }

    public onMessageClose() {
        console.log("websocket close.");
    }
}

class BattleRoom extends Room {
    public static PHASE_INIT = 1;
    public static PHASE_PLAY = 2;
    public static PHASE_WIN = 3;
    public static PHASE_LOSE = 4;
    public static PHASE_DRAW = 5;
    public static PHASE_CLOSE = 6;

    public phase: number;

    constructor () {
        super();
        this.phase = BattleRoom.PHASE_INIT;
        keyController = new KeyController();
        webSocketClient = new WebSocketClient('ws://localhost:8080', this);
        webSocketClient.connect();
    }

    public onMessageOpen() {
        super.onMessageOpen();
        var loginPacket = new LoginPacket(this);
        loginPacket.send();
    }

    public map: Map;
    public enemies: Enemy[];
    public player: Player;
    public baseSize: Size;

    public init(baseBlockSize: Size, blockNum: Size, mapInfo: number[][]) {
        this.map = new Map(this, baseBlockSize, blockNum, mapInfo);
    }

    public setCharacter(playerId: number, playerPos: number[], enemyIds: number[], enemyPoss: number[][]) {
        var pPos = this.map.baseToCurrentScale(new Pos(playerPos[0], playerPos[1]));
        this.player = new Player(this, playerId, pPos);
        this.enemies = [];
        for (var i = 0; i < enemyIds.length; i++) {
            var ePos = this.map.baseToCurrentScale(new Pos(enemyPoss[i][0], enemyPoss[i][1]));
            this.addEnemy(enemyIds[i], ePos);
        }
        this.phase = BattleRoom.PHASE_PLAY;
    }

    public update() {
        if (this.phase == BattleRoom.PHASE_INIT) {
            return;
        }
        this.map.update();
        this.player.update();
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
    }

    public getEnemy(enemyId: number): Enemy {
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].id == enemyId) {
                return this.enemies[i];
            }
        }
        return null;
    }

    public addEnemy(enemyId: number, enemyPos) {
        if (this.getEnemy(enemyId) == null) {
            this.enemies.push(new Enemy(this, enemyId, enemyPos));
        }
    }

    public draw() {
        if (this.phase == BattleRoom.PHASE_INIT) {
            return;
        }
        this.map.draw();
        this.player.draw();
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }

        if (this.phase == BattleRoom.PHASE_WIN) {
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.font = "18px 'ＭＳ Ｐゴシック'";
            ctx.strokeStyle = "orange";
            ctx.strokeText("YOU WIN!", 10, 25);
        } else if (this.phase == BattleRoom.PHASE_LOSE) {
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.font = "18px 'ＭＳ Ｐゴシック'";
            ctx.strokeStyle = "blue";
            ctx.strokeText("Lose.", 10, 25);
        } else if (this.phase == BattleRoom.PHASE_DRAW) {
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.font = "18px 'ＭＳ Ｐゴシック'";
            ctx.strokeStyle = "black";
            ctx.strokeText("- Draw -", 10, 25);
        }
    }
}
