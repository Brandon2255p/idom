// importScripts('paho-mqtt.js');
const Paho = require("./paho-mqtt");

let client = undefined;


var firstPart = (Math.random() * 46656) | 0;
var secondPart = (Math.random() * 46656) | 0;
firstPart = ("000" + firstPart.toString(36)).slice(-3);
secondPart = ("000" + secondPart.toString(36)).slice(-3);
const uid = firstPart + secondPart;


onmessage = (m) => {

    if (m.data && m.data.action) {
        switch (m.data.action) {
            case "logout":
                client.disconnect();
                break;
            case "connect":
                // console.log("connect");
                client = new Paho.Client(m.data.url + (m.data.url.endsWith("/") ? "" : "/"), "jspahocli" + uid);
                client.onConnectionLost = () => { console.log("onConnectionLost"); postMessage({ action: "disconnected" }); }
                client.onMessageArrived = (m) => {
                    // console.log("onMessageArrived", m);
                    postMessage({ action: "message", topic: m.topic, payload: m.payloadString });
                };
                client.connect({
                    userName: m.data.username,
                    password: m.data.password,
                    timeout: 10,
                    reconnect: true,
                    keepAliveInterval: 10,
                    onSuccess: () => {
                        // console.log("onSuccess");
                        postMessage({ action: "connected" });
                        client.subscribe("stat/#");
                        client.subscribe("tele/#");
                        client.subscribe("hikmqtt/#");
                        client.subscribe("$SYS/#");
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