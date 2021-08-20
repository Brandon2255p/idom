import { connect, StringCodec } from "nats.ws";
// importScripts('paho-mqtt.js');
const sc = StringCodec();
async function handle(s) {
    for await (const m of s) {
        postMessage({ action: "message", topic: m.subject.replaceAll(".", "/"), payload: sc.decode(m.data) });
    }
    console.log("subscription closed");
}

let client = undefined;

onmessage = (m) => {
    if (m.data && m.data.action) {
        switch (m.data.action) {
            case "logout":
                client.close();
                // client.disconnect();
                break;
            case "connect":
                connect({ servers: m.data.url, user: m.data.username, pass: m.data.password, pingInterval: 2000, maxReconnectAttempts: -1 }).then(cli => {
                    client = cli;
                    postMessage({ action: "connected" });
                    handle(client.subscribe("stat.>"));
                    handle(client.subscribe("tele.>"));
                    handle(client.subscribe("hikmqtt.>"));
                    handle(client.subscribe("weather.>"));
                    client.publish("cmnd.tasmotas.STATE", sc.encode(""));
                    client.publish("cmnd.tasmotas.STATUS", sc.encode(""));
                    client.publish("cmnd.tasmotas.STATUS", sc.encode("5"));
                    client.publish("cmnd.tasmotas.STATUS", sc.encode("8"));
                    client.publish("cmnd.sonoffs.STATE", sc.encode(""));
                    client.publish("cmnd.sonoffs.STATUS", sc.encode(""));
                    client.publish("cmnd.sonoffs.STATUS", sc.encode("5"));
                    client.publish("cmnd.sonoffs.STATUS", sc.encode("8"));

                    (async () => {
                        for await (const s of client.status()) {
                            // console.info(`${s.type}: ${s.data}`);
                            if (s.type == "disconnect") {
                                postMessage({ action: "disconnected" });
                            } else if (s.type == "reconnect") {
                                postMessage({ action: "connected" });
                            }
                        }
                    })().then();
                    client.closed().then(() => {
                        postMessage({ action: "disconnected" });
                    })
                });

                // client = new Paho.Client(m.data.url + (m.data.url.endsWith("/") ? "" : "/"), "jspahocli" + uid);
                // client.onConnectionLost = () => { console.log("onConnectionLost"); postMessage({ action: "disconnected" }); }
                // client.onMessageArrived = (m) => {
                //     // console.log("onMessageArrived", m);
                //     postMessage({ action: "message", topic: m.topic, payload: m.payloadString });
                // };
                // client.connect({
                //     userName: m.data.username,
                //     password: m.data.password,
                //     timeout: 10,
                //     reconnect: true,
                //     keepAliveInterval: 10,
                //     onSuccess: () => {
                //         // console.log("onSuccess");
                //         postMessage({ action: "connected" });
                //         client.subscribe("stat/#");
                //         client.subscribe("tele/#");
                //         client.subscribe("hikmqtt/#");
                //         client.subscribe("$SYS/#");
                //     },
                //     onFailure: () => {
                //         console.log("onFailure");
                //         postMessage({ action: "disconnected" });
                //     }
                // });


                break;
            case "publish":
                //console.log("publish", m.data.topic, m.data.payload);
                if (client) {
                    client.publish(m.data.topic.replaceAll("/", "."), sc.encode(m.data.payload));
                }
                break;
            default:
                postMessage({ action: "login" });
                // console.log(m.data);
                break;
        }
    }
}