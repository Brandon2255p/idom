export class iInfoIcon extends HTMLElement {
    constructor(width, height, callback) {
        super();
        this.width = width || 24;
        this.height = height || 24;

        this.callback = callback;
    }
    connectedCallback() {
        // this.root = this.appendChild(document.createElement("div"));

        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

        this.style.cursor = "pointer";
        this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";//"bisque";
        this.onmouseout = () => this.firstChild.style.fill = "none";
        if (this.callback) this.onclick = this.callback;
    }
}

customElements.define('i-info-icon', iInfoIcon);