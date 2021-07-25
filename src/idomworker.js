importScripts('mqtt.min.js');

let client = undefined;

onmessage = (m) => {

    if (m.data && m.data.action) {
        switch (m.data.action) {
            case "logout":
                // console.log(client);
                client.end();
                break;
            case "connect":
                if (client) {
                    console.log("reconnect");
                    client.reconnect(m.data.url, { ...m.data });
                } else {
                    console.log("connect");
                    client = mqtt.connect(m.data.url, { ...m.data, keepalive: 1 });
                    client.on('close', (a) => {
                        console.log("close", a);
                        postMessage({ action: "login" });
                        //this.loginDialog();
                        postMessage({ action: "disconnected" });
                    });
                    client.on("packetreceive", p => {
                        console.log("PACKET", p.topic);
                    })
                    client.on("disconnect", (err) => {
                        console.log("disconnect");
                        postMessage({ action: "disconnected" });
                    });
                    client.on("error", (err) => {
                        console.log("errr", err.message);
                        //client.close();
                        postMessage({ action: "disconnected" });
                    });
                    client.on("connect", () => {
                        postMessage({ action: "connected" });
                        client.subscribe("stat/#");
                        client.subscribe("tele/#");
                        client.subscribe("camsnap/#");
                        client.on("message", (topic, payload) => {
                            console.log(topic)
                            postMessage({ action: "message", topic: topic.toString(), payload: payload.toString() });
                        });
                    });
                }
                break;
            case "publish":
                // console.log("publish", m.data.topic, m.data.payload);
                if (client) {
                    client.publish(m.data.topic, m.data.payload);
                }
                break;
            default:
                postMessage({ action: "login" });
                console.log(m.data);
                break;
        }
    }
}