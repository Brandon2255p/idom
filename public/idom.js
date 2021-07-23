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

  // src/icons/passicon.js
  var iPassIcon = class extends HTMLElement {
    constructor(width, height, callback) {
      super();
      this.width = width || 24;
      this.height = height || 24;
      this.callback = callback;
    }
    connectedCallback() {
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
      this.style.cursor = "pointer";
      this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";
      this.onmouseout = () => this.firstChild.style.fill = "none";
      if (this.callback)
        this.onclick = this.callback;
    }
  };
  customElements.define("i-pass-icon", iPassIcon);

  // src/icons/usericon.js
  var iUserIcon = class extends HTMLElement {
    constructor(width, height, callback) {
      super();
      this.width = width || 24;
      this.height = height || 24;
      this.callback = callback;
    }
    connectedCallback() {
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      this.style.cursor = "pointer";
      this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";
      this.onmouseout = () => this.firstChild.style.fill = "none";
      if (this.callback)
        this.onclick = this.callback;
    }
  };
  customElements.define("i-user-icon", iUserIcon);

  // src/icons/urlicon.js
  var iUrlIcon = class extends HTMLElement {
    constructor(width, height, callback) {
      super();
      this.width = width || 24;
      this.height = height || 24;
      this.callback = callback;
    }
    connectedCallback() {
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-server"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`;
      this.style.cursor = "pointer";
      this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";
      this.onmouseout = () => this.firstChild.style.fill = "none";
      if (this.callback)
        this.onclick = this.callback;
    }
  };
  customElements.define("i-url-icon", iUrlIcon);

  // src/ilogin.js
  var iLogin = class extends HTMLElement {
    constructor(onconnect) {
      super();
      this.onconnect = onconnect;
    }
    connectedCallback() {
      this.main = this.appendChild(document.createElement("div"));
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
            <h1>iDom v.0.0.3</h1>
            <div style="display: flex;align-content: stretch;justify-content: space-evenly;align-items: center;">
                <div style="width: 24px;"><i-url-icon></i-url-icon></div><div><input id="url" type="text" style="width: 100%;"></div>
            </div>
            <div style="display: flex;align-content: stretch;justify-content: space-evenly;align-items: center;">
                <div style="width: 24px;"><i-user-icon></i-user-icon></div><div><input id="username" type="text" style="width: 100%;"></div>
            </div>
            <div style="display: flex;align-content: stretch;justify-content: space-evenly;align-items: center;">
                <div style="width: 24px;"><i-pass-icon></i-pass-icon></div><div><input id="password" type="password" style="width: 100%;"></div>
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
    }
    validate() {
      console.log(!(this.username.value && this.username.value.length > 0 && this.password.value && this.password.value.length > 0));
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
      this.root.textContent = `${this.fname || this.name}: ${this.state}`;
    }
    connectedCallback() {
      this.style.padding = "5px";
      this.root = this.appendChild(document.createElement("button"));
      this.root.className = "iswitch";
      this.root.textContent = "Loading...";
      this.root.addEventListener("click", () => {
        this.idom.publish(`cmnd/${this.devname}/Power${this.index + 1}`, "TOGGLE");
      });
    }
    setIndex(i) {
      this.index = i;
    }
  };
  customElements.define("i-switch", iSwitch);

  // src/icons/infoicon.js
  var iInfoIcon = class extends HTMLElement {
    constructor(width, height, callback) {
      super();
      this.width = width || 24;
      this.height = height || 24;
      this.callback = callback;
    }
    connectedCallback() {
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      this.style.cursor = "pointer";
      this.onmouseover = () => this.firstChild.style.fill = "#aaaaaa";
      this.onmouseout = () => this.firstChild.style.fill = "none";
      if (this.callback)
        this.onclick = this.callback;
    }
  };
  customElements.define("i-info-icon", iInfoIcon);

  // src/iinfo.js
  var iInfo = class extends HTMLElement {
    constructor(info) {
      super();
      this.info = info;
    }
    connectedCallback() {
      console.log(this.info);
      this.root = this.appendChild(document.createElement("div"));
      this.root.style.position = "fixed";
      this.root.style.top = "0px";
      this.root.style.width = "100%";
      this.root.style.height = "100%";
      this.root.style.display = "flex";
      this.root.style.alignItems = "center";
      this.root.style.justifyContent = "center";
      this.root.style.alignContent = "stretch";
      this.root.style.flexDirection = "column";
      this.root.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      this.root.appendChild(document.createElement("h1")).textContent = this.info.STATUS.Status.DeviceName;
      const t = this.root.appendChild(document.createElement("table"));
      this.table = t.appendChild(document.createElement("tbody"));
      t.style.minWidth = "300px";
      t.style.textAlign = "left";
      this.row("DeviceName", this.info.STATUS.Status.DeviceName);
      this.row("Topic", this.info.STATUS.Status.Topic);
      this.row("IP", this.info.STATUS5.StatusNET.IPAddress);
      const b = this.root.appendChild(document.createElement("button"));
      b.textContent = "Close";
      b.style.maxWidth = "300px";
      b.style.marginTop = "20px";
      b.onclick = () => {
        this.remove();
      };
    }
    row(k, v) {
      const row = this.table.insertRow();
      row.appendChild(document.createElement("th")).textContent = k;
      row.appendChild(document.createElement("td")).textContent = v;
    }
  };
  customElements.define("i-info", iInfo);

  // src/idev.js
  var iDev = class extends HTMLElement {
    sw = [];
    constructor(name, idom) {
      super();
      this.name = name;
      this.idom = idom;
    }
    connectedCallback() {
      this.root = this.appendChild(document.createElement("div"));
      this.root.id = this.name;
      this.root.style.padding = "10px";
      this.titleParentNode = this.root.appendChild(document.createElement("h2"));
      this.titleNode = this.titleParentNode.appendChild(document.createElement("span"));
      this.titleNode.textContent = this.deviceName || this.name;
      this.titleParentNode.appendChild(new iInfoIcon(16, 16, () => {
        console.log("info", this.dev);
        this.appendChild(new iInfo(this.dev));
      })).style.paddingLeft = "8px";
      this.statusNode = this.root.appendChild(document.createElement("div"));
      this.statusNode.style.display = "none";
      this.swNode = this.root.appendChild(document.createElement("div"));
    }
    update(dev) {
      this.dev = dev;
      this.statusNode.textContent = dev.LWT || "";
      if (dev.SENSOR) {
        if (this.sensorNode === void 0) {
          this.sensorNode = this.root.appendChild(document.createElement("div"));
        }
        const tmp = dev.SENSOR.AM2301 || dev.SENSOR.SI7021;
        this.sensorNode.textContent = tmp ? `T: ${tmp.Temperature}C H: ${tmp.Humidity}% D: ${tmp.DewPoint}C` : "?";
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

  // src/tasmota.css
  var tasmota_default = "* {\n    color: #eaeaea;\n}\n\n.iswitch {\n    margin-bottom: 20px;\n    max-width: 350px;\n    /* margin-left: 20px; */\n}\n\n/* */\n\ndiv, fieldset, input, select {\n    /* padding: 5px; */\n    font-size: 1em;\n}\n\nfieldset {\n    background: #4f4f4f;\n}\n\np {\n    margin: 0.5em 0;\n}\n\ninput {\n    width: 100%;\n    box-sizing: border-box;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    background: #dddddd;\n    color: #000000;\n}\n\ninput[type=checkbox], input[type=radio] {\n    width: 1em;\n    margin-right: 6px;\n    vertical-align: -1px;\n}\n\ninput[type=range] {\n    width: 99%;\n}\n\nselect {\n    width: 100%;\n    background: #dddddd;\n    color: #000000;\n}\n\ntextarea {\n    resize: vertical;\n    width: 98%;\n    height: 318px;\n    padding: 5px;\n    overflow: auto;\n    background: #1f1f1f;\n    color: #65c115;\n}\n\nbody {\n    text-align: center;\n    font-family: verdana, sans-serif;\n    background: #252525;\n}\n\ntd {\n    padding: 0px;\n}\n\nbutton {\n    border: 0;\n    border-radius: 0.3rem;\n    background: #1fa3ec;\n    color: #faffff;\n    line-height: 2.4rem;\n    font-size: 1.2rem;\n    width: 100%;\n    -webkit-transition-duration: 0.4s;\n    transition-duration: 0.4s;\n    cursor: pointer;\n}\n\nbutton:hover {\n    background: #0e70a4;\n}\n\nbutton:disabled, button[disabled] {\n    background: #cccccc;\n    cursor: default;\n}\n\n.bred {\n    background: #d43535;\n}\n\n.bred:hover {\n    background: #931f1f;\n}\n\n.bgrn {\n    background: #47c266;\n}\n\n.bgrn:hover {\n    background: #5aaf6f;\n}\n\na {\n    color: #1fa3ec;\n    text-decoration: none;\n}\n\n.p {\n    float: left;\n    text-align: left;\n}\n\n.q {\n    float: right;\n    text-align: right;\n}\n\n.r {\n    border-radius: 0.3em;\n    padding: 2px;\n    margin: 6px 2px;\n}";

  // src/idom.js
  var mqtt = window.mqtt;
  var iDom = class extends HTMLElement {
    devs = {};
    wdevs = {};
    constructor() {
      super();
      this.worker = new Worker("idomworker.js");
      this.worker.onmessage = (m) => {
        if (m.data && m.data.action) {
          switch (m.data.action) {
            case "login":
              this.loginDialog();
              break;
            case "connected":
              this.loadingoff();
              if (this.root.firstChild && this.root.firstChild.tagName === "I-LOGIN") {
                this.root.firstChild.remove();
              }
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
      const [type, name, cmd] = topic.split("/");
      if (cmd == "LWT") {
        this.devs[name] = {...this.devs[name] || {}, LWT: payload.toString()};
        this.worker.postMessage({action: "publish", topic: `cmnd/${name}/STATUS`, payload: "0"});
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
      } else {
      }
      this.render();
    }
    loginDialog() {
      if (!(this.root.firstChild && this.root.firstChild.tagName === "I-LOGIN")) {
        this.loadingoff();
        this.root.innerHTML = "";
        this.root.appendChild(new iLogin((url, username, password) => {
          console.log("login");
          localStorage.setItem("idom_url", url);
          localStorage.setItem("idom_username", username);
          localStorage.setItem("idom_password", password);
          this.loading();
          this.connect();
        }));
      }
    }
    connectedCallback() {
      const s = this.appendChild(document.createElement("style"));
      s.innerHTML = tasmota_default;
      this.root = this.appendChild(document.createElement("div"));
      this.loadingNode = this.appendChild(new iLoading());
      this.main = this.appendChild(document.createElement("div"));
      this.connect();
    }
    loading() {
      this.loadingNode.style.display = "block";
    }
    loadingoff() {
      console.log("loading off");
      this.loadingNode.style.display = "none";
    }
    connect() {
      if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
        this.worker.postMessage({action: "connect", url: localStorage.getItem("idom_url") || "ws://" + location.host, username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password")});
      } else {
        this.loginDialog();
      }
    }
    render() {
      Object.keys(this.devs).forEach((e) => {
        if (this.wdevs[e] == void 0) {
          this.wdevs[e] = this.main.appendChild(new iDev(e, this));
        }
        this.wdevs[e].update(this.devs[e]);
      });
    }
    publish(topic, payload) {
      this.client.publish(topic, payload);
    }
  };
  customElements.define("i-dom", iDom);
})();
