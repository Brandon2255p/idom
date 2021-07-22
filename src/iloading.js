
export class iLoading extends HTMLElement {
    connectedCallback() {
        this.root = this.appendChild(document.createElement("div"));
        this.root.textContent = "Loading...";
        this.root.style.position = "sticky";
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.style.display = "flex";
        this.root.style.alignItems = "center";
        this.root.style.justifyContent = "center";
        this.root.style.alignContent = "stretch";
        this.root.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
        // this.root.style.paddingLeft = "50%";
        // this.root.style.paddingTop = "50%";
    }
}

customElements.define('i-loading', iLoading);