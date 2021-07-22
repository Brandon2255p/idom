export class iUserIcon extends HTMLElement {
    constructor(width, height, callback) {
        super();
        this.width = width || 24;
        this.height = height || 24;

        this.callback = callback;
    }
    connectedCallback() {

        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

        this.style.cursor = "pointer";
        this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";//"bisque";
        this.onmouseout = () => this.firstChild.style.fill = "none";
        if (this.callback) this.onclick = this.callback;
    }
}

customElements.define('i-user-icon', iUserIcon);