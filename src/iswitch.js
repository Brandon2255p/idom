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
        this.root.textContent = `${this.fname || this.name}: ${this.state}`;
    }

    connectedCallback() {
        this.style.padding = "5px"
        this.root = this.appendChild(document.createElement("button"));
        this.root.className = "iswitch";
        this.root.textContent = "Loading...";
        this.root.addEventListener("click", () => {
            this.idom.publish(`cmnd/${this.devname}/Power${this.index + 1}`, "TOGGLE");
        });
    }

    setIndex(i) {
        this.index = i;
    }
}

customElements.define('i-switch', iSwitch);