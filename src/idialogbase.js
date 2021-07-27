import { iIcon } from "./iicon";

export class iDialogBase extends HTMLElement {
    closeDialog() {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        this.remove();
    }

    connectedCallback() {
        const sy = window.scrollY;
        document.body.style.position = "fixed"
        document.body.style.top = `-${sy}px`;
        document.body.style.right = 0;
        document.body.style.left = 0;

        this.root = this.appendChild(document.createElement("div"));
        this.root.style.zIndex = 1000;
        this.root.style.position = "fixed";
        this.root.style.top = "0";
        this.root.style.width = "100%";
        this.root.style.height = "100vh";
        this.root.style.display = "flex";
        this.root.style.alignItems = "center";
        this.root.style.justifyContent = "center";
        this.root.style.alignContent = "stretch";
        this.root.style.flexDirection = "column";
        this.root.style.backgroundColor = "rgba(37, 37, 37, 0.8)";
        // this.root.style.overflowY = "scroll";

        this.close = this.root.appendChild(new iIcon("x", 24, 24, () => {
            this.closeDialog();
        }));
        this.close.style.width = "40px";
        this.close.style.padding = "10";
        this.close.style.position = "absolute";
        this.close.style.right = 0;
        this.close.style.top = 0;

        this.build();
    }
    build() {

    }
}
