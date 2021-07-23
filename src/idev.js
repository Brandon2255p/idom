import { iSwitch } from "./iswitch";
import { iInfo } from "./iinfo";
import { iIcon } from "./iicon";


export class iDev extends HTMLElement {

    sw = [];

    constructor(name, idom) {
        super();
        this.name = name;
        this.idom = idom;
    }

    connectedCallback() {
        this.root = this.appendChild(document.createElement("div"));
        this.root.id = this.name;
        this.root.style.padding = "10px";

        this.titleParentNode = this.root.appendChild(document.createElement("h2"));
        this.titleNode = this.titleParentNode.appendChild(document.createElement("span"));
        this.titleNode.textContent = this.deviceName || this.name;
        this.titleParentNode.appendChild(new iIcon("info", 16, 16, () => {
            this.appendChild(new iInfo(this.dev));
        })).style.paddingLeft = "8px";
        this.statusNode = this.root.appendChild(document.createElement("div"));
        this.statusNode.style.display = "none";
        this.swNode = this.root.appendChild(document.createElement("div"));
    }

    update(dev) {
        this.dev = dev;
        // console.log(dev);
        this.statusNode.textContent = dev.LWT || "";
        if (dev.SENSOR) {
            if (this.sensorNode === undefined) {
                this.sensorNode = this.root.appendChild(document.createElement("div"));
            }
            const tmp = dev.SENSOR.AM2301 || dev.SENSOR.SI7021;
            this.sensorNode.innerHTML = tmp ? `<i-icon width="12" height="12" name="temp" ></i-icon>${tmp.Temperature}C <i-icon width="12" height="12" name="hum" ></i-icon> ${tmp.Humidity}%` : "?";
        }

        if (dev.STATUS) {
            dev.STATUS.Status.FriendlyName.forEach((e, i) => {
                this.addSwElement(i);
                this.sw[i].setIndex(i);
                this.sw[i].setFName(e);
                this.sw[i].setState(i + 1 == dev.STATUS.Status.Power ? "ON" : "OFF")
            });
            this.deviceName = dev.STATUS.Status.DeviceName;
            this.titleNode.textContent = this.deviceName || this.name;
        }

        Object.keys(dev).filter(a => a.startsWith("POWER")).forEach(e => {
            const i = Number(e.substring(5) || 1) - 1;
            this.addSwElement(i);
            this.sw[i].setIndex(i);
            this.sw[i].setName(e)
            this.sw[i].setState(dev[e]);
        })
        // this.swNode.innerHTML = "";
        //this.sw.map(e => this.swNode.appendChild(e));
        // if (dev.STATE && dev.STATE.POWER) {

        //     if (this.sw.POWER === undefined) {
        //         this.sw.POWER = this.root.appendChild(document.createElement("button"));
        //     }
        //     this.sw.POWER.textContent = "POWER: " + dev.STATE.POWER;
        // }
        // if (Object.keys(dev).filter(a => a.startsWith("POWER"))) {
        //     if (this.sw[])
        // }
    }
    addSwElement(i) {
        if (this.sw[i] === undefined) {
            if (this.sw[i + 1]) {
                this.sw[i] = this.swNode.insertBefore(new iSwitch(this.idom, this.name), this.sw[i + 1]);
            } else {
                this.sw[i] = this.swNode.appendChild(new iSwitch(this.idom, this.name));
            }
        }
    }
}

customElements.define('i-dev', iDev);