export class iUrlIcon extends HTMLElement {
    constructor(width, height, callback) {
        super();
        this.width = width || 24;
        this.height = height || 24;

        this.callback = callback;
    }
    connectedCallback() {
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-server"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`;

        this.style.cursor = "pointer";
        this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";//"bisque";
        this.onmouseout = () => this.firstChild.style.fill = "none";
        if (this.callback) this.onclick = this.callback;
    }
}

customElements.define('i-url-icon', iUrlIcon);