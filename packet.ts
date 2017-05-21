abstract class Packet {
    public static parsePacketId(strPacket: string): number {
        return JSON.parse(strPacket).id;
    }

    public static getPacket(wsc: WebSocketClient, room: Room, id: number): Packet {
        switch (id) {
            case LoginPacket.PACKET_ID:
                return new LoginPacket(wsc, room);
            case LogoutPacket.PACKET_ID:
                return new LogoutPacket(wsc, room);
            case AddCharacterPacket.PACKET_ID:
                return new AddCharacterPacket(wsc, room);
            case MovePacket.PACKET_ID:
                return new MovePacket(wsc, room);
            default:
                return null;
        }
    }

    protected wsc: WebSocketClient;
    protected room: Room;
    public id: number;

    constructor(wsc: WebSocketClient, room: Room, id: number) {
        this.wsc = wsc;
        this.room = room;
        this.id = id;
    }

    abstract getPacketId(): number;
    abstract receive(strPacket: string);
}

class LoginPacket extends Packet {
    static PACKET_ID = 1;

    constructor(wsc: WebSocketClient, room: Room) {
        super(wsc, room, LoginPacket.PACKET_ID);
    }

    public getPacketId(): number {
        return LoginPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase != Room.PHASE_INIT || jsonPacket.result == 0)
        {
            return;
        }
        if (this.room instanceof BattleRoom) {
            var baseBlockSize = new Size(jsonPacket.bSize[0], jsonPacket.bSize[1]);
            var blockNum = new Size(jsonPacket.bNum[0], jsonPacket.bNum[1]);
            var mapInfo: number[][] = jsonPacket.mapInfo;
            this.room.init(baseBlockSize, blockNum, mapInfo);
            var playerId: number = jsonPacket.pId;
            var playerPos: number[] = jsonPacket.pPos;
            var enemyIds: number[] = jsonPacket.eIds;
            var enemyPoss: number[][] = jsonPacket.ePoss;
            this.room.setCharacter(playerId, playerPos, enemyIds, enemyPoss);
        }
    }
    
    public send() {
        var jsonPacket = {"id":this.getPacketId()};
        this.wsc.send(JSON.stringify(jsonPacket));
    }
}

class LogoutPacket extends Packet {
    static PACKET_ID = 2;

    constructor(wsc: WebSocketClient, room: Room) {
        super(wsc, room, LogoutPacket.PACKET_ID);
    }

    public getPacketId(): number {
        return LogoutPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
    }
    
    public send() {
        var jsonPacket = {"id":this.getPacketId()};
        this.wsc.send(JSON.stringify(jsonPacket));
    }
}

class AddCharacterPacket extends Packet {
    static PACKET_ID = 3;

    constructor(wsc: WebSocketClient, room: Room) {
        super(wsc, room, AddCharacterPacket.PACKET_ID);
    }

    public getPacketId(): number {
        return AddCharacterPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == Room.PHASE_INIT)
        {
            return;
        }
        if (this.room instanceof BattleRoom) {
            var enemyId = jsonPacket.eId;
            var enemyPos = this.room.map.baseToCurrentScale(new Pos(jsonPacket.ePos[0], jsonPacket.ePos[1]));
            this.room.addEnemy(enemyId, enemyPos);
        }
    }
}

class MovePacket extends Packet {
    static PACKET_ID = 4;

    constructor(wsc: WebSocketClient, room: Room) {
        super(wsc, room, MovePacket.PACKET_ID);
    }

    public getPacketId(): number {
        return MovePacket.PACKET_ID;
    }
    
    public send(pos: Pos, add: Pos) {
        if (this.room instanceof BattleRoom) {
            var basePos = this.room.map.currentToBaseScale(pos);
            var baseAdd = this.room.map.currentToBaseScale(add);
            var jsonPacket = {"id":this.getPacketId(),"pos":basePos.getIntArray(),"add":baseAdd.getIntArray()};
            this.wsc.send(JSON.stringify(jsonPacket));
        }
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == Room.PHASE_INIT)
        {
            return;
        }
        if (this.room instanceof BattleRoom) {
            var enemyId = jsonPacket.eId;
            var enemyPos = this.room.map.baseToCurrentScale(new Pos(jsonPacket.ePos[0], jsonPacket.ePos[1]));
            var enemyAdd = this.room.map.baseToCurrentScale(new Pos(jsonPacket.eAdd[0], jsonPacket.eAdd[1]));
            this.room.getEnemy(enemyId).reload(enemyPos, enemyAdd);
        }
    }
}