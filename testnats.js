// const { connect, StringCodec } = require("nats");
globalThis.WebSocket = require("websocket").w3cwebsocket;
const { connect, StringCodec } = require("nats.ws");

const sc = StringCodec();

async function handle(s) {
    for await (const m of s) {
        console.log(`[${s.getProcessed()}]: ${m.subject}`); //${sc.decode(m.data)}
    }
    console.log("subscription closed");
}

try {
    connect({ servers: "ws://192.168.112.1:8080", user: "web", pass: "pa%%word", pingInterval: 2000 }).then(nc => {
        // connect({ servers: "192.168.112.1", user: "web", pass: "pa%%word" }).then(async (nc) => {
        (async () => {
            console.info(`connected ${nc.getServer()}`);
            for await (const s of nc.status()) {
                console.info(`${s.type}: ${s.data}`);
            }
        })().then();

        console.log(`connected to ${nc.getServer()}`);
        // this promise indicates the client closed

        // do something with the connection

        handle(nc.subscribe("stat.>"));
        handle(nc.subscribe("tele.>"));
        handle(nc.subscribe("hikmqtt.>"));
        // close the connection
        // nc.close().then(() => {
        //     console.log("closed");
        //     done.then(err => {
        //         console.log("done");
        //         if (err) {
        //             console.log(`error closing:`, err);
        //         }
        //     })
        // })


        const done = nc.closed();
        done.then(err => {
            console.log("done");
            if (err) {
                console.log(`error closing:`, err);
            }
        })

    });
} catch (err) {
    console.log(`error connecting to ${JSON.stringify(v)}`);
}