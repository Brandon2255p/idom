import { iDevBase } from "./idevbase";

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
        this.imgNode = this.main.appendChild(document.createElement("img"));
        this.imgNode.setAttribute("width", "100%");
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

    }
}

customElements.define('i-dev-cam', iDevCam);