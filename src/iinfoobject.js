import { iDialogBase } from "./idialogbase";

export class iInfoObject extends iDialogBase {

    constructor(info) {
        super();
        this.info = info;
    }

    build() {
        // this.root.appendChild(document.createElement("h1")).textContent = this.info.DeviceName || this.info.STATUS.Status.DeviceName;
        this.root.style.paddingTop = "40px";
        const t = this.root.appendChild(document.createElement("div")).appendChild(document.createElement("table"))
        t.parentElement.marginBottom = "auto"
        t.parentElement.style.overflowY = "scroll";
        this.table = t.appendChild(document.createElement("tbody"));
        t.style.minWidth = "300px";
        t.style.textAlign = "left";

        Object.keys(this.info).forEach(k => {
            this.row(k, this.info[k] || "-");
        });

        const b = this.root.appendChild(document.createElement("button"));
        b.textContent = "Close";
        b.style.maxWidth = "300px";
        b.style.marginTop = "20px";
        b.style.flex = "30px";
        b.style.marginBottom = "100px";

        b.onclick = () => {
            this.closeDialog();
        }
    }

    row(k, v) {
        const row = this.table.insertRow();
        row.appendChild(document.createElement("th")).textContent = k;
        row.appendChild(document.createElement("td")).textContent = v;
    }
}

customElements.define('i-info-object', iInfoObject);