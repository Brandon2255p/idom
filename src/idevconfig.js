import { iDialogBase } from "./idialogbase";

class iField extends HTMLElement {

    constructor(name, value) {
        super();
        this.v = value;
        this.name = name;
    }

    get value() {
        return this.input.value || "";
    }

    connectedCallback() {
        this.className = "idom-config-row";
        this.label = this.appendChild(document.createElement("div"));
        this.label.className = "idom-config-label";
        this.label.textContent = this.name;
        this.input = this.appendChild(document.createElement("input"));
        this.input.value = this.v;
    }
}

export class iDevConfig extends iDialogBase {

    constructor(dev) {
        super();
        this.dev = dev;
    }

    build() {
        this.content = this.root.appendChild(document.createElement("div"));
        this.content.className = "idom-config";
        this.group = this.content.appendChild(new iField("Group", this.dev.group));
        this.savebutton = this.content.appendChild(document.createElement("div")).appendChild(document.createElement("button"));
        this.savebutton.parentElement.className = "idom-config-row";
        this.savebutton.textContent = "Save";
        this.savebutton.onclick = () => {
            this.dev.group = this.group.value;
            this.closeDialog();
        }
    }
}
customElements.define('i-field', iField);
customElements.define('i-dev-config', iDevConfig);