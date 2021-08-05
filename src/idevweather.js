import { iDevBase } from "./idevbase";

export class iDevWeather extends iDevBase {

    buildCustom() {
        this.main = this.root.appendChild(document.createElement("div"));

        // this.main.style.display = "flex";
        // this.main.style.flexDirection = "column";
        // this.main.style.justifyContent = "center";
        // this.main.style.alignContent = "stretch";
        // this.main.style.alignItems = "stretch";

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
        //console.log(dev);
        this.body.innerHTML = "";
        //this.body.textContent = JSON.stringify(dev.data);
        dev.data.forEach(e => {
            const r = this.body.appendChild(document.createElement("div"));
            r.className = "idom-weather-row";
            r.appendChild(document.createElement("div")).textContent = e.dt + " " + (e.isnight ? "ночь" : "день");
            const temp = r.appendChild(document.createElement("div"));
            temp.textContent = e.temp.replace("&deg;", "");
            //temp.innerHTML += "&deg;";
            r.appendChild(document.createElement("div")).textContent = e.pressure;

        })
    }

}

customElements.define('i-dev-weather', iDevWeather);