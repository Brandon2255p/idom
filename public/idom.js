(() => {
  // src/iloading.js
  var iLoading = class extends HTMLElement {
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
      this.root.style.backgroundColor = "rgba(37, 37, 37, 0.5)";
    }
  };
  customElements.define("i-loading", iLoading);

  // src/iicon.js
  var icons = {
    temp: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thermometer"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    hum: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud-drizzle"><line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`,
    url: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-server"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    pass: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    wifi: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-wifi"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`,
    wifioff: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-wifi-off"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`,
    up: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
    down: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
  };
  var iIcon = class extends HTMLElement {
    constructor(name, width, height, callback) {
      super();
      this.name = name || this.getAttribute("name");
      this.width = Number(width || this.getAttribute("width") || 24);
      this.height = Number(height || this.getAttribute("height") || 24);
      this.callback = callback;
    }
    setName(name) {
      this.name = name;
      this.render();
    }
    render() {
      this.innerHTML = icons[this.name] || icons.default;
      this.firstChild.setAttribute("width", this.width);
      this.firstChild.setAttribute("height", this.height);
      if (this.callback) {
        this.style.cursor = "pointer";
        this.onmouseover = () => this.firstChild.style.stroke = "palevioletred";
        this.onmouseout = () => this.firstChild.style.stroke = "white";
        this.onclick = this.callback;
      }
    }
    connectedCallback() {
      this.render();
    }
  };
  var iIconHtml = class extends iIcon {
    constructor() {
      super();
    }
  };
  customElements.define("i-icon", iIconHtml);
  customElements.define("i-icon-raw", iIcon);

  // src/ilogin.js
  var iLogin = class extends HTMLElement {
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
      this.main.style.backgroundColor = "rgba(37, 37, 37, 0.5)";
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
      this.url.value = localStorage.getItem("idom_url") || "ws://" + location.host;
      this.url.addEventListener("input", (a) => this.validate());
      this.username = this.root.querySelector("#username");
      this.username.value = localStorage.getItem("idom_username") || "";
      this.username.addEventListener("input", (a) => this.validate());
      this.password = this.root.querySelector("#password");
      this.password.value = localStorage.getItem("idom_password") || "";
      this.password.addEventListener("input", (a) => this.validate());
      this.button = this.root.querySelector("button");
      this.button.disabled = true;
      this.button.addEventListener("click", () => {
        this.onconnect(this.url.value, this.username.value, this.password.value);
      });
      this.validate();
    }
    validate() {
      this.button.disabled = !(this.username.value && this.username.value.length > 0 && this.password.value && this.password.value.length > 0);
    }
  };
  customElements.define("i-login", iLogin);

  // src/iswitch.js
  var iSwitch = class extends HTMLElement {
    state = "?";
    index = 0;
    constructor(idom, devname) {
      super();
      this.idom = idom;
      this.devname = devname;
    }
    setState(state) {
      this.state = state;
      this.root.className = "iswitch " + (state == "ON" ? "ON" : "OFF");
      this.render();
    }
    setName(name) {
      this.name = name;
      this.render();
    }
    setFName(fname) {
      this.fname = fname;
      this.render();
    }
    render() {
      if (this.state == "?")
        this.root.innerHTML = `${this.fname || this.name}<div class="spinner"></div>`;
      else
        this.root.innerHTML = `${this.fname || this.name} <span>${this.state}</span>`;
    }
    connectedCallback() {
      this.style.padding = "5px";
      this.root = this.appendChild(document.createElement("button"));
      this.root.className = "iswitch";
      this.root.textContent = "Loading...";
      this.root.addEventListener("click", () => {
        if (this.state != "?") {
          this.state = "?";
          this.render();
          this.idom.publish(`cmnd/${this.devname}/Power${this.index + 1}`, "TOGGLE");
        }
      });
    }
    setIndex(i) {
      this.index = i;
    }
  };
  customElements.define("i-switch", iSwitch);

  // src/idialogbase.js
  var iDialogBase = class extends HTMLElement {
    closeDialog() {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      this.remove();
    }
    connectedCallback() {
      const sy = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${sy}px`;
      document.body.style.right = 0;
      document.body.style.left = 0;
      this.root = this.appendChild(document.createElement("div"));
      this.root.style.zIndex = 1e3;
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
  };

  // src/iinfo.js
  var iInfo = class extends iDialogBase {
    constructor(info) {
      super();
      this.info = info;
    }
    build() {
      this.root.appendChild(document.createElement("h1")).textContent = this.info.DeviceName || this.info.STATUS.Status.DeviceName;
      const t = this.root.appendChild(document.createElement("table"));
      this.table = t.appendChild(document.createElement("tbody"));
      t.style.minWidth = "300px";
      t.style.textAlign = "left";
      this.row("DeviceName", this.info.DeviceName || this.info.STATUS.Status.DeviceName);
      this.row("Topic", this.info.Topic || this.info.STATUS.Status.Topic);
      this.row("IP", this.info.Ip || this.info.STATUS5.StatusNET.IPAddress);
      const b = this.root.appendChild(document.createElement("button"));
      b.textContent = "Close";
      b.style.maxWidth = "300px";
      b.style.marginTop = "20px";
      b.onclick = () => {
        this.closeDialog();
      };
    }
    row(k, v) {
      const row = this.table.insertRow();
      row.appendChild(document.createElement("th")).textContent = k;
      row.appendChild(document.createElement("td")).textContent = v;
    }
  };
  customElements.define("i-info", iInfo);

  // src/idevbase.js
  var iDevBase = class extends HTMLElement {
    constructor(name, idom) {
      super();
      this.name = name;
      this.idom = idom;
    }
    setOrder(order) {
      this.style.order = order;
      localStorage.setItem("idom_order|" + this.name, order);
    }
    connectedCallback() {
      this.root = this.appendChild(document.createElement("div"));
      this.root.id = this.name;
      this.root.className = "idom-device-root";
      this.root.position = "relative";
      const swap = (up) => {
        const lst = Array.prototype.slice.call(this.parentElement.querySelectorAll(".idom-device")).sort((a, b) => a.style.order - b.style.order);
        for (let idx = 0; idx < lst.length; idx++) {
          if (lst[idx] == this && idx != (up ? 0 : lst.length - 1)) {
            const cur = this.style.order;
            this.setOrder(lst[idx + (up ? -1 : 1)].style.order);
            lst[idx + (up ? -1 : 1)].setOrder(cur);
            break;
          }
        }
      };
      this.upbutton = new iIcon("up", 24, 24, () => swap(true));
      this.downbutton = new iIcon("down", 24, 24, () => swap(false));
      this.infobutton = new iIcon("info", 18, 18, () => {
        this.appendChild(new iInfo(this.dev));
      });
      this.infobutton.style.paddingRight = "4px";
      this.buildToolbar();
      this.buildTitle();
      this.body = this.root.appendChild(document.createElement("div"));
      this.body.className = "idom-device-body";
      this.buildCustom();
    }
    buildToolbar() {
      this.toolbar = this.root.appendChild(document.createElement("div"));
      this.toolbar.appendChild(this.infobutton);
      this.toolbar.appendChild(this.upbutton);
      this.toolbar.appendChild(this.downbutton);
      this.toolbar.style.position = "relative";
      this.toolbar.className = "idom-device-toolbar";
    }
    buildTitle() {
      this.titleNode = this.toolbar.insertAdjacentElement("afterbegin", document.createElement("div"));
      this.titleNode.style.marginRight = "auto";
      this.titleNode.style.fontWeight = "700";
      this.titleNode.textContent = this.deviceName || this.name;
    }
    buildCustom() {
    }
    update(dev) {
      this.dev = dev;
    }
  };

  // src/idev.js
  var iDev = class extends iDevBase {
    sw = [];
    constructor(name, idom) {
      super();
      this.name = name;
      this.idom = idom;
    }
    buildTitle() {
      this.titleNode = this.toolbar.insertAdjacentElement("afterbegin", document.createElement("div"));
      this.titleNode.style.marginRight = "auto";
      this.titleNode.style.fontWeight = "700";
      this.titleNode.textContent = this.deviceName || this.name;
    }
    buildCustom() {
      this.sensorNode = this.body.appendChild(document.createElement("div"));
      this.sensorNode.className = "idom-device-sensor";
      this.sensorNode.style.display = "none";
      this.statusNode = this.body.appendChild(document.createElement("div"));
      this.statusNode.style.display = "none";
      this.swNode = this.body.appendChild(document.createElement("div"));
      this.swNode.className = "idom-device-switches";
    }
    update(dev) {
      this.dev = dev;
      this.statusNode.textContent = dev.LWT || "";
      if (dev.SENSOR) {
        this.sensorNode.style.display = "block";
        const tmp = dev.SENSOR.AM2301 || dev.SENSOR.SI7021;
        this.sensorNode.innerHTML = tmp ? `<i-icon width="24" height="24" name="temp" ></i-icon>${tmp.Temperature}C <i-icon width="24" height="24" name="hum" style="padding-left: 20px" ></i-icon> ${tmp.Humidity}%` : "?";
      }
      if (dev.STATUS) {
        dev.STATUS.Status.FriendlyName.forEach((e, i) => {
          this.addSwElement(i);
          this.sw[i].setIndex(i);
          this.sw[i].setFName(e);
          this.sw[i].setState(i + 1 == dev.STATUS.Status.Power ? "ON" : "OFF");
        });
        this.deviceName = dev.STATUS.Status.DeviceName;
        this.titleNode.textContent = this.deviceName || this.name;
      }
      Object.keys(dev).filter((a) => a.startsWith("POWER")).forEach((e) => {
        const i = Number(e.substring(5) || 1) - 1;
        this.addSwElement(i);
        this.sw[i].setIndex(i);
        this.sw[i].setName(e);
        this.sw[i].setState(dev[e]);
      });
    }
    addSwElement(i) {
      if (this.sw[i] === void 0) {
        if (this.sw[i + 1]) {
          this.sw[i] = this.swNode.insertBefore(new iSwitch(this.idom, this.name), this.sw[i + 1]);
        } else {
          this.sw[i] = this.swNode.appendChild(new iSwitch(this.idom, this.name));
        }
      }
    }
  };
  customElements.define("i-dev", iDev);

  // src/idevcam.js
  var iDevCam = class extends iDevBase {
    buildCustom() {
      this.main = this.root.appendChild(document.createElement("div"));
      this.imgNode = this.main.appendChild(document.createElement("img"));
      this.imgNode.setAttribute("width", "100%");
    }
    buildTitle() {
      this.titleNode = this.toolbar.insertAdjacentElement("afterbegin", document.createElement("div"));
      this.titleNode.style.marginRight = "auto";
      this.titleNode.style.fontWeight = "700";
      this.titleNode.textContent = this.deviceName || this.name;
    }
    update(dev) {
      this.dev = dev;
      this.imgNode.src = `data:image/png;base64,${dev.image}`;
    }
  };
  customElements.define("i-dev-cam", iDevCam);

  // src/tasmota.css
  var tasmota_default = "/* THEME */\n\n.idom-main {\n    padding: 10px;\n    padding-bottom: 60px;\n\n    /* display: flex;\n    flex-direction: column; */\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n\n    gap: 1rem;\n    background-color: #252525;\n}\n\n@media (min-width: 0px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(1, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n@media (min-width: 700px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(2, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n@media (min-width: 1000px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n@media (min-width: 1300px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n.idom-device {\n    background-color: #283239;\n    border-radius: 0.5em;\n}\n\n.idom-device h2 {\n    margin-top: 0px;\n}\n\ni-switch {\n    display: flex;\n    justify-content: center;\n}\n\n.idom-device-switches {\n    display: flex;\n    justify-content: center;\n    flex-wrap: wrap;\n}\n\n.idom-device .iswitch {\n    padding-left: 20px;\n    padding-right: 20px;\n    white-space: nowrap;\n    flex-basis: 250px;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-evenly;\n    gap: 0.5em;\n    /* margin-bottom: 20px; */\n    /* max-width: 350px; */\n}\n\n.idom-device .iswitch.OFF {\n    background-color: #88A9BB;\n}\n\n.idom-device-sensor {\n    font-size: 2em;\n}\n\n.idom-device-toolbar {\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n    padding: 6px;\n    padding-left: 10px;\n}\n\n.idom-device-body {\n    display: flex;\n    flex-direction: column;\n    align-content: center;\n    justify-content: center;\n    align-items: center;\n    flex: 1;\n    padding: 6px;\n    gap:6px;\n}\n\n.idom-device-root {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    /* align-content: center;\n    justify-content: center;\n    align-items: center; */\n}\n\n.spinner {\n    display: inline-block;\n    width: 24px;\n    height: 24px;\n    /* margin: 100px auto; */\n    background-color: #333;\n    border-radius: 100%;\n    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;\n    animation: sk-scaleout 1.0s infinite ease-in-out;\n}\n\n@-webkit-keyframes sk-scaleout {\n    0% {\n        -webkit-transform: scale(0)\n    }\n    100% {\n        -webkit-transform: scale(1.0);\n        opacity: 0;\n    }\n}\n\n@keyframes sk-scaleout {\n    0% {\n        -webkit-transform: scale(0);\n        transform: scale(0);\n    }\n    100% {\n        -webkit-transform: scale(1.0);\n        transform: scale(1.0);\n        opacity: 0;\n    }\n}\n\n/* */\n\n* {\n    color: #eaeaea;\n}\n\n/* */\n\ndiv, fieldset, input, select {\n    /* padding: 5px; */\n    font-size: 1em;\n}\n\nfieldset {\n    background: #4f4f4f;\n}\n\np {\n    margin: 0.5em 0;\n}\n\ninput {\n    width: 100%;\n    box-sizing: border-box;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    background: #dddddd;\n    color: #000000;\n}\n\ninput[type=checkbox], input[type=radio] {\n    width: 1em;\n    margin-right: 6px;\n    vertical-align: -1px;\n}\n\ninput[type=range] {\n    width: 99%;\n}\n\nselect {\n    width: 100%;\n    background: #dddddd;\n    color: #000000;\n}\n\ntextarea {\n    resize: vertical;\n    width: 98%;\n    height: 318px;\n    padding: 5px;\n    overflow: auto;\n    background: #1f1f1f;\n    color: #65c115;\n}\n\nbody {\n    text-align: center;\n    font-family: verdana, sans-serif;\n    background: #252525;\n}\n\ntd {\n    padding: 0px;\n}\n\nbutton {\n    border: 0;\n    border-radius: 0.3rem;\n    background: #1fa3ec;\n    color: #faffff;\n    line-height: 2.4rem;\n    font-size: 1.2rem;\n    width: 100%;\n    -webkit-transition-duration: 0.4s;\n    transition-duration: 0.4s;\n    cursor: pointer;\n}\n\nbutton:hover {\n    background: #0e70a4;\n}\n\nbutton:disabled, button[disabled] {\n    background: #cccccc;\n    cursor: default;\n}\n\n.bred {\n    background: #d43535;\n}\n\n.bred:hover {\n    background: #931f1f;\n}\n\n.bgrn {\n    background: #47c266;\n}\n\n.bgrn:hover {\n    background: #5aaf6f;\n}\n\na {\n    color: #1fa3ec;\n    text-decoration: none;\n}\n\n.p {\n    float: left;\n    text-align: left;\n}\n\n.q {\n    float: right;\n    text-align: right;\n}\n\n.r {\n    border-radius: 0.3em;\n    padding: 2px;\n    margin: 6px 2px;\n}";

  // src/iinfoobject.js
  var iInfoObject = class extends iDialogBase {
    constructor(info) {
      super();
      this.info = info;
    }
    build() {
      this.root.style.paddingTop = "40px";
      const t = this.root.appendChild(document.createElement("div")).appendChild(document.createElement("table"));
      t.parentElement.marginBottom = "auto";
      t.parentElement.style.overflowY = "scroll";
      this.table = t.appendChild(document.createElement("tbody"));
      t.style.minWidth = "300px";
      t.style.textAlign = "left";
      Object.keys(this.info).forEach((k) => {
        this.row(k, this.info[k] || "-");
      });
      const b = this.root.appendChild(document.createElement("button"));
      b.textContent = "Close";
      b.style.maxWidth = "300px";
      b.style.marginTop = "20px";
      b.style.flex = "30px";
      b.style.marginBottom = "100px";
      b.onclick = () => {
        this.closeDialog();
      };
    }
    row(k, v) {
      const row = this.table.insertRow();
      row.appendChild(document.createElement("th")).textContent = k;
      row.appendChild(document.createElement("td")).textContent = v;
    }
  };
  customElements.define("i-info-object", iInfoObject);

  // src/idom.js
  var mqtt = window.mqtt;
  var iDom = class extends HTMLElement {
    devs = new Proxy({}, {
      set: (obj, p, v) => {
        obj[p] = v;
        this.render(p);
        return true;
      }
    });
    SYS = {};
    wdevs = {};
    lastOrder = 0;
    constructor() {
      super();
      this.worker = new Worker("idomworkerpaho.js");
      this.worker.onmessage = (m) => {
        if (m.data && m.data.action) {
          switch (m.data.action) {
            case "login":
              this.loginDialog();
              break;
            case "disconnected":
              this.netstat.setName("wifioff");
              this.loginDialog();
              break;
            case "connected":
              this.netstat.setName("wifi");
              this.loadingNode.style.display = "none";
              this.loginNode.style.display = "none";
              break;
            case "message":
              this.onmessage(m.data.topic, m.data.payload);
              break;
            default:
              break;
          }
        }
      };
      this.worker.postMessage({action: "start"});
    }
    onmessage(topic, payload) {
      try {
        const [type, name, cmd] = topic.split("/");
        if (cmd == "LWT") {
          this.devs[name] = {...this.devs[name] || {}, LWT: payload.toString()};
          if (this.devs[name].STATUS == void 0)
            this.worker.postMessage({action: "publish", topic: `cmnd/${name}/STATUS`, payload: ""});
          if (this.devs[name].STATUS5 == void 0)
            this.worker.postMessage({action: "publish", topic: `cmnd/${name}/STATUS`, payload: "5"});
          this.worker.postMessage({action: "publish", topic: `cmnd/${name}/STATE`, payload: ""});
        } else if (type == "stat" && cmd.startsWith("STATUS")) {
          this.devs[name] = {...this.devs[name] || {}, [cmd]: JSON.parse(payload.toString())};
        } else if (cmd == "RESULT") {
          this.devs[name] = {...this.devs[name] || {}, RESULT: JSON.parse(payload.toString())};
        } else if (cmd == "SENSOR") {
          this.devs[name] = {...this.devs[name] || {}, SENSOR: JSON.parse(payload.toString())};
        } else if (type == "stat") {
          this.devs[name] = {...this.devs[name] || {}, [cmd]: payload.toString()};
        } else if (type == "tele" && cmd == "STATE") {
          this.devs[name] = {...this.devs[name] || {}, STATE: JSON.parse(payload.toString())};
        } else if (type == "hikmqtt") {
          const pp = JSON.parse(payload.toString());
          this.devs[name] = {
            name: pp.Name,
            image: pp.Image,
            DeviceName: pp.Name,
            Topic: topic,
            Ip: pp.Ip,
            type: "cam"
          };
        } else if (type == "$SYS") {
          this.SYS[topic] = payload.toString();
        } else {
        }
      } catch (e) {
        console.log(e);
      }
    }
    loginDialog() {
      this.loginNode.style.display = "block";
    }
    connectedCallback() {
      const s = this.appendChild(document.createElement("style"));
      s.innerHTML = tasmota_default;
      this.root = this.appendChild(document.createElement("div"));
      this.loadingNode = this.appendChild(new iLoading());
      this.toolbar = this.appendChild(document.createElement("div"));
      this.toolbar.style.paddingTop = "6px";
      this.toolbar.style.position = "fixed";
      this.toolbar.style.bottom = "0";
      this.toolbar.style.left = "0";
      this.toolbar.style.backgroundColor = "black";
      this.toolbar.style.height = "54px";
      this.toolbar.style.width = "100%";
      this.toolbar.style.display = "flex";
      this.toolbar.style.alignContent = "center";
      this.toolbar.style.justifyContent = "space-evenly";
      this.toolbar.style.alignItems = "flex-start";
      this.toolbar.style.flexDirection = "row";
      this.loginNode = this.appendChild(new iLogin((url, username, password) => {
        localStorage.setItem("idom_url", url);
        localStorage.setItem("idom_username", username);
        localStorage.setItem("idom_password", password);
        this.loadingNode.style.display = "block";
        this.connect();
      }));
      this.loginNode.style.display = "none";
      this.main = this.appendChild(document.createElement("div"));
      this.main.className = "idom-main";
      this.netstat = this.toolbar.appendChild(new iIcon("wifioff", 24, 24, () => {
        this.appendChild(new iInfoObject(this.SYS));
      }));
      this.logout = this.toolbar.appendChild(new iIcon("logout", 24, 24, () => {
        this.worker.postMessage({action: "logout"});
      }));
      this.connect();
    }
    connect() {
      if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
        this.worker.postMessage({action: "connect", url: localStorage.getItem("idom_url") || "ws://" + location.host, username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password")});
      } else {
        this.loginDialog();
      }
    }
    render(name) {
      if (name === void 0) {
        console.log(this.devs);
        Object.keys(this.devs).forEach((e) => {
          this.render(e);
        });
      } else {
        if (this.wdevs[name] == void 0) {
          switch (this.devs[name].type) {
            case "cam":
              this.wdevs[name] = this.main.appendChild(new iDevCam(name, this));
              this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
              this.lastOrder = localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1;
              this.wdevs[name].className = "idom-device";
              break;
            default:
              this.wdevs[name] = this.main.appendChild(new iDev(name, this));
              this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
              this.lastOrder = localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1;
              this.wdevs[name].className = "idom-device";
              break;
          }
        }
        this.wdevs[name].update(this.devs[name]);
      }
    }
    publish(topic, payload) {
      this.worker.postMessage({action: "publish", topic, payload});
    }
  };
  customElements.define("i-dom", iDom);
})();
