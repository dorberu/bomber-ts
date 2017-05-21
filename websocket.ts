class WebSocketClient {
    public ws: WebSocket;
    public handler: MessageHandler;

    constructor(url: string, handler: MessageHandler) {
        this.ws = new WebSocket(url);
        this.handler = handler;
    }

    public connect() {
        var handler = this.handler;
        this.ws.onopen = function() {
            handler.onMessageOpen();
        };

        this.ws.onmessage = function(e) {
            handler.onMessagePacket(e.data);
        };

        this.ws.onerror = function(e) {
            handler.onMessageError();
        };

        this.ws.close = function() {
            handler.onMessageClose();
        };
    }

    public send(data: string) {
        if (this.ws.readyState == WebSocket.OPEN) {
            this.ws.send(data);
        }
    }
}

class MessageHandler {
    public onMessageOpen() {}
    public onMessagePacket(strPacket: string) {}
    public onMessageError() {}
    public onMessageClose() {}
}