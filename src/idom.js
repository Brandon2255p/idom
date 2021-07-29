import { iLoading } from "./iloading";
import { iLogin } from "./ilogin";
import { iDev } from "./idev";
import { iDevCam } from "./idevcam";
import css from "./tasmota.css";
import { iIcon } from "./iicon";
import { iInfoObject } from "./iinfoobject";
import "gridstack/dist/h5/gridstack-dd-native"; //"gridstack/dist/gridstack-h5.js";
import { GridStack } from "gridstack"
import gridstackcss from "gridstack/dist/gridstack.min.css"
import gridstackextracss from "gridstack/dist/gridstack-extra.min.css"

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
        this.worker = new Worker("idomworkernats.js");
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
            } else if (type == "hikmqtt") {
                const pp = JSON.parse(payload.toString())
                this.devs[name] = {
                    name: pp.Name, image: pp.Image,
                    DeviceName: pp.Name,
                    Topic: topic,
                    Ip: pp.Ip,
                    type: "cam"
                }
            } else if (type == "$SYS") {
                // console.log("Statistics", topic, payload.toString());
                this.SYS[topic] = payload.toString();
            } else {
                //console.log(topic, payload.toString());
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
        s.innerHTML = css + "\n" + gridstackcss + "\n" + gridstackextracss;

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

        // this.main = this.appendChild(document.createElement("div"));
        // this.main.className = "idom-main";

        // this.main.style.paddingBottom = "60px";
        // this.main.style.display = "flex";
        // this.main.style.flexDirection = "column";
        // this.main.style.gap = "1rem";

        this.netstat = this.toolbar.appendChild(new iIcon("wifioff", 24, 24, () => {
            console.log(this.grid.save().map(e => {
                return { ...e, content: undefined };
            }));
            //this.appendChild(new iInfoObject(this.SYS));
        }));

        this.logout = this.toolbar.appendChild(new iIcon("logout", 24, 24, () => {
            this.worker.postMessage({ action: "logout" });
        }));

        this.connect();
        this.buildGrid();
    }

    resizeGrid() {
        let width = document.body.clientWidth;
        let layout = 'move';
        if (width < 400) {
            this.grid.column(1, layout).cellHeight('150px');
        } else if (width < 700) {
            this.grid.column(1, layout).cellHeight('100px');
        } else if (width < 850) {
            this.grid.column(3, layout).cellHeight('100px');
        } else if (width < 950) {
            this.grid.column(6, layout).cellHeight('100px');
        } else if (width < 1100) {
            this.grid.column(8, layout).cellHeight('100px');
        } else {
            this.grid.column(12, layout).cellHeight('100px');
        }
    };
    buildGrid() {
        this.gridNode = this.appendChild(document.createElement("div"));
        this.gridNode.className = "grid-stack";
        this.grid = GridStack.init({
            disableDrag: false,
            alwaysShowResizeHandle: true,
            // disableOneColumnMode: true,
            cellHeight: '20vh',
            float: true
            // cellHeight: "120px"
        }, this.gridNode);
        this.grid.load([
            // { content: 'my first widget' }, // will default to location (0,0) and 1x1
            // { w: 2, content: 'another longer widget!' } // will be placed next at (1,0) and 2x1
        ]);
        //this.resizeGrid();
        // window.addEventListener('resize', () => { this.resizeGrid() });
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

    _addWidget(name, dev) {
        const tmp = document.createElement("div");
        tmp.className = "grid-stack-item";
        tmp.innerHTML = `<div class="grid-stack-item-content"></div>`;

        this.wdevs[name] = tmp.firstChild.appendChild(dev);
        this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
        this.lastOrder = (localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1);
        this.wdevs[name].className = "idom-device";

        this.grid.addWidget(tmp, { w: 3, h: 2, id: name });
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
                    case "cam":
                        this._addWidget(name, new iDevCam(name, this))
                        // const tmp = document.createElement("div");
                        // tmp.className = "grid-stack-item";
                        // tmp.innerHTML = `<div class="grid-stack-item-content"></div>`;

                        // this.wdevs[name] = tmp.firstChild.appendChild(new iDevCam(name, this));
                        // this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
                        // this.lastOrder = (localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1);
                        // this.wdevs[name].className = "idom-device";

                        // this.grid.addWidget(tmp, { w: 1, h: 1 });
                        break;
                    default:
                        this._addWidget(name, new iDev(name, this))
                        // const tmp = document.createElement("div");
                        // tmp.className = "grid-stack-item";
                        // tmp.innerHTML = `<div class="grid-stack-item-content"></div>`;

                        // this.wdevs[name] = tmp.firstChild.appendChild(new iDev(name, this));//this.main.appendChild(new iDev(name, this));
                        // this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
                        // this.lastOrder = (localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1);
                        // this.wdevs[name].className = "idom-device";

                        // this.grid.addWidget(tmp, { w: 1, h: 1 });
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