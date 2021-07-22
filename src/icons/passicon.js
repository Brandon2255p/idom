export class iPassIcon extends HTMLElement {
    constructor(width, height, callback) {
        super();
        this.width = width || 24;
        this.height = height || 24;

        this.callback = callback;
    }
    connectedCallback() {
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;

        this.style.cursor = "pointer";
        this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";//"bisque";
        this.onmouseout = () => this.firstChild.style.fill = "none";
        if (this.callback) this.onclick = this.callback;
    }
}

customElements.define('i-pass-icon', iPassIcon);