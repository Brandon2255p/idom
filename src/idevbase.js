import { iInfo } from "./iinfo";
import { iIcon } from "./iicon";

export class iDevBase extends HTMLElement {
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
        this.root.className = "idom-device-root";
        // this.root.style.padding = "10px";
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
        // this.upbutton = new iIcon("up", 24, 24, () => swap(true));
        // this.downbutton = new iIcon("down", 24, 24, () => swap(false));
        this.infobutton = new iIcon("info", 18, 18, () => {
            this.parentElement.parentElement.parentElement.appendChild(new iInfo(this.dev));
        });
        this.infobutton.style.paddingRight = "4px";

        this.buildToolbar();
        this.buildTitle();

        this.body = this.root.appendChild(document.createElement("div"));
        this.body.className = "idom-device-body";

        this.buildCustom();
    }

    buildToolbar() {
        this.toolbar = this.root.appendChild(document.createElement("div"));
        this.toolbar.appendChild(this.infobutton);
        // this.toolbar.appendChild(this.upbutton);
        // this.toolbar.appendChild(this.downbutton);
        this.toolbar.style.position = "relative";
        this.toolbar.className = "idom-device-toolbar";
    }

    buildTitle() {
        this.titleNode = this.toolbar.insertAdjacentElement('afterbegin', document.createElement("div"))
        this.titleNode.style.marginRight = "auto";
        this.titleNode.style.fontWeight = "700";
        this.titleNode.textContent = this.deviceName || this.name;
    }

    buildCustom() {
    }

    update(dev) {
        this.dev = dev;
    }

}
