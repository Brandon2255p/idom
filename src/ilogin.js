// import { iPassIcon } from "./icons/passicon";
// import { iUserIcon } from "./icons/usericon";
// import { iUrlIcon } from "./icons/urlicon";
import { iIcon } from "./iicon";

export class iLogin extends HTMLElement {

    constructor(onconnect) {
        super();
        this.onconnect = onconnect;
    }

    connectedCallback() {
        this.main = this.appendChild(document.createElement("div"));
        this.main.style.top = "0";
        this.main.style.width = "100%";
        this.main.style.height = "100%";
        this.main.style.display = "flex";
        this.main.style.flexDirection = "column";
        this.main.style.justifyContent = "center";
        this.main.style.alignItems = "center";
        this.main.style.backgroundColor = "rgba(37, 37, 37, 0.5)"
        this.main.style.position = "fixed";

        this.root = this.main.appendChild(document.createElement("div"));
        this.root.textContent = "Login";
        this.root.style.width = "300px";
        this.root.style.height = "400px";
        this.root.style.display = "flex";
        this.root.style.flexDirection = "column";
        this.root.style.justifyContent = "space-evenly";
        this.root.style.alignItems = "stretch";
        this.root.style.backgroundColor = "rgba(37, 37, 37, 0.9)";
        this.root.style.padding = "50px";

        this.root.innerHTML = `
            <h1>iDom v.0.0.5</h1>
            <div style="display: flex;align-content: stretch;justify-content: space-evenly;align-items: center;">
                <div style="width: 24px;"><i-icon name="url" ></i-icon></div><div><input id="url" type="text" style="width: 100%;"></div>
            </div>
            <div style="display: flex;align-content: stretch;justify-content: space-evenly;align-items: center;">
                <div style="width: 24px;"><i-icon name="user" ></i-icon></div><div><input id="username" type="text" style="width: 100%;"></div>
            </div>
            <div style="display: flex;align-content: stretch;justify-content: space-evenly;align-items: center;">
                <div style="width: 24px;"><i-icon name="pass" ></i-icon></div><div><input id="password" type="password" style="width: 100%;"></div>
            </div>
            <button>Connect</button>
        `;
        this.url = this.root.querySelector("#url");
        this.url.value = localStorage.getItem("idom_url") || 'ws://' + location.host;
        this.url.addEventListener("input", (a) => this.validate())
        this.username = this.root.querySelector("#username");
        this.username.value = localStorage.getItem("idom_username") || "";
        this.username.addEventListener("input", (a) => this.validate())
        this.password = this.root.querySelector("#password");
        this.password.value = localStorage.getItem("idom_password") || "";
        this.password.addEventListener("input", (a) => this.validate())

        this.button = this.root.querySelector("button");
        this.button.disabled = true;
        this.button.addEventListener("click", () => {
            this.onconnect(this.url.value, this.username.value, this.password.value);
        });
        this.validate();
    }
    validate() {
        // console.log(!(this.username.value && this.username.value.length > 0 && this.password.value && this.password.value.length > 0));
        this.button.disabled = !(this.username.value && this.username.value.length > 0 && this.password.value && this.password.value.length > 0);
    }
}

customElements.define('i-login', iLogin);