import { iLoading } from "./iloading";
import { iLogin } from "./ilogin";
import { iDev } from "./idev";
import css from "./tasmota.css";
import { iIcon } from "./iicon";

const mqtt = window.mqtt;

class iDom extends HTMLElement {

    devs = new Proxy({}, {
        set: (obj, p, v) => {
            obj[p] = v;
            this.render(p);
            return true;
        }
    });

    wdevs = {};
    lastOrder = 0;

    constructor() {
        super();
        this.worker = new Worker("idomworker.js");
        this.worker.onmessage = (m) => {

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
                if (this.devs[name].STATUS == undefined) this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS`, payload: "" });
                if (this.devs[name].STATUS5 == undefined) this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATUS`, payload: "5" });
                this.worker.postMessage({ action: "publish", topic: `cmnd/${name}/STATE`, payload: "" });
            } else if (type == "stat" && cmd.startsWith("STATUS")) {
                this.devs[name] = { ...(this.devs[name] || {}), [cmd]: JSON.parse(payload.toString()) };
            } else if (cmd == "RESULT") {
                this.devs[name] = { ...(this.devs[name] || {}), RESULT: JSON.parse(payload.toString()) };
            } else if (cmd == "SENSOR") {
                this.devs[name] = { ...(this.devs[name] || {}), SENSOR: JSON.parse(payload.toString()) };
            } else if (type == "stat") {
                this.devs[name] = { ...(this.devs[name] || {}), [cmd]: payload.toString() };
            } else if (type == "tele" && cmd == "STATE") {
                this.devs[name] = { ...(this.devs[name] || {}), STATE: JSON.parse(payload.toString()) };
            } else {
                // console.log(topic, payload.toString());
            }

            // this.render();
        } catch (e) {
            console.log(e);//, topic.toString(), payload.toString());
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
        this.toolbar.style.paddingTop = "6px";
        this.toolbar.style.position = "fixed";
        this.toolbar.style.bottom = "0";
        this.toolbar.style.left = "0";
        this.toolbar.style.backgroundColor = "black";
        this.toolbar.style.height = "54px";
        this.toolbar.style.width = "100%";
        this.toolbar.style.display = "flex";
        this.toolbar.style.alignContent = "center";
        this.toolbar.style.justifyContent = "space-evenly";
        this.toolbar.style.alignItems = "flex-start";
        this.toolbar.style.flexDirection = "row";

        this.loginNode = this.appendChild(new iLogin((url, username, password) => {
            localStorage.setItem("idom_url", url);
            localStorage.setItem("idom_username", username);
            localStorage.setItem("idom_password", password);
            this.loadingNode.style.display = "block";
            this.connect();
        }));
        this.loginNode.style.display = "none";

        this.main = this.appendChild(document.createElement("div"));
        this.main.className = "idom-main";
        // this.main.style.paddingBottom = "60px";
        // this.main.style.display = "flex";
        // this.main.style.flexDirection = "column";
        // this.main.style.gap = "1rem";

        this.netstat = this.toolbar.appendChild(new iIcon("wifioff", 24, 24));

        this.logout = this.toolbar.appendChild(new iIcon("logout", 24, 24, () => {
            this.worker.postMessage({ action: "logout" });
        }));

        this.connect();
    }

    connect() {
        if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
            this.worker.postMessage({ action: "connect", url: localStorage.getItem("idom_url") || 'ws://' + location.host, username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password") });
        } else {
            this.loginDialog();
        }
    }

    // reorder() {
    //     Object.keys(this.wdevs).sort((a, b) => {
    //         return (this.wdevs[a].deviceName || this.wdevs[a].name).localeCompare((this.wdevs[b].deviceName || this.wdevs[b].name));
    //     }).forEach((e, idx) => {
    //         console.log(e);
    //         this.wdevs[e].style.order = idx;
    //     })
    // }

    render(name) {
        // console.log("render", name);
        if (name) {
            if (this.wdevs[name] == undefined) {
                this.wdevs[name] = this.main.appendChild(new iDev(name, this));
                this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
                this.lastOrder = (localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1);
                this.wdevs[name].className = "idom-device";
            }
            this.wdevs[name].update(this.devs[name]);
        } else {
            Object.keys(this.devs).forEach(e => {
                this.render(e);
            });
        }
    }

    publish(topic, payload) {
        this.worker.postMessage({ action: "publish", topic, payload });
    }
}

customElements.define('i-dom', iDom);

