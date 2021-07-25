export class iSwitch extends HTMLElement {

    state = "?";
    index = 0;

    constructor(idom, devname) {
        super();
        this.idom = idom;
        this.devname = devname;
    }

    setState(state) {
        this.state = state;
        this.root.className = "iswitch " + (state == "ON" ? "ON" : "OFF");
        this.render();
    }

    setName(name) {
        this.name = name;
        this.render();
    }

    setFName(fname) {
        this.fname = fname;
        this.render();
    }

    render() {
        if (this.state == "?")
            this.root.innerHTML = `${this.fname || this.name}<div class="spinner"></div>`
        else
            this.root.innerHTML = `${this.fname || this.name} <span>${this.state}</span>`;
    }

    connectedCallback() {
        this.style.padding = "5px"
        this.root = this.appendChild(document.createElement("button"));
        this.root.className = "iswitch";
        this.root.textContent = "Loading...";
        this.root.addEventListener("click", () => {
            if (this.state != "?") {
                this.state = '?';
                this.render();
                this.idom.publish(`cmnd/${this.devname}/Power${this.index + 1}`, "TOGGLE");

            }
        });
    }

    setIndex(i) {
        this.index = i;
    }
}

customElements.define('i-switch', iSwitch);