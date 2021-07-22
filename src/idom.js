import { iLoading } from "./iloading";
import { iLogin } from "./ilogin";
import { iDev } from "./idev";
import css from "./tasmota.css";

const mqtt = require("./mqtt.min.js");

class iDom extends HTMLElement {

    devs = {};

    constructor() {
        super();
        this.worker = new Worker("idomworker.js");
        this.worker.onmessage = () => {
            console.log("message from worker");
        }
    }

    loginDialog() {
        this.loadingoff();
        this.root.innerHTML = "";
        this.root.appendChild(new iLogin((url, username, password) => {
            console.log("login");
            localStorage.setItem("idom_url", url);
            localStorage.setItem("idom_username", username);
            localStorage.setItem("idom_password", password);
            this.loading();
            this.connect();
        }));
    }

    connectedCallback() {
        const s = this.appendChild(document.createElement("style"));
        s.innerHTML = css;
        this.root = this.appendChild(document.createElement("div"));
        this.loadingNode = this.appendChild(new iLoading());
        this.connect();
    }

    loading() {
        this.loadingNode.style.display = "block";
        // this.root.innerHTML = "";
        // this.root.appendChild(new iLoading());
    }

    loadingoff() {
        console.log("loading off");
        this.loadingNode.style.display = "none";
        // this.root.innerHTML = "";
        // this.root.appendChild(new iLoading());
    }

    connect() {
        if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
            this.client = mqtt.connect(localStorage.getItem("idom_url") || 'ws://' + location.host, { username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password"), reconnectPeriod: 0 })
            this.client.on('close', () => {
                console.log("close");
                this.loginDialog();
            });

            this.client.on("disconnect", (err) => {
                console.log("disconnect");
            });
            this.client.on("error", (err) => {
                console.log("errr", err);
                client.close();
                //this.loginDialog();
            });
            this.client.on("connect", () => {
                this.loadingoff();
                this.root.innerHTML = "";
                this.wdevs = {};
                //const log = this.appendChild(document.createElement("pre"));
                // client.subscribe("tele/#");
                // client.subscribe("state/#");
                this.client.subscribe("#");
                // client.publish("sonoffs/cmnd/state", "");
                this.client.on("message", (topic, payload) => {

                    // const d = this.appendChild(document.createElement("div"));
                    // d.textContent = topic + "," + payload.toString();
                    const [type, name, cmd] = topic.split("/");
                    if (cmd == "LWT") {
                        this.devs[name] = { ...(this.devs[name] || {}), LWT: payload.toString() };
                        // this.client.publish(`cmnd/${name}/STATUS0`, "");
                        this.client.publish(`cmnd/${name}/STATUS`, "0");
                        this.client.publish(`cmnd/${name}/STATE`, "");
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
                        console.log(topic, payload.toString());
                    }
                    // log.innerText = JSON.stringify(this.devs, " ", " ");
                    this.render();
                });
            });
        } else {
            this.loginDialog();
        }
    }

    render() {
        Object.keys(this.devs).forEach(e => {
            if (this.wdevs[e] == undefined) {
                this.wdevs[e] = this.root.appendChild(new iDev(e, this));
            }
            this.wdevs[e].update(this.devs[e]);
        });
    }

    publish(topic, payload) {
        this.client.publish(topic, payload);
    }
}

customElements.define('i-dom', iDom);

