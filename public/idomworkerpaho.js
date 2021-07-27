(() => {
  // src/idomworkerpaho.js
  importScripts("paho-mqtt.js");
  var client = void 0;
  var firstPart = Math.random() * 46656 | 0;
  var secondPart = Math.random() * 46656 | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  var uid = firstPart + secondPart;
  onmessage = (m) => {
    if (m.data && m.data.action) {
      switch (m.data.action) {
        case "logout":
          client.disconnect();
          break;
        case "connect":
          client = new Paho.Client(m.data.url + (m.data.url.endsWith("/") ? "" : "/"), "jspahocli" + uid);
          client.onConnectionLost = () => {
            console.log("onConnectionLost");
            postMessage({action: "disconnected"});
          };
          client.onMessageArrived = (m2) => {
            postMessage({action: "message", topic: m2.topic, payload: m2.payloadString});
          };
          client.connect({
            userName: m.data.username,
            password: m.data.password,
            timeout: 10,
            reconnect: true,
            keepAliveInterval: 10,
            onSuccess: () => {
              postMessage({action: "connected"});
              client.subscribe("stat/#");
              client.subscribe("tele/#");
              client.subscribe("hikmqtt/#");
              client.subscribe("$SYS/#");
            },
            onFailure: () => {
              console.log("onFailure");
              postMessage({action: "disconnected"});
            }
          });
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
