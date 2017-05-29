class WebSocketClient {
    private webSocket: WebSocket;
    private handler: MessageHandler;

    constructor(url: string, handler: MessageHandler) {
        this.webSocket = new WebSocket(url);
        this.handler = handler;
    }

    public connect() {
        var handler = this.handler;
        this.webSocket.onopen = function() {
            handler.onMessageOpen();
        };

        this.webSocket.onmessage = function(e) {
            handler.onMessagePacket(e.data);
        };

        this.webSocket.onerror = function(e) {
            handler.onMessageError();
        };

        this.webSocket.close = function() {
            handler.onMessageClose();
        };
    }

    public send(data: string) {
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(data);
        }
    }
}

var webSocketClient: WebSocketClient;

class MessageHandler {
    public onMessageOpen() {}
    public onMessagePacket(strPacket: string) {}
    public onMessageError() {}
    public onMessageClose() {}
}