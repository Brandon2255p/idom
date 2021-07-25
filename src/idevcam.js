import { iSwitch } from "./iswitch";
import { iInfo } from "./iinfo";
import { iIcon } from "./iicon";


export class iDevCam extends HTMLElement {

    constructor(name, idom) {
        super();
        this.name = name;
        this.idom = idom;
    }

    setOrder(order) {
        this.style.order = order;
        localStorage.setItem("idom_order|" + this.name, order);
    }

    connectedCallback() {
        this.root = this.appendChild(document.createElement("div"));
        this.root.id = this.name;
        this.root.style.padding = "10px";
        this.root.position = "relative";

        const swap = (up) => {
            const lst = Array.prototype.slice.call(this.parentElement.querySelectorAll(".idom-device")).sort((a, b) => a.style.order - b.style.order);
            for (let idx = 0; idx < lst.length; idx++) {
                if (lst[idx] == this && idx != (up ? 0 : lst.length - 1)) {
                    const cur = this.style.order;
                    this.setOrder(lst[idx + (up ? - 1 : 1)].style.order);
                    lst[idx + (up ? - 1 : 1)].setOrder(cur);
                    break;
                }
            }
        }

        const upbutton = new iIcon("up", 24, 24, () => swap(true));
        const downbutton = new iIcon("down", 24, 24, () => swap(false));

        this.toolbar = this.root.appendChild(document.createElement("div"));
        this.toolbar.appendChild(upbutton);
        this.toolbar.appendChild(downbutton);
        this.toolbar.style.position = "relative";
        this.toolbar.className = "idom-device-toolbar";

        this.titleParentNode = this.root.appendChild(document.createElement("h2"));
        this.titleNode = this.titleParentNode.appendChild(document.createElement("span"));
        this.titleNode.textContent = this.deviceName || this.name;
        this.titleParentNode.appendChild(new iIcon("info", 16, 16, () => {
            this.appendChild(new iInfo(this.dev));
        })).style.paddingLeft = "8px";




        // CUSTOM
        //<img src="data:image/png;base64,

        this.imgNode = this.root.appendChild(document.createElement("div")).appendChild(document.createElement("img"));
    }

    update(dev) {
        this.dev = dev;
        // console.log(dev);
        this.imgNode.src = `data:image/png;base64, ${dev.image}`;
    }
}

customElements.define('i-dev-cam', iDevCam);