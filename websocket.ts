class WebSocketClient {
    public connect() {
        var ws = new WebSocket('ws://localhost:8080');

        ws.onopen = function() {
            var packet = JSON.stringify({p : 123});
            ws.send(packet);
        };

        ws.onmessage = function(e) {
            var holder : HTMLElement = document.getElementById('holder');
            var textnode = document.createTextNode(e.data);
            holder.appendChild(textnode);
        };

        ws.onerror = function(e) {
            console.log("websocket error.");
        };

        ws.close = function() {
            console.log("websocket close.");
        };
    }

}