import { iLoading } from "./iloading";
import { iLogin } from "./ilogin";
import { iDev } from "./idev";
import { iDevCam } from "./idevcam";
import { iDevWeather } from "./idevweather";
import css from "./tasmota.css";
import { iIcon } from "./iicon";
import { iInfoObject } from "./iinfoobject";

// console.log(gg);

const mqtt = window.mqtt;

class iDom extends HTMLElement {

    devs = new Proxy({}, {
        set: (obj, p, v) => {
            obj[p] = v;
            this.render(p);
            return true;
        }
    });
    SYS = {};

    wdevs = {};
    lastOrder = 0;

    constructor() {
        super();
        this.worker = {
            nats: new Worker("idomworkernats.js"),
            mqtt: new Worker("idomworkerpaho.js"),
            setonmessage(onm) {
                this.nats.onmessage = onm;
                this.mqtt.onmessage = onm;
            },
            postMessage(o) {
                switch (this.p) {
                    case "mqtt":
                        this.mqtt.postMessage(o);
                        break;
                    default:
                        this.nats.postMessage(o);
                        break;
                }
            },
            setProtocol(p) {
                this.p = p;
            }
        }
        this.worker.setonmessage((m) => {

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
        });
        this.worker.postMessage({ action: "start" });
    }

    onmessage(topic, payload) {
        // console.log(topic);
        try {
            const [type, name, cmd] = topic.split("/");
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
            } else if (type == "weather") {
                const pp = JSON.parse(payload.toString())
                this.devs[name + "#" + cmd] = {
                    name: name + "#" + cmd,
                    DeviceName: name + "#" + cmd,
                    Topic: topic,
                    data: pp,
                    //Ip: pp.Ip,
                    type: "weather"
                }
            } else if (type == "hikmqtt") {
                const pp = JSON.parse(payload.toString())
                this.devs[name] = {
                    name: pp.Name, image: pp.Image,
                    DeviceName: pp.Name,
                    Topic: topic,
                    Ip: pp.Ip,
                    type: "cam"
                }
            } else if (cmd == "HASS_STATE") {


            } else if (type == "$SYS") {
                // console.log("Statistics", topic, payload.toString());
                this.SYS[topic] = payload.toString();
            } else {
                console.log(topic, payload.toString());
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
        this.toolbar.className = "idom-toolbar";

        this.loginNode = this.appendChild(new iLogin((url, username, password, protocol) => {
            localStorage.setItem("idom_url", url);
            localStorage.setItem("idom_username", username);
            localStorage.setItem("idom_password", password);
            localStorage.setItem("idom_protocol", protocol);
            this.loadingNode.style.display = "block";
            this.connect();
        }));
        this.loginNode.style.display = "none";

        this.main = this.appendChild(document.createElement("div"));
        this.main.className = "idom-main";

        this.main.style.paddingBottom = "80px";
        // this.main.style.display = "flex";
        // this.main.style.flexDirection = "column";
        this.main.style.gap = "1rem";

        this.otherGroup = this.addGroup("Other");
        this.otherGroup.firstChild.style.display = "none";
        this.otherGroup.style.order = 1000;

        //this.addGroup("Test");

        this.netstat = this.toolbar.appendChild(new iIcon("wifioff", 24, 24, () => {
            this.appendChild(new iInfoObject(this.SYS));
        }));

        this.logout = this.toolbar.appendChild(new iIcon("logout", 24, 24, () => {
            this.worker.postMessage({ action: "logout" });
        }));

        this.connect();
        // this.buildGrid();
    }

    addGroup(name) {
        if (name != "Other" && this.otherGroup.childElementCount > 1) {
            this.otherGroup.firstChild.style.display = "block";
        }
        let group = this.main.querySelector("#group-" + name);
        if (group) {
        } else {
            group = this.main.appendChild(document.createElement("div"));
            const title = group.appendChild(document.createElement("div"));
            title.className = "idom-group-title";
            title.textContent = name;
            //if (name == "Other") title.style.display = "none";
            group.setAttribute("id", "group-" + name);
            // group.textContent = name;
            group.classList.add("idom-group");
            group.classList.add("idom-main");
            // group.className = "idom-group";
        }

        return group;
    }

    connect() {
        if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
            this.worker.setProtocol(localStorage.getItem("idom_protocol") || "nats");
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

    _addWidget(name, dev) {
        let main = this.addGroup(dev.group);

        this.wdevs[name] = main.appendChild(dev);
        this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
        this.lastOrder = (localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1);
        this.wdevs[name].className = "idom-device";
    }

    render(name) {
        if (name === undefined) {
            console.log(this.devs);
            Object.keys(this.devs).forEach(e => {
                this.render(e);
            });

        } else {
            if (this.wdevs[name] == undefined) {
                switch (this.devs[name].type) {
                    case "weather":
                        this._addWidget(name, new iDevWeather(name, this))
                        break;
                    case "cam":
                        this._addWidget(name, new iDevCam(name, this))
                        break;
                    default:
                        this._addWidget(name, new iDev(name, this))
                        break;
                }
            }
            this.wdevs[name].update(this.devs[name]);
        }
    }

    publish(topic, payload) {
        this.worker.postMessage({ action: "publish", topic, payload });
    }
}

customElements.define('i-dom', iDom);