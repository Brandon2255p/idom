import { iLoading } from "./iloading";
import { iLogin } from "./ilogin";
import { iDev } from "./idev";
import css from "./tasmota.css";
import { iIcon } from "./iicon";

const mqtt = window.mqtt;//require("./mqtt.min.js");

class iDom extends HTMLElement {

    devs = {};
    wdevs = {};

    constructor() {
        super();
        this.worker = new Worker("idomworker.js");
        this.worker.onmessage = (m) => {
            //console.log("message from worker", m);
            if (m.data && m.data.action) {
                switch (m.data.action) {
                    case "login":
                        this.loginDialog();
                        break;
                    case "disconnected":
                        this.netstat.setName("wifioff");
                        this.loginDialog();
                        break;
                    case "connected":
                        this.netstat.setName("wifi");
                        this.loadingNode.style.display = "none";
                        this.loginNode.style.display = "none";
                        //this.wdevs = {};
                        break;
                    case "message":
                        this.onmessage(m.data.topic, m.data.payload);
                        break;
                    default:
                        break;
                }
            }
        }
        this.worker.postMessage({ action: "start" });
    }

    onmessage(topic, payload) {
        const [type, name, cmd] = topic.split("/");
        try {
            if (cmd == "LWT") {
                this.devs[name] = { ...(this.devs[name] || {}), LWT: payload.toString() };
                // this.client.publish(`cmnd/${name}/STATUS0`, "");
                // this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS`, payload: "5" });
                // this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS1`, payload: "" });
                // this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS`, payload: "" });
                if (this.devs[name].STATUS == undefined) this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS`, payload: "" });
                if (this.devs[name].STATUS5 == undefined) this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS`, payload: "5" });
                this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATE`, payload: "" });
            } else if (type == "stat" && cmd.startsWith("STATUS")) {
                this.devs[name] = { ...(this.devs[name] || {}), [cmd]: JSON.parse(payload.toString()) };
            } else if (cmd == "RESULT") {
                this.devs[name] = { ...(this.devs[name] || {}), RESULT: JSON.parse(payload.toString()) };
            } else if (cmd == "SENSOR") {
                this.devs[name] = { ...(this.devs[name] || {}), SENSOR: JSON.parse(payload.toString()) };
            } else if (type == "stat") { // stat/fans/POWER3 ON
                this.devs[name] = { ...(this.devs[name] || {}), [cmd]: payload.toString() };
            } else if (type == "tele" && cmd == "STATE") { // tele/fans/STATE
                this.devs[name] = { ...(this.devs[name] || {}), STATE: JSON.parse(payload.toString()) };
            } else {
                // console.log(topic, payload.toString());
            }
            // log.innerText = JSON.stringify(this.devs, " ", " ");
            this.render();
        } catch (e) {
            console.log(topic.toString(), payload.toString());
        }

    }

    loginDialog() {
        this.loginNode.style.display = "block"
    }

    connectedCallback() {
        const s = this.appendChild(document.createElement("style"));
        s.innerHTML = css;
        this.root = this.appendChild(document.createElement("div"));
        this.loadingNode = this.appendChild(new iLoading());
        this.toolbar = this.appendChild(document.createElement("div"));
        this.toolbar.style.position = "fixed";
        this.toolbar.style.bottom = "0";
        this.toolbar.style.left = "0";
        this.toolbar.style.backgroundColor = "black";
        this.toolbar.style.height = "40px";
        this.toolbar.style.width = "100%";
        this.toolbar.style.display = "flex";
        this.toolbar.style.alignContent = "center";
        this.toolbar.style.justifyContent = "space-evenly";
        this.toolbar.style.alignItems = "center";
        this.toolbar.style.flexDirection = "row";

        this.loginNode = this.appendChild(new iLogin((url, username, password) => {
            //console.log("login");
            localStorage.setItem("idom_url", url);
            localStorage.setItem("idom_username", username);
            localStorage.setItem("idom_password", password);
            this.loadingNode.style.display = "block";
            this.connect();
        }));
        this.loginNode.style.display = "none";


        this.main = this.appendChild(document.createElement("div"));
        this.main.style.paddingBottom = "40px";

        // this.toolbar.style.paddingRight = "6px"
        // this.toolbar.style.paddingTop = "10px";

        this.netstat = this.toolbar.appendChild(new iIcon("wifioff", 24, 24));
        // this.netstat.style.paddingLeft = "10px"
        // this.netstat.style.alignSelf = "flex-start";

        this.logout = this.toolbar.appendChild(new iIcon("logout", 24, 24, () => {
            this.worker.postMessage({ action: "logout" });
        }));
        // logout.style.paddingRight = "10px"
        // this.logout.style.alignSelf = "flex-end";

        this.connect();
    }

    connect() {
        if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
            this.worker.postMessage({ action: "connect", url: localStorage.getItem("idom_url") || 'ws://' + location.host, username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password") });
        } else {
            this.loginDialog();
        }
    }

    render() {
        Object.keys(this.devs).forEach(e => {
            if (this.wdevs[e] == undefined) {
                this.wdevs[e] = this.main.appendChild(new iDev(e, this));
                // this.wdevs[e].style.position = "relative";
            }
            this.wdevs[e].update(this.devs[e]);
        });
    }

    publish(topic, payload) {
        this.worker.postMessage({ action: "publish", topic, payload });
        // this.client.publish(topic, payload);
    }
}

customElements.define('i-dom', iDom);

