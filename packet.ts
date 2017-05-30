abstract class Packet {
    public static parsePacketId(strPacket: string): number {
        return JSON.parse(strPacket).id;
    }

    public static getPacket(room: Room, id: number): Packet {
        switch (id) {
            case LoginPacket.PACKET_ID:
                return new LoginPacket(room as BattleRoom);
            case LogoutPacket.PACKET_ID:
                return new LogoutPacket(room as BattleRoom);
            case AddCharacterPacket.PACKET_ID:
                return new AddCharacterPacket(room as BattleRoom);
            case MovePacket.PACKET_ID:
                return new MovePacket(room as BattleRoom);
            case SetBombPacket.PACKET_ID:
                return new SetBombPacket(room as BattleRoom);
            case DeadPacket.PACKET_ID:
                return new DeadPacket(room as BattleRoom);
            case FinishPacket.PACKET_ID:
                return new FinishPacket(room as BattleRoom);
            default:
                return null;
        }
    }

    public id: number;

    constructor(id: number) {
        this.id = id;
    }

    abstract getPacketId(): number;
    abstract receive(strPacket: string);
}

class LoginPacket extends Packet {
    static PACKET_ID = 1;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(LoginPacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return LoginPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase != BattleRoom.PHASE_INIT || jsonPacket.result == 0)
        {
            return;
        }
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
    
    public send() {
        var jsonPacket = {"id":this.getPacketId()};
        webSocketClient.send(JSON.stringify(jsonPacket));
    }
}

class LogoutPacket extends Packet {
    static PACKET_ID = 2;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(LogoutPacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return LogoutPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
    }
    
    public send() {
        var jsonPacket = {"id":this.getPacketId()};
        webSocketClient.send(JSON.stringify(jsonPacket));
    }
}

class AddCharacterPacket extends Packet {
    static PACKET_ID = 3;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(AddCharacterPacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return AddCharacterPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == BattleRoom.PHASE_INIT)
        {
            return;
        }
        var enemyId = jsonPacket.eId;
        var enemyPos = this.room.map.baseToCurrentScale(new Pos(jsonPacket.ePos[0], jsonPacket.ePos[1]));
        this.room.addEnemy(enemyId, enemyPos);
    }
}

class MovePacket extends Packet {
    static PACKET_ID = 4;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(MovePacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return MovePacket.PACKET_ID;
    }
    
    public send(pos: Pos, add: Pos) {
        if (this.room instanceof BattleRoom) {
            var basePos = this.room.map.currentToBaseScale(pos);
            var baseAdd = this.room.map.currentToBaseScale(add);
            var jsonPacket = {"id":this.getPacketId(),"pos":basePos.getIntArray(),"add":baseAdd.getIntArray()};
            webSocketClient.send(JSON.stringify(jsonPacket));
        }
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == BattleRoom.PHASE_INIT)
        {
            return;
        }
        var enemyId = jsonPacket.eId;
        var enemyPos = this.room.map.baseToCurrentScale(new Pos(jsonPacket.ePos[0], jsonPacket.ePos[1]));
        var enemyAdd = this.room.map.baseToCurrentScale(new Pos(jsonPacket.eAdd[0], jsonPacket.eAdd[1]));
        this.room.getEnemy(enemyId).reload(enemyPos, enemyAdd);
    }
}

class SetBombPacket extends Packet {
    static PACKET_ID = 5;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(SetBombPacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return SetBombPacket.PACKET_ID;
    }

    public send(bombPos: Pos) {
        if (this.room instanceof BattleRoom) {
            var jsonPacket = {"id":this.getPacketId(),"pos":bombPos.getIntArray()};
            webSocketClient.send(JSON.stringify(jsonPacket));
        }
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == BattleRoom.PHASE_INIT)
        {
            return;
        }
        var result = jsonPacket.result;
        if (result == 1) {
            var characterId = jsonPacket.cId;
            var bombPos = new Pos(jsonPacket.bPos[0], jsonPacket.bPos[1]);
            this.room.map.setBomb(bombPos);
        }
    }
}

class DeadPacket extends Packet {
    static PACKET_ID = 6;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(DeadPacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return DeadPacket.PACKET_ID;
    }

    public send() {
        if (this.room instanceof BattleRoom) {
            var jsonPacket = {"id":this.getPacketId()};
            webSocketClient.send(JSON.stringify(jsonPacket));
        }
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == BattleRoom.PHASE_INIT)
        {
            return;
        }
        var enemyId = jsonPacket.eId;
        this.room.getEnemy(enemyId).setLife(0);
    }
}

class FinishPacket extends Packet {
    static PACKET_ID = 7;
    public room: BattleRoom;

    constructor(room: BattleRoom) {
        super(FinishPacket.PACKET_ID);
        this.room = room;
    }

    public getPacketId(): number {
        return FinishPacket.PACKET_ID;
    }

    public receive(strPacket: string) {
        var jsonPacket = JSON.parse(strPacket);
        if (this.room.phase == BattleRoom.PHASE_INIT)
        {
            return;
        }
        var characterId = jsonPacket.cId;
        if (characterId == 0) {
            this.room.phase = BattleRoom.PHASE_DRAW;
        } else if (characterId == this.room.player.id) {
            this.room.phase = BattleRoom.PHASE_WIN;
        } else {
            this.room.phase = BattleRoom.PHASE_LOSE;
        }
    }
}