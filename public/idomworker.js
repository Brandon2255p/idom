(() => {
  // src/idomworker.js
  importScripts("mqtt.min.js");
  var client = void 0;
  onmessage = (m) => {
    if (m.data && m.data.action) {
      switch (m.data.action) {
        case "connect":
          if (client) {
            console.log("reconnect");
            client.reconnect(m.data.url, {...m.data});
          } else {
            console.log("connect");
            client = mqtt.connect(m.data.url, {...m.data, keepalive: 1});
            client.on("close", () => {
              console.log("close");
              postMessage({action: "login"});
            });
            client.on("disconnect", (err) => {
              console.log("disconnect");
            });
            client.on("error", (err) => {
              console.log("errr", err.message);
            });
            client.on("connect", () => {
              postMessage({action: "connected"});
              client.subscribe("#");
              client.on("message", (topic, payload) => {
                postMessage({action: "message", topic, payload: payload.toString()});
              });
            });
          }
          break;
        case "publish":
          if (client) {
            client.publish(m.data.topic, m.data.payload);
          }
          break;
        default:
          postMessage({action: "login"});
          console.log(m.data);
          break;
      }
    }
  };
})();
