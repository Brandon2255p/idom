importScripts('paho-mqtt.js');

let client = undefined;

onmessage = (m) => {

    if (m.data && m.data.action) {
        switch (m.data.action) {
            case "logout":
                client.disconnect();
                break;
            case "connect":
                // console.log("connect");
                client = new Paho.Client(m.data.url + (m.data.url.endsWith("/") ? "" : "/"), "jspahocli");
                client.onConnectionLost = () => { console.log("onConnectionLost"); postMessage({ action: "disconnected" }); }
                client.onMessageArrived = (m) => {
                    // console.log("onMessageArrived", m);
                    postMessage({ action: "message", topic: m.topic, payload: m.payloadString });
                };
                client.connect({
                    userName: m.data.username,
                    password: m.data.password,
                    timeout: 3,
                    reconnect: true,
                    keepAliveInterval: 3,
                    onSuccess: () => {
                        // console.log("onSuccess");
                        postMessage({ action: "connected" });
                        client.subscribe("stat/#");
                        client.subscribe("tele/#");
                        client.subscribe("camsnap/#");
                    },
                    onFailure: () => {
                        console.log("onFailure");
                        postMessage({ action: "disconnected" });
                    }
                });


                // client.on('close', (a) => {
                //     console.log("close", a);
                //     postMessage({ action: "login" });
                //     postMessage({ action: "disconnected" });
                // });
                // client.on("packetreceive", p => {
                //     console.log("PACKET", p.topic);
                // })
                // client.on("disconnect", (err) => {
                //     console.log("disconnect");
                //     postMessage({ action: "disconnected" });
                // });
                // client.on("error", (err) => {
                //     console.log("errr", err.message);
                //     //client.close();
                //     postMessage({ action: "disconnected" });
                // });
                // client.on("connect", () => {
                //     postMessage({ action: "connected" });
                //     client.subscribe("stat/#");
                //     client.subscribe("tele/#");
                //     client.subscribe("camsnap/#");
                //     client.on("message", (topic, payload) => {
                //         console.log(topic)
                //         postMessage({ action: "message", topic: topic.toString(), payload: payload.toString() });
                //     });
                // });

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