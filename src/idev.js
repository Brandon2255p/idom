import { iSwitch } from "./iswitch";
import { iInfo } from "./iinfo";
import { iIcon } from "./iicon";
import { iDevBase } from "./idevbase";

export class iDev extends iDevBase {

    sw = [];

    constructor(name, idom) {
        super();
        this.name = name;
        this.idom = idom;
    }

    buildTitle() {
        this.titleNode = this.toolbar.insertAdjacentElement('afterbegin', document.createElement("div"))
        this.titleNode.style.marginRight = "auto";
        this.titleNode.style.fontWeight = "700";
        this.titleNode.textContent = this.deviceName || this.name;
    }

    buildCustom() {
        this.sensorNode = this.body.appendChild(document.createElement("div"));
        this.sensorNode.className = "idom-device-sensor";
        // this.sensorNode.style.paddingBottom = "20px";
        // this.sensorNode.style.fontSize = "2em";
        this.sensorNode.style.display = "none";

        this.statusNode = this.body.appendChild(document.createElement("div"));
        this.statusNode.style.display = "none";
        this.swNode = this.body.appendChild(document.createElement("div"));
        this.swNode.className = "idom-device-switches";

    }

    update(dev) {
        this.dev = dev;
        // console.log(dev);
        this.statusNode.textContent = dev.LWT || "";
        if (dev.SENSOR || dev.STATUS8) {
            const sensor = dev.SENSOR || dev.STATUS8.StatusSNS;
            const tmp = sensor.AM2301 || sensor.SI7021;
            if (tmp) {
                this.sensorNode.style.display = "block";
                this.sensorNode.innerHTML = tmp ? `<i-icon width="24" height="24" name="temp" ></i-icon>${tmp.Temperature}C <i-icon width="24" height="24" name="hum" style="padding-left: 20px" ></i-icon> ${tmp.Humidity}%` : "?";
            }
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