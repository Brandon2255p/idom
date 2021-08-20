import { iDevBase } from "./idevbase";
import { iIcon } from "./iicon";

export class iDevCam extends iDevBase {

    buildCustom() {
        // CUSTOM
        //<img src="data:image/png;base64,
        this.main = this.root.appendChild(document.createElement("div"));
        // this.main.style.display = "flex";
        // this.main.style.flexDirection = "column";
        // this.main.style.justifyContent = "center";
        // this.main.style.alignContent = "stretch";
        // this.main.style.alignItems = "stretch";
        this.imgNode = this.body.appendChild(document.createElement("img"));
        this.body.style.padding = "0px";
        this.imgNode.setAttribute("width", "100%");
        this.imgNode.onclick = () => {
            const full = this.body.appendChild(document.createElement("div"));
            full.style.position = "fixed";
            full.style.left = 0;
            full.style.top = 0;
            full.style.backgroundColor = "black";
            full.style.zIndex = 2;
            full.style.width = "100%";
            full.style.height = "100%";
            full.style.display = "flex";
            full.style.alignItems = "center";
            full.style.flexDirection = "row";
            this.fullimgNode = full.appendChild(document.createElement("img"));
            this.fullimgNode.src = this.imgNode.src;
            this.fullimgNode.style.width = "100%";

            const close = full.appendChild(new iIcon("x", 24, 24, () => {
                //this.closeDialog();
                this.fullimgNode.remove();
                this.fullimgNode = undefined;
                full.remove();

            }));
            close.style.width = "40px";
            close.style.padding = "10";
            close.style.position = "absolute";
            close.style.right = 0;
            close.style.top = 0;
        }
    }

    buildTitle() {
        this.titleNode = this.toolbar.insertAdjacentElement('afterbegin', document.createElement("div"))
        this.titleNode.style.marginRight = "auto";
        this.titleNode.style.fontWeight = "700";
        this.titleNode.textContent = this.deviceName || this.name;
    }

    // buildTitle() {
    //     this.titleParentNode = this.root.appendChild(document.createElement("h2"));
    //     this.titleNode = this.titleParentNode.appendChild(document.createElement("span"));
    //     this.titleNode.textContent = this.deviceName || this.name;
    // }


    update(dev) {
        this.dev = dev;
        // console.log(dev);
        this.imgNode.src = `data:image/png;base64,${dev.image}`;
        if (this.fullimgNode) {
            this.fullimgNode.src = this.imgNode.src;
        }
    }
}

customElements.define('i-dev-cam', iDevCam);