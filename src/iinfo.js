
export class iInfo extends HTMLElement {
    constructor(info) {
        super();
        this.info = info;
    }
    connectedCallback() {
        console.log(this.info);
        this.root = this.appendChild(document.createElement("div"));
        this.root.style.position = "fixed";
        this.root.style.top = "0px"
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.style.display = "flex";
        this.root.style.alignItems = "center";
        this.root.style.justifyContent = "center";
        this.root.style.alignContent = "stretch";
        this.root.style.flexDirection = "column";
        this.root.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
        // this.root.style.paddingLeft = "50%";
        // this.root.style.paddingTop = "50%";

        this.root.appendChild(document.createElement("h1")).textContent = this.info.STATUS.Status.DeviceName;

        const t = this.root.appendChild(document.createElement("table"))
        this.table = t.appendChild(document.createElement("tbody"));
        t.style.minWidth = "300px";
        t.style.textAlign = "left";

        this.row("DeviceName", this.info.STATUS.Status.DeviceName);
        this.row("Topic", this.info.STATUS.Status.Topic);
        this.row("IP", this.info.STATUS5.StatusNET.IPAddress);
        //table.insertRow//appendChild(this.row("k", "v"));
        const b = this.root.appendChild(document.createElement("button"));
        b.textContent = "Close";
        b.style.maxWidth = "300px";
        b.style.marginTop = "20px";
        b.onclick = () => {
            this.remove();
        }
    }

    row(k, v) {
        const row = this.table.insertRow();//document.createElement("tr");
        row.appendChild(document.createElement("th")).textContent = k;
        row.appendChild(document.createElement("td")).textContent = v;
    }
}

customElements.define('i-info', iInfo);