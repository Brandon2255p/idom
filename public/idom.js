(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/gridstack/dist/h5/dd-manager.js
  var require_dd_manager = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDManager = void 0;
    var DDManager = class {
    };
    exports.DDManager = DDManager;
  });

  // node_modules/gridstack/dist/h5/dd-resizable-handle.js
  var require_dd_resizable_handle = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDResizableHandle = void 0;
    var DDResizableHandle = class {
      constructor(host, direction, option) {
        this.moving = false;
        this.host = host;
        this.dir = direction;
        this.option = option;
        this._mouseDown = this._mouseDown.bind(this);
        this._mouseMove = this._mouseMove.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._init();
      }
      _init() {
        const el = document.createElement("div");
        el.classList.add("ui-resizable-handle");
        el.classList.add(`${DDResizableHandle.prefix}${this.dir}`);
        el.style.zIndex = "100";
        el.style.userSelect = "none";
        this.el = el;
        this.host.appendChild(this.el);
        this.el.addEventListener("mousedown", this._mouseDown);
        return this;
      }
      destroy() {
        if (this.moving)
          this._mouseUp(this.mouseDownEvent);
        this.el.removeEventListener("mousedown", this._mouseDown);
        this.host.removeChild(this.el);
        delete this.el;
        delete this.host;
        return this;
      }
      _mouseDown(e) {
        e.preventDefault();
        this.mouseDownEvent = e;
        document.addEventListener("mousemove", this._mouseMove, true);
        document.addEventListener("mouseup", this._mouseUp);
      }
      _mouseMove(e) {
        let s = this.mouseDownEvent;
        if (!this.moving && Math.abs(e.x - s.x) + Math.abs(e.y - s.y) > 2) {
          this.moving = true;
          this._triggerEvent("start", this.mouseDownEvent);
        } else if (this.moving) {
          this._triggerEvent("move", e);
        }
      }
      _mouseUp(e) {
        if (this.moving) {
          this._triggerEvent("stop", e);
        }
        document.removeEventListener("mousemove", this._mouseMove, true);
        document.removeEventListener("mouseup", this._mouseUp);
        delete this.moving;
        delete this.mouseDownEvent;
      }
      _triggerEvent(name, event) {
        if (this.option[name])
          this.option[name](event);
        return this;
      }
    };
    exports.DDResizableHandle = DDResizableHandle;
    DDResizableHandle.prefix = "ui-resizable-";
  });

  // node_modules/gridstack/dist/h5/dd-base-impl.js
  var require_dd_base_impl = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDBaseImplement = void 0;
    var DDBaseImplement = class {
      constructor() {
        this._disabled = false;
        this._eventRegister = {};
      }
      get disabled() {
        return this._disabled;
      }
      on(event, callback) {
        this._eventRegister[event] = callback;
      }
      off(event) {
        delete this._eventRegister[event];
      }
      enable() {
        this._disabled = false;
      }
      disable() {
        this._disabled = true;
      }
      destroy() {
        delete this._eventRegister;
      }
      triggerEvent(eventName, event) {
        if (!this.disabled && this._eventRegister && this._eventRegister[eventName])
          return this._eventRegister[eventName](event);
      }
    };
    exports.DDBaseImplement = DDBaseImplement;
  });

  // node_modules/gridstack/dist/h5/dd-utils.js
  var require_dd_utils = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDUtils = void 0;
    var DDUtils = class {
      static clone(el) {
        const node = el.cloneNode(true);
        node.removeAttribute("id");
        return node;
      }
      static appendTo(el, parent) {
        let parentNode;
        if (typeof parent === "string") {
          parentNode = document.querySelector(parent);
        } else {
          parentNode = parent;
        }
        if (parentNode) {
          parentNode.appendChild(el);
        }
      }
      static setPositionRelative(el) {
        if (!/^(?:r|a|f)/.test(window.getComputedStyle(el).position)) {
          el.style.position = "relative";
        }
      }
      static addElStyles(el, styles) {
        if (styles instanceof Object) {
          for (const s in styles) {
            if (styles.hasOwnProperty(s)) {
              if (Array.isArray(styles[s])) {
                styles[s].forEach((val) => {
                  el.style[s] = val;
                });
              } else {
                el.style[s] = styles[s];
              }
            }
          }
        }
      }
      static initEvent(e, info) {
        const evt = {type: info.type};
        const obj = {
          button: 0,
          which: 0,
          buttons: 1,
          bubbles: true,
          cancelable: true,
          target: info.target ? info.target : e.target
        };
        if (e.dataTransfer) {
          evt["dataTransfer"] = e.dataTransfer;
        }
        ["altKey", "ctrlKey", "metaKey", "shiftKey"].forEach((p) => evt[p] = e[p]);
        ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY"].forEach((p) => evt[p] = e[p]);
        return Object.assign(Object.assign({}, evt), obj);
      }
    };
    exports.DDUtils = DDUtils;
    DDUtils.isEventSupportPassiveOption = (() => {
      let supportsPassive = false;
      let passiveTest = () => {
      };
      document.addEventListener("test", passiveTest, {
        get passive() {
          supportsPassive = true;
          return true;
        }
      });
      document.removeEventListener("test", passiveTest);
      return supportsPassive;
    })();
  });

  // node_modules/gridstack/dist/utils.js
  var require_utils = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.Utils = exports.obsoleteAttr = exports.obsoleteOptsDel = exports.obsoleteOpts = exports.obsolete = void 0;
    function obsolete(self, f, oldName, newName, rev) {
      let wrapper = (...args) => {
        console.warn("gridstack.js: Function `" + oldName + "` is deprecated in " + rev + " and has been replaced with `" + newName + "`. It will be **completely** removed in v1.0");
        return f.apply(self, args);
      };
      wrapper.prototype = f.prototype;
      return wrapper;
    }
    exports.obsolete = obsolete;
    function obsoleteOpts(opts, oldName, newName, rev) {
      if (opts[oldName] !== void 0) {
        opts[newName] = opts[oldName];
        console.warn("gridstack.js: Option `" + oldName + "` is deprecated in " + rev + " and has been replaced with `" + newName + "`. It will be **completely** removed in v1.0");
      }
    }
    exports.obsoleteOpts = obsoleteOpts;
    function obsoleteOptsDel(opts, oldName, rev, info) {
      if (opts[oldName] !== void 0) {
        console.warn("gridstack.js: Option `" + oldName + "` is deprecated in " + rev + info);
      }
    }
    exports.obsoleteOptsDel = obsoleteOptsDel;
    function obsoleteAttr(el, oldName, newName, rev) {
      let oldAttr = el.getAttribute(oldName);
      if (oldAttr !== null) {
        el.setAttribute(newName, oldAttr);
        console.warn("gridstack.js: attribute `" + oldName + "`=" + oldAttr + " is deprecated on this object in " + rev + " and has been replaced with `" + newName + "`. It will be **completely** removed in v1.0");
      }
    }
    exports.obsoleteAttr = obsoleteAttr;
    var Utils = class {
      static getElements(els) {
        if (typeof els === "string") {
          let list = document.querySelectorAll(els);
          if (!list.length && els[0] !== "." && els[0] !== "#") {
            list = document.querySelectorAll("." + els);
            if (!list.length) {
              list = document.querySelectorAll("#" + els);
            }
          }
          return Array.from(list);
        }
        return [els];
      }
      static getElement(els) {
        if (typeof els === "string") {
          if (!els.length)
            return null;
          if (els[0] === "#") {
            return document.getElementById(els.substring(1));
          }
          if (els[0] === "." || els[0] === "[") {
            return document.querySelector(els);
          }
          if (!isNaN(+els[0])) {
            return document.getElementById(els);
          }
          let el = document.querySelector(els);
          if (!el) {
            el = document.getElementById(els);
          }
          if (!el) {
            el = document.querySelector("." + els);
          }
          return el;
        }
        return els;
      }
      static isIntercepted(a, b) {
        return !(a.y >= b.y + b.h || a.y + a.h <= b.y || a.x + a.w <= b.x || a.x >= b.x + b.w);
      }
      static isTouching(a, b) {
        return Utils.isIntercepted(a, {x: b.x - 0.5, y: b.y - 0.5, w: b.w + 1, h: b.h + 1});
      }
      static sort(nodes, dir, column) {
        column = column || nodes.reduce((col, n) => Math.max(n.x + n.w, col), 0) || 12;
        if (dir === -1)
          return nodes.sort((a, b) => b.x + b.y * column - (a.x + a.y * column));
        else
          return nodes.sort((b, a) => b.x + b.y * column - (a.x + a.y * column));
      }
      static createStylesheet(id, parent) {
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("gs-style-id", id);
        if (style.styleSheet) {
          style.styleSheet.cssText = "";
        } else {
          style.appendChild(document.createTextNode(""));
        }
        if (!parent) {
          parent = document.getElementsByTagName("head")[0];
          parent.appendChild(style);
        } else {
          parent.insertBefore(style, parent.firstChild);
        }
        return style.sheet;
      }
      static removeStylesheet(id) {
        let el = document.querySelector("STYLE[gs-style-id=" + id + "]");
        if (el && el.parentNode)
          el.remove();
      }
      static addCSSRule(sheet, selector, rules) {
        if (typeof sheet.addRule === "function") {
          sheet.addRule(selector, rules);
        } else if (typeof sheet.insertRule === "function") {
          sheet.insertRule(`${selector}{${rules}}`);
        }
      }
      static toBool(v) {
        if (typeof v === "boolean") {
          return v;
        }
        if (typeof v === "string") {
          v = v.toLowerCase();
          return !(v === "" || v === "no" || v === "false" || v === "0");
        }
        return Boolean(v);
      }
      static toNumber(value) {
        return value === null || value.length === 0 ? void 0 : Number(value);
      }
      static parseHeight(val) {
        let h;
        let unit = "px";
        if (typeof val === "string") {
          let match = val.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/);
          if (!match) {
            throw new Error("Invalid height");
          }
          unit = match[2] || "px";
          h = parseFloat(match[1]);
        } else {
          h = val;
        }
        return {h, unit};
      }
      static defaults(target, ...sources) {
        sources.forEach((source) => {
          for (const key in source) {
            if (!source.hasOwnProperty(key))
              return;
            if (target[key] === null || target[key] === void 0) {
              target[key] = source[key];
            } else if (typeof source[key] === "object" && typeof target[key] === "object") {
              this.defaults(target[key], source[key]);
            }
          }
        });
        return target;
      }
      static same(a, b) {
        if (typeof a !== "object")
          return a == b;
        if (typeof a !== typeof b)
          return false;
        if (Object.keys(a).length !== Object.keys(b).length)
          return false;
        for (const key in a) {
          if (a[key] !== b[key])
            return false;
        }
        return true;
      }
      static copyPos(a, b, minMax = false) {
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.h = b.h;
        if (!minMax)
          return a;
        if (b.minW)
          a.minW = b.minW;
        if (b.minH)
          a.minH = b.minH;
        if (b.maxW)
          a.maxW = b.maxW;
        if (b.maxH)
          a.maxH = b.maxH;
        return a;
      }
      static samePos(a, b) {
        return a && b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
      }
      static removeInternalAndSame(a, b) {
        if (typeof a !== "object" || typeof b !== "object")
          return;
        for (let key in a) {
          let val = a[key];
          if (key[0] === "_" || val === b[key]) {
            delete a[key];
          } else if (val && typeof val === "object" && b[key] !== void 0) {
            for (let i in val) {
              if (val[i] === b[key][i] || i[0] === "_") {
                delete val[i];
              }
            }
            if (!Object.keys(val).length) {
              delete a[key];
            }
          }
        }
      }
      static closestByClass(el, name) {
        while (el = el.parentElement) {
          if (el.classList.contains(name))
            return el;
        }
        return null;
      }
      static throttle(func, delay) {
        let isWaiting = false;
        return (...args) => {
          if (!isWaiting) {
            isWaiting = true;
            setTimeout(() => {
              func(...args);
              isWaiting = false;
            }, delay);
          }
        };
      }
      static removePositioningStyles(el) {
        let style = el.style;
        if (style.position) {
          style.removeProperty("position");
        }
        if (style.left) {
          style.removeProperty("left");
        }
        if (style.top) {
          style.removeProperty("top");
        }
        if (style.width) {
          style.removeProperty("width");
        }
        if (style.height) {
          style.removeProperty("height");
        }
      }
      static getScrollElement(el) {
        if (!el)
          return document.scrollingElement;
        const style = getComputedStyle(el);
        const overflowRegex = /(auto|scroll)/;
        if (overflowRegex.test(style.overflow + style.overflowY)) {
          return el;
        } else {
          return this.getScrollElement(el.parentElement);
        }
      }
      static updateScrollPosition(el, position, distance) {
        let rect = el.getBoundingClientRect();
        let innerHeightOrClientHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < 0 || rect.bottom > innerHeightOrClientHeight) {
          let offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
          let offsetDiffUp = rect.top;
          let scrollEl = this.getScrollElement(el);
          if (scrollEl !== null) {
            let prevScroll = scrollEl.scrollTop;
            if (rect.top < 0 && distance < 0) {
              if (el.offsetHeight > innerHeightOrClientHeight) {
                scrollEl.scrollTop += distance;
              } else {
                scrollEl.scrollTop += Math.abs(offsetDiffUp) > Math.abs(distance) ? distance : offsetDiffUp;
              }
            } else if (distance > 0) {
              if (el.offsetHeight > innerHeightOrClientHeight) {
                scrollEl.scrollTop += distance;
              } else {
                scrollEl.scrollTop += offsetDiffDown > distance ? distance : offsetDiffDown;
              }
            }
            position.top += scrollEl.scrollTop - prevScroll;
          }
        }
      }
      static updateScrollResize(event, el, distance) {
        const scrollEl = this.getScrollElement(el);
        const height = scrollEl.clientHeight;
        const offsetTop = scrollEl === this.getScrollElement() ? 0 : scrollEl.getBoundingClientRect().top;
        const pointerPosY = event.clientY - offsetTop;
        const top = pointerPosY < distance;
        const bottom = pointerPosY > height - distance;
        if (top) {
          scrollEl.scrollBy({behavior: "smooth", top: pointerPosY - distance});
        } else if (bottom) {
          scrollEl.scrollBy({behavior: "smooth", top: distance - (height - pointerPosY)});
        }
      }
      static clone(obj) {
        if (obj === null || obj === void 0 || typeof obj !== "object") {
          return obj;
        }
        if (obj instanceof Array) {
          return [...obj];
        }
        return Object.assign({}, obj);
      }
      static cloneDeep(obj) {
        const ret = Utils.clone(obj);
        for (const key in ret) {
          if (ret.hasOwnProperty(key) && typeof ret[key] === "object" && key.substring(0, 2) !== "__") {
            ret[key] = Utils.cloneDeep(obj[key]);
          }
        }
        return ret;
      }
    };
    exports.Utils = Utils;
  });

  // node_modules/gridstack/dist/h5/dd-resizable.js
  var require_dd_resizable = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDResizable = void 0;
    var dd_resizable_handle_1 = require_dd_resizable_handle();
    var dd_base_impl_1 = require_dd_base_impl();
    var dd_utils_1 = require_dd_utils();
    var utils_1 = require_utils();
    var DDResizable = class extends dd_base_impl_1.DDBaseImplement {
      constructor(el, opts = {}) {
        super();
        this._showHandlers = () => {
          this.el.classList.remove("ui-resizable-autohide");
        };
        this._hideHandlers = () => {
          this.el.classList.add("ui-resizable-autohide");
        };
        this._ui = () => {
          const containmentEl = this.el.parentElement;
          const containmentRect = containmentEl.getBoundingClientRect();
          const newRect = {
            width: this.originalRect.width,
            height: this.originalRect.height + this.scrolled,
            left: this.originalRect.left,
            top: this.originalRect.top - this.scrolled
          };
          const rect = this.temporalRect || newRect;
          return {
            position: {
              left: rect.left - containmentRect.left,
              top: rect.top - containmentRect.top
            },
            size: {
              width: rect.width,
              height: rect.height
            }
          };
        };
        this.el = el;
        this.option = opts;
        this.enable();
        this._setupAutoHide();
        this._setupHandlers();
      }
      on(event, callback) {
        super.on(event, callback);
      }
      off(event) {
        super.off(event);
      }
      enable() {
        super.enable();
        this.el.classList.add("ui-resizable");
        this.el.classList.remove("ui-resizable-disabled");
      }
      disable() {
        super.disable();
        this.el.classList.add("ui-resizable-disabled");
        this.el.classList.remove("ui-resizable");
      }
      destroy() {
        this._removeHandlers();
        if (this.option.autoHide) {
          this.el.removeEventListener("mouseover", this._showHandlers);
          this.el.removeEventListener("mouseout", this._hideHandlers);
        }
        this.el.classList.remove("ui-resizable");
        delete this.el;
        super.destroy();
      }
      updateOption(opts) {
        let updateHandles = opts.handles && opts.handles !== this.option.handles;
        let updateAutoHide = opts.autoHide && opts.autoHide !== this.option.autoHide;
        Object.keys(opts).forEach((key) => this.option[key] = opts[key]);
        if (updateHandles) {
          this._removeHandlers();
          this._setupHandlers();
        }
        if (updateAutoHide) {
          this._setupAutoHide();
        }
        return this;
      }
      _setupAutoHide() {
        if (this.option.autoHide) {
          this.el.classList.add("ui-resizable-autohide");
          this.el.addEventListener("mouseover", this._showHandlers);
          this.el.addEventListener("mouseout", this._hideHandlers);
        } else {
          this.el.classList.remove("ui-resizable-autohide");
          this.el.removeEventListener("mouseover", this._showHandlers);
          this.el.removeEventListener("mouseout", this._hideHandlers);
        }
        return this;
      }
      _setupHandlers() {
        let handlerDirection = this.option.handles || "e,s,se";
        if (handlerDirection === "all") {
          handlerDirection = "n,e,s,w,se,sw,ne,nw";
        }
        this.handlers = handlerDirection.split(",").map((dir) => dir.trim()).map((dir) => new dd_resizable_handle_1.DDResizableHandle(this.el, dir, {
          start: (event) => {
            this._resizeStart(event);
          },
          stop: (event) => {
            this._resizeStop(event);
          },
          move: (event) => {
            this._resizing(event, dir);
          }
        }));
        return this;
      }
      _resizeStart(event) {
        this.originalRect = this.el.getBoundingClientRect();
        this.scrollEl = utils_1.Utils.getScrollElement(this.el);
        this.scrollY = this.scrollEl.scrollTop;
        this.startEvent = event;
        this._setupHelper();
        this._applyChange();
        const ev = dd_utils_1.DDUtils.initEvent(event, {type: "resizestart", target: this.el});
        if (this.option.start) {
          this.option.start(ev, this._ui());
        }
        this.el.classList.add("ui-resizable-resizing");
        this.triggerEvent("resizestart", ev);
        return this;
      }
      _resizing(event, dir) {
        this.scrolled = this.scrollEl.scrollTop - this.scrollY;
        this.temporalRect = this._getChange(event, dir);
        this._applyChange();
        const ev = dd_utils_1.DDUtils.initEvent(event, {type: "resize", target: this.el});
        if (this.option.resize) {
          this.option.resize(ev, this._ui());
        }
        this.triggerEvent("resize", ev);
        return this;
      }
      _resizeStop(event) {
        const ev = dd_utils_1.DDUtils.initEvent(event, {type: "resizestop", target: this.el});
        if (this.option.stop) {
          this.option.stop(ev);
        }
        this.el.classList.remove("ui-resizable-resizing");
        this.triggerEvent("resizestop", ev);
        this._cleanHelper();
        delete this.startEvent;
        delete this.originalRect;
        delete this.temporalRect;
        delete this.scrollY;
        delete this.scrolled;
        return this;
      }
      _setupHelper() {
        this.elOriginStyleVal = DDResizable._originStyleProp.map((prop) => this.el.style[prop]);
        this.parentOriginStylePosition = this.el.parentElement.style.position;
        if (window.getComputedStyle(this.el.parentElement).position.match(/static/)) {
          this.el.parentElement.style.position = "relative";
        }
        this.el.style.position = this.option.basePosition || "absolute";
        this.el.style.opacity = "0.8";
        this.el.style.zIndex = "1000";
        return this;
      }
      _cleanHelper() {
        DDResizable._originStyleProp.forEach((prop, i) => {
          this.el.style[prop] = this.elOriginStyleVal[i] || null;
        });
        this.el.parentElement.style.position = this.parentOriginStylePosition || null;
        return this;
      }
      _getChange(event, dir) {
        const oEvent = this.startEvent;
        const newRect = {
          width: this.originalRect.width,
          height: this.originalRect.height + this.scrolled,
          left: this.originalRect.left,
          top: this.originalRect.top - this.scrolled
        };
        const offsetX = event.clientX - oEvent.clientX;
        const offsetY = event.clientY - oEvent.clientY;
        if (dir.indexOf("e") > -1) {
          newRect.width += offsetX;
        } else if (dir.indexOf("w") > -1) {
          newRect.width -= offsetX;
          newRect.left += offsetX;
        }
        if (dir.indexOf("s") > -1) {
          newRect.height += offsetY;
        } else if (dir.indexOf("n") > -1) {
          newRect.height -= offsetY;
          newRect.top += offsetY;
        }
        const constrain = this._constrainSize(newRect.width, newRect.height);
        if (Math.round(newRect.width) !== Math.round(constrain.width)) {
          if (dir.indexOf("w") > -1) {
            newRect.left += newRect.width - constrain.width;
          }
          newRect.width = constrain.width;
        }
        if (Math.round(newRect.height) !== Math.round(constrain.height)) {
          if (dir.indexOf("n") > -1) {
            newRect.top += newRect.height - constrain.height;
          }
          newRect.height = constrain.height;
        }
        return newRect;
      }
      _constrainSize(oWidth, oHeight) {
        const maxWidth = this.option.maxWidth || Number.MAX_SAFE_INTEGER;
        const minWidth = this.option.minWidth || oWidth;
        const maxHeight = this.option.maxHeight || Number.MAX_SAFE_INTEGER;
        const minHeight = this.option.minHeight || oHeight;
        const width = Math.min(maxWidth, Math.max(minWidth, oWidth));
        const height = Math.min(maxHeight, Math.max(minHeight, oHeight));
        return {width, height};
      }
      _applyChange() {
        let containmentRect = {left: 0, top: 0, width: 0, height: 0};
        if (this.el.style.position === "absolute") {
          const containmentEl = this.el.parentElement;
          const {left, top} = containmentEl.getBoundingClientRect();
          containmentRect = {left, top, width: 0, height: 0};
        }
        if (!this.temporalRect)
          return this;
        Object.keys(this.temporalRect).forEach((key) => {
          const value = this.temporalRect[key];
          this.el.style[key] = value - containmentRect[key] + "px";
        });
        return this;
      }
      _removeHandlers() {
        this.handlers.forEach((handle) => handle.destroy());
        delete this.handlers;
        return this;
      }
    };
    exports.DDResizable = DDResizable;
    DDResizable._originStyleProp = ["width", "height", "position", "left", "top", "opacity", "zIndex"];
  });

  // node_modules/gridstack/dist/h5/dd-draggable.js
  var require_dd_draggable = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDDraggable = void 0;
    var dd_manager_1 = require_dd_manager();
    var dd_utils_1 = require_dd_utils();
    var dd_base_impl_1 = require_dd_base_impl();
    var DDDraggable = class extends dd_base_impl_1.DDBaseImplement {
      constructor(el, option = {}) {
        super();
        this.dragging = false;
        this.ui = () => {
          const containmentEl = this.el.parentElement;
          const containmentRect = containmentEl.getBoundingClientRect();
          const offset = this.helper.getBoundingClientRect();
          return {
            position: {
              top: offset.top - containmentRect.top,
              left: offset.left - containmentRect.left
            }
          };
        };
        this.el = el;
        this.option = option;
        let className = option.handle.substring(1);
        this.dragEl = el.classList.contains(className) ? el : el.querySelector(option.handle) || el;
        this._dragStart = this._dragStart.bind(this);
        this._drag = this._drag.bind(this);
        this._dragEnd = this._dragEnd.bind(this);
        this.enable();
      }
      on(event, callback) {
        super.on(event, callback);
      }
      off(event) {
        super.off(event);
      }
      enable() {
        super.enable();
        this.dragEl.draggable = true;
        this.dragEl.addEventListener("dragstart", this._dragStart);
        this.el.classList.remove("ui-draggable-disabled");
        this.el.classList.add("ui-draggable");
      }
      disable(forDestroy = false) {
        super.disable();
        this.dragEl.removeAttribute("draggable");
        this.dragEl.removeEventListener("dragstart", this._dragStart);
        this.el.classList.remove("ui-draggable");
        if (!forDestroy)
          this.el.classList.add("ui-draggable-disabled");
      }
      destroy() {
        if (this.dragging) {
          this._dragEnd({});
        }
        this.disable(true);
        delete this.el;
        delete this.helper;
        delete this.option;
        super.destroy();
      }
      updateOption(opts) {
        Object.keys(opts).forEach((key) => this.option[key] = opts[key]);
        return this;
      }
      _dragStart(event) {
        dd_manager_1.DDManager.dragElement = this;
        this.helper = this._createHelper(event);
        this._setupHelperContainmentStyle();
        this.dragOffset = this._getDragOffset(event, this.el, this.helperContainment);
        const ev = dd_utils_1.DDUtils.initEvent(event, {target: this.el, type: "dragstart"});
        if (this.helper !== this.el) {
          this._setupDragFollowNodeNotifyStart(ev);
          this._dragFollow(event);
        } else {
          this.dragFollowTimer = window.setTimeout(() => {
            delete this.dragFollowTimer;
            this._setupDragFollowNodeNotifyStart(ev);
          }, 0);
        }
        this._cancelDragGhost(event);
      }
      _setupDragFollowNodeNotifyStart(ev) {
        this._setupHelperStyle();
        document.addEventListener("dragover", this._drag, DDDraggable.dragEventListenerOption);
        this.dragEl.addEventListener("dragend", this._dragEnd);
        if (this.option.start) {
          this.option.start(ev, this.ui());
        }
        this.dragging = true;
        this.helper.classList.add("ui-draggable-dragging");
        this.triggerEvent("dragstart", ev);
        return this;
      }
      _drag(event) {
        event.preventDefault();
        this._dragFollow(event);
        const ev = dd_utils_1.DDUtils.initEvent(event, {target: this.el, type: "drag"});
        if (this.option.drag) {
          this.option.drag(ev, this.ui());
        }
        this.triggerEvent("drag", ev);
      }
      _dragEnd(event) {
        if (this.dragFollowTimer) {
          clearTimeout(this.dragFollowTimer);
          delete this.dragFollowTimer;
          return;
        } else {
          if (this.paintTimer) {
            cancelAnimationFrame(this.paintTimer);
          }
          document.removeEventListener("dragover", this._drag, DDDraggable.dragEventListenerOption);
          this.dragEl.removeEventListener("dragend", this._dragEnd);
        }
        this.dragging = false;
        this.helper.classList.remove("ui-draggable-dragging");
        this.helperContainment.style.position = this.parentOriginStylePosition || null;
        if (this.helper === this.el) {
          this._removeHelperStyle();
        } else {
          this.helper.remove();
        }
        const ev = dd_utils_1.DDUtils.initEvent(event, {target: this.el, type: "dragstop"});
        if (this.option.stop) {
          this.option.stop(ev);
        }
        this.triggerEvent("dragstop", ev);
        delete dd_manager_1.DDManager.dragElement;
        delete this.helper;
      }
      _createHelper(event) {
        let helper = this.el;
        if (typeof this.option.helper === "function") {
          helper = this.option.helper(event);
        } else if (this.option.helper === "clone") {
          helper = dd_utils_1.DDUtils.clone(this.el);
        }
        if (!document.body.contains(helper)) {
          dd_utils_1.DDUtils.appendTo(helper, this.option.appendTo === "parent" ? this.el.parentNode : this.option.appendTo);
        }
        if (helper === this.el) {
          this.dragElementOriginStyle = DDDraggable.originStyleProp.map((prop) => this.el.style[prop]);
        }
        return helper;
      }
      _setupHelperStyle() {
        this.helper.style.pointerEvents = "none";
        this.helper.style.width = this.dragOffset.width + "px";
        this.helper.style.height = this.dragOffset.height + "px";
        this.helper.style.willChange = "left, top";
        this.helper.style.transition = "none";
        this.helper.style.position = this.option.basePosition || DDDraggable.basePosition;
        this.helper.style.zIndex = "1000";
        setTimeout(() => {
          if (this.helper) {
            this.helper.style.transition = null;
          }
        }, 0);
        return this;
      }
      _removeHelperStyle() {
        let node = this.helper ? this.helper.gridstackNode : void 0;
        if (!node || !node._isAboutToRemove) {
          DDDraggable.originStyleProp.forEach((prop) => {
            this.helper.style[prop] = this.dragElementOriginStyle[prop] || null;
          });
        }
        delete this.dragElementOriginStyle;
        return this;
      }
      _dragFollow(event) {
        if (this.paintTimer) {
          cancelAnimationFrame(this.paintTimer);
        }
        this.paintTimer = requestAnimationFrame(() => {
          delete this.paintTimer;
          const offset = this.dragOffset;
          let containmentRect = {left: 0, top: 0};
          if (this.helper.style.position === "absolute") {
            const {left, top} = this.helperContainment.getBoundingClientRect();
            containmentRect = {left, top};
          }
          this.helper.style.left = event.clientX + offset.offsetLeft - containmentRect.left + "px";
          this.helper.style.top = event.clientY + offset.offsetTop - containmentRect.top + "px";
        });
      }
      _setupHelperContainmentStyle() {
        this.helperContainment = this.helper.parentElement;
        if (this.option.basePosition !== "fixed") {
          this.parentOriginStylePosition = this.helperContainment.style.position;
          if (window.getComputedStyle(this.helperContainment).position.match(/static/)) {
            this.helperContainment.style.position = "relative";
          }
        }
        return this;
      }
      _cancelDragGhost(e) {
        let img = document.createElement("div");
        img.style.width = "1px";
        img.style.height = "1px";
        img.style.position = "fixed";
        document.body.appendChild(img);
        e.dataTransfer.setDragImage(img, 0, 0);
        setTimeout(() => document.body.removeChild(img));
        e.stopPropagation();
        return this;
      }
      _getDragOffset(event, el, parent) {
        let xformOffsetX = 0;
        let xformOffsetY = 0;
        if (parent) {
          const testEl = document.createElement("div");
          dd_utils_1.DDUtils.addElStyles(testEl, {
            opacity: "0",
            position: "fixed",
            top: 0 + "px",
            left: 0 + "px",
            width: "1px",
            height: "1px",
            zIndex: "-999999"
          });
          parent.appendChild(testEl);
          const testElPosition = testEl.getBoundingClientRect();
          parent.removeChild(testEl);
          xformOffsetX = testElPosition.left;
          xformOffsetY = testElPosition.top;
        }
        const targetOffset = el.getBoundingClientRect();
        return {
          left: targetOffset.left,
          top: targetOffset.top,
          offsetLeft: -event.clientX + targetOffset.left - xformOffsetX,
          offsetTop: -event.clientY + targetOffset.top - xformOffsetY,
          width: targetOffset.width,
          height: targetOffset.height
        };
      }
    };
    exports.DDDraggable = DDDraggable;
    DDDraggable.basePosition = "absolute";
    DDDraggable.dragEventListenerOption = true;
    DDDraggable.originStyleProp = [
      "transition",
      "pointerEvents",
      "position",
      "left",
      "top",
      "opacity",
      "zIndex",
      "width",
      "height",
      "willChange"
    ];
  });

  // node_modules/gridstack/dist/h5/dd-droppable.js
  var require_dd_droppable = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDDroppable = void 0;
    var dd_manager_1 = require_dd_manager();
    var dd_base_impl_1 = require_dd_base_impl();
    var dd_utils_1 = require_dd_utils();
    var DDDroppable = class extends dd_base_impl_1.DDBaseImplement {
      constructor(el, opts = {}) {
        super();
        this.el = el;
        this.option = opts;
        this._dragEnter = this._dragEnter.bind(this);
        this._dragOver = this._dragOver.bind(this);
        this._dragLeave = this._dragLeave.bind(this);
        this._drop = this._drop.bind(this);
        this.el.classList.add("ui-droppable");
        this.el.addEventListener("dragenter", this._dragEnter);
        this._setupAccept();
      }
      on(event, callback) {
        super.on(event, callback);
      }
      off(event) {
        super.off(event);
      }
      enable() {
        if (!this.disabled)
          return;
        super.enable();
        this.el.classList.remove("ui-droppable-disabled");
        this.el.addEventListener("dragenter", this._dragEnter);
      }
      disable(forDestroy = false) {
        if (this.disabled)
          return;
        super.disable();
        if (!forDestroy)
          this.el.classList.add("ui-droppable-disabled");
        this.el.removeEventListener("dragenter", this._dragEnter);
      }
      destroy() {
        if (this.moving) {
          this._removeLeaveCallbacks();
        }
        this.disable(true);
        this.el.classList.remove("ui-droppable");
        this.el.classList.remove("ui-droppable-disabled");
        delete this.moving;
        super.destroy();
      }
      updateOption(opts) {
        Object.keys(opts).forEach((key) => this.option[key] = opts[key]);
        this._setupAccept();
        return this;
      }
      _dragEnter(event) {
        if (!this._canDrop())
          return;
        event.preventDefault();
        if (this.moving)
          return;
        this.moving = true;
        const ev = dd_utils_1.DDUtils.initEvent(event, {target: this.el, type: "dropover"});
        if (this.option.over) {
          this.option.over(ev, this._ui(dd_manager_1.DDManager.dragElement));
        }
        this.triggerEvent("dropover", ev);
        this.el.addEventListener("dragover", this._dragOver);
        this.el.addEventListener("drop", this._drop);
        this.el.addEventListener("dragleave", this._dragLeave);
        this.el.classList.add("ui-droppable-over");
      }
      _dragOver(event) {
        event.preventDefault();
        event.stopPropagation();
      }
      _dragLeave(event) {
        if (!event.relatedTarget) {
          const {bottom, left, right, top} = this.el.getBoundingClientRect();
          if (event.x < right && event.x > left && event.y < bottom && event.y > top)
            return;
        } else if (this.el.contains(event.relatedTarget))
          return;
        this._removeLeaveCallbacks();
        if (this.moving) {
          event.preventDefault();
          const ev = dd_utils_1.DDUtils.initEvent(event, {target: this.el, type: "dropout"});
          if (this.option.out) {
            this.option.out(ev, this._ui(dd_manager_1.DDManager.dragElement));
          }
          this.triggerEvent("dropout", ev);
        }
        delete this.moving;
      }
      _drop(event) {
        if (!this.moving)
          return;
        event.preventDefault();
        const ev = dd_utils_1.DDUtils.initEvent(event, {target: this.el, type: "drop"});
        if (this.option.drop) {
          this.option.drop(ev, this._ui(dd_manager_1.DDManager.dragElement));
        }
        this.triggerEvent("drop", ev);
        this._removeLeaveCallbacks();
        delete this.moving;
      }
      _removeLeaveCallbacks() {
        this.el.removeEventListener("dragleave", this._dragLeave);
        this.el.classList.remove("ui-droppable-over");
        if (this.moving) {
          this.el.removeEventListener("dragover", this._dragOver);
          this.el.removeEventListener("drop", this._drop);
        }
      }
      _canDrop() {
        return dd_manager_1.DDManager.dragElement && (!this.accept || this.accept(dd_manager_1.DDManager.dragElement.el));
      }
      _setupAccept() {
        if (this.option.accept && typeof this.option.accept === "string") {
          this.accept = (el) => {
            return el.matches(this.option.accept);
          };
        } else {
          this.accept = this.option.accept;
        }
        return this;
      }
      _ui(drag) {
        return Object.assign({draggable: drag.el}, drag.ui());
      }
    };
    exports.DDDroppable = DDDroppable;
  });

  // node_modules/gridstack/dist/h5/dd-element.js
  var require_dd_element = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.DDElement = void 0;
    var dd_resizable_1 = require_dd_resizable();
    var dd_draggable_1 = require_dd_draggable();
    var dd_droppable_1 = require_dd_droppable();
    var DDElement = class {
      constructor(el) {
        this.el = el;
      }
      static init(el) {
        if (!el.ddElement) {
          el.ddElement = new DDElement(el);
        }
        return el.ddElement;
      }
      on(eventName, callback) {
        if (this.ddDraggable && ["drag", "dragstart", "dragstop"].indexOf(eventName) > -1) {
          this.ddDraggable.on(eventName, callback);
        } else if (this.ddDroppable && ["drop", "dropover", "dropout"].indexOf(eventName) > -1) {
          this.ddDroppable.on(eventName, callback);
        } else if (this.ddResizable && ["resizestart", "resize", "resizestop"].indexOf(eventName) > -1) {
          this.ddResizable.on(eventName, callback);
        }
        return this;
      }
      off(eventName) {
        if (this.ddDraggable && ["drag", "dragstart", "dragstop"].indexOf(eventName) > -1) {
          this.ddDraggable.off(eventName);
        } else if (this.ddDroppable && ["drop", "dropover", "dropout"].indexOf(eventName) > -1) {
          this.ddDroppable.off(eventName);
        } else if (this.ddResizable && ["resizestart", "resize", "resizestop"].indexOf(eventName) > -1) {
          this.ddResizable.off(eventName);
        }
        return this;
      }
      setupDraggable(opts) {
        if (!this.ddDraggable) {
          this.ddDraggable = new dd_draggable_1.DDDraggable(this.el, opts);
        } else {
          this.ddDraggable.updateOption(opts);
        }
        return this;
      }
      cleanDraggable() {
        if (this.ddDraggable) {
          this.ddDraggable.destroy();
          delete this.ddDraggable;
        }
        return this;
      }
      setupResizable(opts) {
        if (!this.ddResizable) {
          this.ddResizable = new dd_resizable_1.DDResizable(this.el, opts);
        } else {
          this.ddResizable.updateOption(opts);
        }
        return this;
      }
      cleanResizable() {
        if (this.ddResizable) {
          this.ddResizable.destroy();
          delete this.ddResizable;
        }
        return this;
      }
      setupDroppable(opts) {
        if (!this.ddDroppable) {
          this.ddDroppable = new dd_droppable_1.DDDroppable(this.el, opts);
        } else {
          this.ddDroppable.updateOption(opts);
        }
        return this;
      }
      cleanDroppable() {
        if (this.ddDroppable) {
          this.ddDroppable.destroy();
          delete this.ddDroppable;
        }
        return this;
      }
    };
    exports.DDElement = DDElement;
  });

  // node_modules/gridstack/dist/gridstack-ddi.js
  var require_gridstack_ddi = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.GridStackDDI = void 0;
    var GridStackDDI = class {
      static registerPlugin(pluginClass) {
        GridStackDDI.ddi = new pluginClass();
        return GridStackDDI.ddi;
      }
      static get() {
        return GridStackDDI.ddi || GridStackDDI.registerPlugin(GridStackDDI);
      }
      remove(el) {
        return this;
      }
    };
    exports.GridStackDDI = GridStackDDI;
  });

  // node_modules/gridstack/dist/gridstack-engine.js
  var require_gridstack_engine = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.GridStackEngine = void 0;
    var utils_1 = require_utils();
    var GridStackEngine = class {
      constructor(opts = {}) {
        this.addedNodes = [];
        this.removedNodes = [];
        this.column = opts.column || 12;
        this.onChange = opts.onChange;
        this._float = opts.float;
        this.maxRow = opts.maxRow;
        this.nodes = opts.nodes || [];
      }
      batchUpdate() {
        if (this.batchMode)
          return this;
        this.batchMode = true;
        this._prevFloat = this._float;
        this._float = true;
        this.saveInitial();
        return this;
      }
      commit() {
        if (!this.batchMode)
          return this;
        this.batchMode = false;
        this._float = this._prevFloat;
        delete this._prevFloat;
        return this._packNodes()._notify();
      }
      _useEntireRowArea(node, nn) {
        return !this.float && !this._hasLocked && (!node._moving || node._skipDown || nn.y <= node.y);
      }
      _fixCollisions(node, nn = node, collide, opt = {}) {
        this._sortNodes(-1);
        collide = collide || this.collide(node, nn);
        if (!collide)
          return false;
        if (node._moving && !opt.nested && !this.float) {
          if (this.swap(node, collide))
            return true;
        }
        let area = nn;
        if (this._useEntireRowArea(node, nn)) {
          area = {x: 0, w: this.column, y: nn.y, h: nn.h};
          collide = this.collide(node, area, opt.skip);
        }
        let didMove = false;
        let newOpt = {nested: true, pack: false};
        while (collide = collide || this.collide(node, area, opt.skip)) {
          let moved;
          if (collide.locked || node._moving && !node._skipDown && nn.y > node.y && !this.float && (!this.collide(collide, Object.assign(Object.assign({}, collide), {y: node.y}), node) || !this.collide(collide, Object.assign(Object.assign({}, collide), {y: nn.y - collide.h}), node))) {
            node._skipDown = node._skipDown || nn.y > node.y;
            moved = this.moveNode(node, Object.assign(Object.assign(Object.assign({}, nn), {y: collide.y + collide.h}), newOpt));
            if (collide.locked && moved) {
              utils_1.Utils.copyPos(nn, node);
            } else if (!collide.locked && moved && opt.pack) {
              this._packNodes();
              nn.y = collide.y + collide.h;
              utils_1.Utils.copyPos(node, nn);
            }
            didMove = didMove || moved;
          } else {
            moved = this.moveNode(collide, Object.assign(Object.assign(Object.assign({}, collide), {y: nn.y + nn.h, skip: node}), newOpt));
          }
          if (!moved) {
            return didMove;
          }
          collide = void 0;
        }
        return didMove;
      }
      collide(skip, area = skip, skip2) {
        return this.nodes.find((n) => n !== skip && n !== skip2 && utils_1.Utils.isIntercepted(n, area));
      }
      collideAll(skip, area = skip, skip2) {
        return this.nodes.filter((n) => n !== skip && n !== skip2 && utils_1.Utils.isIntercepted(n, area));
      }
      collideCoverage(node, o, collides) {
        if (!o.rect || !node._rect)
          return;
        let r0 = node._rect;
        let r = Object.assign({}, o.rect);
        if (r.y > r0.y) {
          r.h += r.y - r0.y;
          r.y = r0.y;
        } else {
          r.h += r0.y - r.y;
        }
        if (r.x > r0.x) {
          r.w += r.x - r0.x;
          r.x = r0.x;
        } else {
          r.w += r0.x - r.x;
        }
        let collide;
        collides.forEach((n) => {
          if (n.locked || !n._rect)
            return;
          let r2 = n._rect;
          let yOver = Number.MAX_VALUE, xOver = Number.MAX_VALUE, overMax = 0.5;
          if (r0.y < r2.y) {
            yOver = (r.y + r.h - r2.y) / r2.h;
          } else if (r0.y + r0.h > r2.y + r2.h) {
            yOver = (r2.y + r2.h - r.y) / r2.h;
          }
          if (r0.x < r2.x) {
            xOver = (r.x + r.w - r2.x) / r2.w;
          } else if (r0.x + r0.w > r2.x + r2.w) {
            xOver = (r2.x + r2.w - r.x) / r2.w;
          }
          let over = Math.min(xOver, yOver);
          if (over > overMax) {
            overMax = over;
            collide = n;
          }
        });
        return collide;
      }
      cacheRects(w, h, top, right, bottom, left) {
        this.nodes.forEach((n) => n._rect = {
          y: n.y * h + top,
          x: n.x * w + left,
          w: n.w * w - left - right,
          h: n.h * h - top - bottom
        });
        return this;
      }
      swap(a, b) {
        if (!b || b.locked || !a || a.locked)
          return false;
        function _doSwap() {
          let x = b.x, y = b.y;
          b.x = a.x;
          b.y = a.y;
          if (a.h != b.h) {
            a.x = x;
            a.y = b.y + b.h;
          } else {
            a.x = x;
            a.y = y;
          }
          a._dirty = b._dirty = true;
          return true;
        }
        let touching;
        if (a.w === b.w && a.h === b.h && (a.x === b.x || a.y === b.y) && (touching = utils_1.Utils.isTouching(a, b)))
          return _doSwap();
        if (touching === false)
          return;
        if (a.w === b.w && a.x === b.x && (touching || utils_1.Utils.isTouching(a, b))) {
          if (b.y < a.y) {
            let t = a;
            a = b;
            b = t;
          }
          return _doSwap();
        }
        return false;
      }
      isAreaEmpty(x, y, w, h) {
        let nn = {x: x || 0, y: y || 0, w: w || 1, h: h || 1};
        return !this.collide(nn);
      }
      compact() {
        if (this.nodes.length === 0)
          return this;
        this.batchUpdate()._sortNodes();
        let copyNodes = this.nodes;
        this.nodes = [];
        copyNodes.forEach((node) => {
          if (!node.locked) {
            node.autoPosition = true;
          }
          this.addNode(node, false);
          node._dirty = true;
        });
        return this.commit();
      }
      set float(val) {
        if (this._float === val)
          return;
        this._float = val || false;
        if (!val) {
          this._packNodes()._notify();
        }
      }
      get float() {
        return this._float || false;
      }
      _sortNodes(dir) {
        this.nodes = utils_1.Utils.sort(this.nodes, dir, this.column);
        return this;
      }
      _packNodes() {
        this._sortNodes();
        if (this.float) {
          this.nodes.forEach((n) => {
            if (n._updating || n._orig === void 0 || n.y === n._orig.y)
              return;
            let newY = n.y;
            while (newY > n._orig.y) {
              --newY;
              let collide = this.collide(n, {x: n.x, y: newY, w: n.w, h: n.h});
              if (!collide) {
                n._dirty = true;
                n.y = newY;
              }
            }
          });
        } else {
          this.nodes.forEach((n, i) => {
            if (n.locked)
              return;
            while (n.y > 0) {
              let newY = i === 0 ? 0 : n.y - 1;
              let canBeMoved = i === 0 || !this.collide(n, {x: n.x, y: newY, w: n.w, h: n.h});
              if (!canBeMoved)
                break;
              n._dirty = n.y !== newY;
              n.y = newY;
            }
          });
        }
        return this;
      }
      prepareNode(node, resizing) {
        node = node || {};
        node._id = node._id || GridStackEngine._idSeq++;
        if (node.x === void 0 || node.y === void 0 || node.x === null || node.y === null) {
          node.autoPosition = true;
        }
        let defaults = {x: 0, y: 0, w: 1, h: 1};
        utils_1.Utils.defaults(node, defaults);
        if (!node.autoPosition) {
          delete node.autoPosition;
        }
        if (!node.noResize) {
          delete node.noResize;
        }
        if (!node.noMove) {
          delete node.noMove;
        }
        if (typeof node.x == "string") {
          node.x = Number(node.x);
        }
        if (typeof node.y == "string") {
          node.y = Number(node.y);
        }
        if (typeof node.w == "string") {
          node.w = Number(node.w);
        }
        if (typeof node.h == "string") {
          node.h = Number(node.h);
        }
        if (isNaN(node.x)) {
          node.x = defaults.x;
          node.autoPosition = true;
        }
        if (isNaN(node.y)) {
          node.y = defaults.y;
          node.autoPosition = true;
        }
        if (isNaN(node.w)) {
          node.w = defaults.w;
        }
        if (isNaN(node.h)) {
          node.h = defaults.h;
        }
        return this.nodeBoundFix(node, resizing);
      }
      nodeBoundFix(node, resizing) {
        if (node.maxW) {
          node.w = Math.min(node.w, node.maxW);
        }
        if (node.maxH) {
          node.h = Math.min(node.h, node.maxH);
        }
        if (node.minW) {
          node.w = Math.max(node.w, node.minW);
        }
        if (node.minH) {
          node.h = Math.max(node.h, node.minH);
        }
        if (node.w > this.column) {
          if (this.column < 12) {
            node.w = Math.min(12, node.w);
            this.cacheOneLayout(node, 12);
          }
          node.w = this.column;
        } else if (node.w < 1) {
          node.w = 1;
        }
        if (this.maxRow && node.h > this.maxRow) {
          node.h = this.maxRow;
        } else if (node.h < 1) {
          node.h = 1;
        }
        if (node.x < 0) {
          node.x = 0;
        }
        if (node.y < 0) {
          node.y = 0;
        }
        if (node.x + node.w > this.column) {
          if (resizing) {
            node.w = this.column - node.x;
          } else {
            node.x = this.column - node.w;
          }
        }
        if (this.maxRow && node.y + node.h > this.maxRow) {
          if (resizing) {
            node.h = this.maxRow - node.y;
          } else {
            node.y = this.maxRow - node.h;
          }
        }
        return node;
      }
      getDirtyNodes(verify) {
        if (verify) {
          return this.nodes.filter((n) => n._dirty && !utils_1.Utils.samePos(n, n._orig));
        }
        return this.nodes.filter((n) => n._dirty);
      }
      _notify(nodes, removeDOM = true) {
        if (this.batchMode)
          return this;
        nodes = nodes === void 0 ? [] : Array.isArray(nodes) ? nodes : [nodes];
        let dirtyNodes = nodes.concat(this.getDirtyNodes());
        this.onChange && this.onChange(dirtyNodes, removeDOM);
        return this;
      }
      cleanNodes() {
        if (this.batchMode)
          return this;
        this.nodes.forEach((n) => {
          delete n._dirty;
          delete n._lastTried;
        });
        return this;
      }
      saveInitial() {
        this.nodes.forEach((n) => {
          n._orig = utils_1.Utils.copyPos({}, n);
          delete n._dirty;
        });
        this._hasLocked = this.nodes.some((n) => n.locked);
        return this;
      }
      restoreInitial() {
        this.nodes.forEach((n) => {
          if (utils_1.Utils.samePos(n, n._orig))
            return;
          utils_1.Utils.copyPos(n, n._orig);
          n._dirty = true;
        });
        this._notify();
        return this;
      }
      addNode(node, triggerAddEvent = false) {
        let dup;
        if (dup = this.nodes.find((n) => n._id === node._id))
          return dup;
        node = this.prepareNode(node);
        delete node._temporaryRemoved;
        delete node._removeDOM;
        if (node.autoPosition) {
          this._sortNodes();
          for (let i = 0; ; ++i) {
            let x = i % this.column;
            let y = Math.floor(i / this.column);
            if (x + node.w > this.column) {
              continue;
            }
            let box = {x, y, w: node.w, h: node.h};
            if (!this.nodes.find((n) => utils_1.Utils.isIntercepted(box, n))) {
              node.x = x;
              node.y = y;
              delete node.autoPosition;
              break;
            }
          }
        }
        this.nodes.push(node);
        triggerAddEvent && this.addedNodes.push(node);
        this._fixCollisions(node);
        this._packNodes()._notify();
        return node;
      }
      removeNode(node, removeDOM = true, triggerEvent = false) {
        if (!this.nodes.find((n) => n === node)) {
          return this;
        }
        if (triggerEvent) {
          this.removedNodes.push(node);
        }
        if (removeDOM)
          node._removeDOM = true;
        this.nodes = this.nodes.filter((n) => n !== node);
        return this._packNodes()._notify(node);
      }
      removeAll(removeDOM = true) {
        delete this._layouts;
        if (this.nodes.length === 0)
          return this;
        removeDOM && this.nodes.forEach((n) => n._removeDOM = true);
        this.removedNodes = this.nodes;
        this.nodes = [];
        return this._notify(this.removedNodes);
      }
      moveNodeCheck(node, o) {
        if (!this.changedPosConstrain(node, o))
          return false;
        o.pack = true;
        if (!this.maxRow) {
          return this.moveNode(node, o);
        }
        let clonedNode;
        let clone = new GridStackEngine({
          column: this.column,
          float: this.float,
          nodes: this.nodes.map((n) => {
            if (n === node) {
              clonedNode = Object.assign({}, n);
              return clonedNode;
            }
            return Object.assign({}, n);
          })
        });
        if (!clonedNode)
          return false;
        let canMove = clone.moveNode(clonedNode, o);
        if (this.maxRow && canMove) {
          canMove = clone.getRow() <= this.maxRow;
          if (!canMove) {
            let collide = this.collide(node, o);
            if (collide && this.swap(node, collide)) {
              this._notify();
              return true;
            }
          }
        }
        if (!canMove)
          return false;
        clone.nodes.filter((n) => n._dirty).forEach((c) => {
          let n = this.nodes.find((a) => a._id === c._id);
          if (!n)
            return;
          utils_1.Utils.copyPos(n, c);
          n._dirty = true;
        });
        this._notify();
        return true;
      }
      willItFit(node) {
        delete node._willFitPos;
        if (!this.maxRow)
          return true;
        let clone = new GridStackEngine({
          column: this.column,
          float: this.float,
          nodes: this.nodes.map((n2) => {
            return Object.assign({}, n2);
          })
        });
        let n = Object.assign({}, node);
        this.cleanupNode(n);
        delete n.el;
        delete n._id;
        delete n.content;
        delete n.grid;
        clone.addNode(n);
        if (clone.getRow() <= this.maxRow) {
          node._willFitPos = utils_1.Utils.copyPos({}, n);
          return true;
        }
        return false;
      }
      changedPosConstrain(node, p) {
        p.w = p.w || node.w;
        p.h = p.h || node.h;
        if (node.x !== p.x || node.y !== p.y)
          return true;
        if (node.maxW) {
          p.w = Math.min(p.w, node.maxW);
        }
        if (node.maxH) {
          p.h = Math.min(p.h, node.maxH);
        }
        if (node.minW) {
          p.w = Math.max(p.w, node.minW);
        }
        if (node.minH) {
          p.h = Math.max(p.h, node.minH);
        }
        return node.w !== p.w || node.h !== p.h;
      }
      moveNode(node, o) {
        if (!node || !o)
          return false;
        if (o.pack === void 0)
          o.pack = true;
        if (typeof o.x !== "number") {
          o.x = node.x;
        }
        if (typeof o.y !== "number") {
          o.y = node.y;
        }
        if (typeof o.w !== "number") {
          o.w = node.w;
        }
        if (typeof o.h !== "number") {
          o.h = node.h;
        }
        let resizing = node.w !== o.w || node.h !== o.h;
        let nn = utils_1.Utils.copyPos({}, node, true);
        utils_1.Utils.copyPos(nn, o);
        nn = this.nodeBoundFix(nn, resizing);
        utils_1.Utils.copyPos(o, nn);
        if (utils_1.Utils.samePos(node, o))
          return false;
        let prevPos = utils_1.Utils.copyPos({}, node);
        let area = nn;
        let collides = this.collideAll(node, area, o.skip);
        let needToMove = true;
        if (collides.length) {
          let collide = node._moving && !o.nested ? this.collideCoverage(node, o, collides) : collides[0];
          if (collide) {
            needToMove = !this._fixCollisions(node, nn, collide, o);
          } else {
            needToMove = false;
          }
        }
        if (needToMove) {
          node._dirty = true;
          utils_1.Utils.copyPos(node, nn);
        }
        if (o.pack) {
          this._packNodes()._notify();
        }
        return !utils_1.Utils.samePos(node, prevPos);
      }
      getRow() {
        return this.nodes.reduce((row, n) => Math.max(row, n.y + n.h), 0);
      }
      beginUpdate(node) {
        if (!node._updating) {
          node._updating = true;
          delete node._skipDown;
          if (!this.batchMode)
            this.saveInitial();
        }
        return this;
      }
      endUpdate() {
        let n = this.nodes.find((n2) => n2._updating);
        if (n) {
          delete n._updating;
          delete n._skipDown;
        }
        return this;
      }
      save(saveElement = true) {
        let list = [];
        this._sortNodes();
        this.nodes.forEach((n) => {
          let w = {};
          for (let key in n) {
            if (key[0] !== "_" && n[key] !== null && n[key] !== void 0)
              w[key] = n[key];
          }
          delete w.grid;
          if (!saveElement)
            delete w.el;
          if (!w.autoPosition)
            delete w.autoPosition;
          if (!w.noResize)
            delete w.noResize;
          if (!w.noMove)
            delete w.noMove;
          if (!w.locked)
            delete w.locked;
          list.push(w);
        });
        return list;
      }
      layoutsNodesChange(nodes) {
        if (!this._layouts || this._ignoreLayoutsNodeChange)
          return this;
        this._layouts.forEach((layout, column) => {
          if (!layout || column === this.column)
            return this;
          if (column < this.column) {
            this._layouts[column] = void 0;
          } else {
            nodes.forEach((node) => {
              if (!node._orig)
                return;
              let n = layout.find((l) => l._id === node._id);
              if (!n)
                return;
              let ratio = column / this.column;
              if (node.y !== node._orig.y) {
                n.y += node.y - node._orig.y;
              }
              if (node.x !== node._orig.x) {
                n.x = Math.round(node.x * ratio);
              }
              if (node.w !== node._orig.w) {
                n.w = Math.round(node.w * ratio);
              }
            });
          }
        });
        return this;
      }
      updateNodeWidths(oldColumn, column, nodes, layout = "moveScale") {
        if (!this.nodes.length || oldColumn === column)
          return this;
        this.cacheLayout(this.nodes, oldColumn);
        if (column === 1 && nodes && nodes.length) {
          let top = 0;
          nodes.forEach((n) => {
            n.x = 0;
            n.w = 1;
            n.y = Math.max(n.y, top);
            top = n.y + n.h;
          });
        } else {
          nodes = utils_1.Utils.sort(this.nodes, -1, oldColumn);
        }
        let cacheNodes = this._layouts[column] || [];
        let lastIndex = this._layouts.length - 1;
        if (cacheNodes.length === 0 && column > oldColumn && column < lastIndex) {
          cacheNodes = this._layouts[lastIndex] || [];
          if (cacheNodes.length) {
            oldColumn = lastIndex;
            cacheNodes.forEach((cacheNode) => {
              let j = nodes.findIndex((n) => n._id === cacheNode._id);
              if (j !== -1) {
                nodes[j].x = cacheNode.x;
                nodes[j].y = cacheNode.y;
                nodes[j].w = cacheNode.w;
              }
            });
            cacheNodes = [];
          }
        }
        let newNodes = [];
        cacheNodes.forEach((cacheNode) => {
          let j = nodes.findIndex((n) => n._id === cacheNode._id);
          if (j !== -1) {
            nodes[j].x = cacheNode.x;
            nodes[j].y = cacheNode.y;
            nodes[j].w = cacheNode.w;
            newNodes.push(nodes[j]);
            nodes.splice(j, 1);
          }
        });
        if (nodes.length) {
          if (typeof layout === "function") {
            layout(column, oldColumn, newNodes, nodes);
          } else {
            let ratio = column / oldColumn;
            let move = layout === "move" || layout === "moveScale";
            let scale = layout === "scale" || layout === "moveScale";
            nodes.forEach((node) => {
              node.x = column === 1 ? 0 : move ? Math.round(node.x * ratio) : Math.min(node.x, column - 1);
              node.w = column === 1 || oldColumn === 1 ? 1 : scale ? Math.round(node.w * ratio) || 1 : Math.min(node.w, column);
              newNodes.push(node);
            });
            nodes = [];
          }
        }
        newNodes = utils_1.Utils.sort(newNodes, -1, column);
        this._ignoreLayoutsNodeChange = true;
        this.batchUpdate();
        this.nodes = [];
        newNodes.forEach((node) => {
          this.addNode(node, false);
          node._dirty = true;
        }, this);
        this.commit();
        delete this._ignoreLayoutsNodeChange;
        return this;
      }
      cacheLayout(nodes, column, clear = false) {
        let copy = [];
        nodes.forEach((n, i) => {
          n._id = n._id || GridStackEngine._idSeq++;
          copy[i] = {x: n.x, y: n.y, w: n.w, _id: n._id};
        });
        this._layouts = clear ? [] : this._layouts || [];
        this._layouts[column] = copy;
        return this;
      }
      cacheOneLayout(n, column) {
        n._id = n._id || GridStackEngine._idSeq++;
        let layout = {x: n.x, y: n.y, w: n.w, _id: n._id};
        this._layouts = this._layouts || [];
        this._layouts[column] = this._layouts[column] || [];
        let index = this._layouts[column].findIndex((l) => l._id === n._id);
        index === -1 ? this._layouts[column].push(layout) : this._layouts[column][index] = layout;
        return this;
      }
      cleanupNode(node) {
        for (let prop in node) {
          if (prop[0] === "_" && prop !== "_id")
            delete node[prop];
        }
        return this;
      }
    };
    exports.GridStackEngine = GridStackEngine;
    GridStackEngine._idSeq = 1;
  });

  // node_modules/gridstack/dist/types.js
  var require_types = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
  });

  // node_modules/gridstack/dist/gridstack.js
  var require_gridstack = __commonJS((exports) => {
    "use strict";
    /*!
     * GridStack 4.2.6
     * https://gridstackjs.com/
     *
     * Copyright (c) 2021 Alain Dumesny
     * see root license https://github.com/gridstack/gridstack.js/tree/master/LICENSE
     */
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !exports2.hasOwnProperty(p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.GridStack = void 0;
    var gridstack_engine_1 = require_gridstack_engine();
    var utils_1 = require_utils();
    var gridstack_ddi_1 = require_gridstack_ddi();
    __exportStar2(require_types(), exports);
    __exportStar2(require_utils(), exports);
    __exportStar2(require_gridstack_engine(), exports);
    __exportStar2(require_gridstack_ddi(), exports);
    var GridDefaults = {
      column: 12,
      minRow: 0,
      maxRow: 0,
      itemClass: "grid-stack-item",
      placeholderClass: "grid-stack-placeholder",
      placeholderText: "",
      handle: ".grid-stack-item-content",
      handleClass: null,
      styleInHead: false,
      cellHeight: "auto",
      cellHeightThrottle: 100,
      margin: 10,
      auto: true,
      minWidth: 768,
      float: false,
      staticGrid: false,
      animate: true,
      alwaysShowResizeHandle: false,
      resizable: {
        autoHide: true,
        handles: "se"
      },
      draggable: {
        handle: ".grid-stack-item-content",
        scroll: false,
        appendTo: "body"
      },
      disableDrag: false,
      disableResize: false,
      rtl: "auto",
      removable: false,
      removableOptions: {
        accept: ".grid-stack-item"
      },
      marginUnit: "px",
      cellHeightUnit: "px",
      disableOneColumnMode: false,
      oneColumnModeDomSort: false
    };
    var GridStack2 = class {
      constructor(el, opts = {}) {
        this._gsEventHandler = {};
        this._extraDragRow = 0;
        this.el = el;
        opts = opts || {};
        if (opts.row) {
          opts.minRow = opts.maxRow = opts.row;
          delete opts.row;
        }
        let rowAttr = utils_1.Utils.toNumber(el.getAttribute("gs-row"));
        let defaults = Object.assign(Object.assign({}, utils_1.Utils.cloneDeep(GridDefaults)), {column: utils_1.Utils.toNumber(el.getAttribute("gs-column")) || 12, minRow: rowAttr ? rowAttr : utils_1.Utils.toNumber(el.getAttribute("gs-min-row")) || 0, maxRow: rowAttr ? rowAttr : utils_1.Utils.toNumber(el.getAttribute("gs-max-row")) || 0, staticGrid: utils_1.Utils.toBool(el.getAttribute("gs-static")) || false, _styleSheetClass: "grid-stack-instance-" + (Math.random() * 1e4).toFixed(0), alwaysShowResizeHandle: opts.alwaysShowResizeHandle || false, resizable: {
          autoHide: !(opts.alwaysShowResizeHandle || false),
          handles: "se"
        }, draggable: {
          handle: (opts.handleClass ? "." + opts.handleClass : opts.handle ? opts.handle : "") || ".grid-stack-item-content",
          scroll: false,
          appendTo: "body"
        }, removableOptions: {
          accept: "." + (opts.itemClass || "grid-stack-item")
        }});
        if (el.getAttribute("gs-animate")) {
          defaults.animate = utils_1.Utils.toBool(el.getAttribute("gs-animate"));
        }
        this.opts = utils_1.Utils.defaults(opts, defaults);
        opts = null;
        this.initMargin();
        if (this.opts.column !== 1 && !this.opts.disableOneColumnMode && this._widthOrContainer() <= this.opts.minWidth) {
          this._prevColumn = this.opts.column;
          this.opts.column = 1;
        }
        if (this.opts.rtl === "auto") {
          this.opts.rtl = el.style.direction === "rtl";
        }
        if (this.opts.rtl) {
          this.el.classList.add("grid-stack-rtl");
        }
        let parentGridItemEl = utils_1.Utils.closestByClass(this.el, GridDefaults.itemClass);
        if (parentGridItemEl && parentGridItemEl.gridstackNode) {
          this.opts._isNested = parentGridItemEl.gridstackNode;
          this.opts._isNested.subGrid = this;
          this.el.classList.add("grid-stack-nested");
        }
        this._isAutoCellHeight = this.opts.cellHeight === "auto";
        if (this._isAutoCellHeight || this.opts.cellHeight === "initial") {
          this.cellHeight(void 0, false);
        } else {
          this.cellHeight(this.opts.cellHeight, false);
        }
        this.el.classList.add(this.opts._styleSheetClass);
        this._setStaticClass();
        this.engine = new gridstack_engine_1.GridStackEngine({
          column: this.opts.column,
          float: this.opts.float,
          maxRow: this.opts.maxRow,
          onChange: (cbNodes) => {
            let maxH = 0;
            this.engine.nodes.forEach((n) => {
              maxH = Math.max(maxH, n.y + n.h);
            });
            cbNodes.forEach((n) => {
              let el2 = n.el;
              if (n._removeDOM) {
                if (el2)
                  el2.remove();
                delete n._removeDOM;
              } else {
                this._writePosAttr(el2, n);
              }
            });
            this._updateStyles(false, maxH);
          }
        });
        if (this.opts.auto) {
          this.batchUpdate();
          let elements = [];
          this.getGridItems().forEach((el2) => {
            let x = parseInt(el2.getAttribute("gs-x"));
            let y = parseInt(el2.getAttribute("gs-y"));
            elements.push({
              el: el2,
              i: (Number.isNaN(x) ? 1e3 : x) + (Number.isNaN(y) ? 1e3 : y) * this.opts.column
            });
          });
          elements.sort((a, b) => a.i - b.i).forEach((e) => this._prepareElement(e.el));
          this.commit();
        }
        this.setAnimation(this.opts.animate);
        this._updateStyles();
        if (this.opts.column != 12) {
          this.el.classList.add("grid-stack-" + this.opts.column);
        }
        if (this.opts.dragIn)
          GridStack2.setupDragIn(this.opts.dragIn, this.opts.dragInOptions);
        delete this.opts.dragIn;
        delete this.opts.dragInOptions;
        this._setupRemoveDrop();
        this._setupAcceptWidget();
        this._updateWindowResizeEvent();
      }
      static init(options = {}, elOrString = ".grid-stack") {
        let el = GridStack2.getGridElement(elOrString);
        if (!el) {
          if (typeof elOrString === "string") {
            console.error('GridStack.initAll() no grid was found with selector "' + elOrString + '" - element missing or wrong selector ?\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.');
          } else {
            console.error("GridStack.init() no grid element was passed.");
          }
          return null;
        }
        if (!el.gridstack) {
          el.gridstack = new GridStack2(el, utils_1.Utils.cloneDeep(options));
        }
        return el.gridstack;
      }
      static initAll(options = {}, selector = ".grid-stack") {
        let grids = [];
        GridStack2.getGridElements(selector).forEach((el) => {
          if (!el.gridstack) {
            el.gridstack = new GridStack2(el, utils_1.Utils.cloneDeep(options));
            delete options.dragIn;
            delete options.dragInOptions;
          }
          grids.push(el.gridstack);
        });
        if (grids.length === 0) {
          console.error('GridStack.initAll() no grid was found with selector "' + selector + '" - element missing or wrong selector ?\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.');
        }
        return grids;
      }
      static addGrid(parent, opt = {}) {
        if (!parent)
          return null;
        let el = parent;
        if (!parent.classList.contains("grid-stack")) {
          let doc = document.implementation.createHTMLDocument();
          doc.body.innerHTML = `<div class="grid-stack ${opt.class || ""}"></div>`;
          el = doc.body.children[0];
          parent.appendChild(el);
        }
        let grid = GridStack2.init(opt, el);
        if (grid.opts.children) {
          let children = grid.opts.children;
          delete grid.opts.children;
          grid.load(children);
        }
        return grid;
      }
      get placeholder() {
        if (!this._placeholder) {
          let placeholderChild = document.createElement("div");
          placeholderChild.className = "placeholder-content";
          if (this.opts.placeholderText) {
            placeholderChild.innerHTML = this.opts.placeholderText;
          }
          this._placeholder = document.createElement("div");
          this._placeholder.classList.add(this.opts.placeholderClass, GridDefaults.itemClass, this.opts.itemClass);
          this.placeholder.appendChild(placeholderChild);
        }
        return this._placeholder;
      }
      addWidget(els, options) {
        if (arguments.length > 2) {
          console.warn("gridstack.ts: `addWidget(el, x, y, width...)` is deprecated. Use `addWidget({x, y, w, content, ...})`. It will be removed soon");
          let a = arguments, i = 1, opt = {
            x: a[i++],
            y: a[i++],
            w: a[i++],
            h: a[i++],
            autoPosition: a[i++],
            minW: a[i++],
            maxW: a[i++],
            minH: a[i++],
            maxH: a[i++],
            id: a[i++]
          };
          return this.addWidget(els, opt);
        }
        function isGridStackWidget(w) {
          return w.x !== void 0 || w.y !== void 0 || w.w !== void 0 || w.h !== void 0 || w.content !== void 0 ? true : false;
        }
        let el;
        if (typeof els === "string") {
          let doc = document.implementation.createHTMLDocument();
          doc.body.innerHTML = els;
          el = doc.body.children[0];
        } else if (arguments.length === 0 || arguments.length === 1 && isGridStackWidget(els)) {
          let content = els ? els.content || "" : "";
          options = els;
          let doc = document.implementation.createHTMLDocument();
          doc.body.innerHTML = `<div class="grid-stack-item ${this.opts.itemClass || ""}"><div class="grid-stack-item-content">${content}</div></div>`;
          el = doc.body.children[0];
        } else {
          el = els;
        }
        let domAttr = this._readAttr(el);
        options = utils_1.Utils.cloneDeep(options) || {};
        utils_1.Utils.defaults(options, domAttr);
        let node = this.engine.prepareNode(options);
        this._writeAttr(el, options);
        if (this._insertNotAppend) {
          this.el.prepend(el);
        } else {
          this.el.appendChild(el);
        }
        this._prepareElement(el, true, options);
        this._updateContainerHeight();
        if (node.subGrid && !node.subGrid.el) {
          let content = node.el.querySelector(".grid-stack-item-content");
          node.subGrid = GridStack2.addGrid(content, node.subGrid);
        }
        this._triggerAddEvent();
        this._triggerChangeEvent();
        return el;
      }
      save(saveContent = true, saveGridOpt = false) {
        let list = this.engine.save(saveContent);
        list.forEach((n) => {
          if (saveContent && n.el && !n.subGrid) {
            let sub = n.el.querySelector(".grid-stack-item-content");
            n.content = sub ? sub.innerHTML : void 0;
            if (!n.content)
              delete n.content;
          } else {
            if (!saveContent) {
              delete n.content;
            }
            if (n.subGrid) {
              n.subGrid = n.subGrid.save(saveContent, true);
            }
          }
          delete n.el;
        });
        if (saveGridOpt) {
          let o = utils_1.Utils.cloneDeep(this.opts);
          if (o.marginBottom === o.marginTop && o.marginRight === o.marginLeft && o.marginTop === o.marginRight) {
            o.margin = o.marginTop;
            delete o.marginTop;
            delete o.marginRight;
            delete o.marginBottom;
            delete o.marginLeft;
          }
          if (o.rtl === (this.el.style.direction === "rtl")) {
            o.rtl = "auto";
          }
          if (this._isAutoCellHeight) {
            o.cellHeight = "auto";
          }
          utils_1.Utils.removeInternalAndSame(o, GridDefaults);
          o.children = list;
          return o;
        }
        return list;
      }
      load(layout, addAndRemove = true) {
        let items = GridStack2.Utils.sort([...layout], -1, this._prevColumn || this.opts.column);
        this._insertNotAppend = true;
        if (this._prevColumn && this._prevColumn !== this.opts.column && items.some((n) => n.x + n.w > this.opts.column)) {
          this._ignoreLayoutsNodeChange = true;
          this.engine.cacheLayout(items, this._prevColumn, true);
        }
        let removed = [];
        this.batchUpdate();
        if (addAndRemove) {
          let copyNodes = [...this.engine.nodes];
          copyNodes.forEach((n) => {
            let item = items.find((w) => n.id === w.id);
            if (!item) {
              if (typeof addAndRemove === "function") {
                addAndRemove(this, n, false);
              } else {
                removed.push(n);
                this.removeWidget(n.el, true, false);
              }
            }
          });
        }
        items.forEach((w) => {
          let item = w.id || w.id === 0 ? this.engine.nodes.find((n) => n.id === w.id) : void 0;
          if (item) {
            this.update(item.el, w);
            if (w.subGrid && w.subGrid.children) {
              let sub = item.el.querySelector(".grid-stack");
              if (sub && sub.gridstack) {
                sub.gridstack.load(w.subGrid.children);
                this._insertNotAppend = true;
              }
            }
          } else if (addAndRemove) {
            if (typeof addAndRemove === "function") {
              w = addAndRemove(this, w, true).gridstackNode;
            } else {
              w = this.addWidget(w).gridstackNode;
            }
          }
        });
        this.engine.removedNodes = removed;
        this.commit();
        delete this._ignoreLayoutsNodeChange;
        delete this._insertNotAppend;
        return this;
      }
      batchUpdate() {
        this.engine.batchUpdate();
        return this;
      }
      getCellHeight(forcePixel = false) {
        if (this.opts.cellHeight && this.opts.cellHeight !== "auto" && (!forcePixel || !this.opts.cellHeightUnit || this.opts.cellHeightUnit === "px")) {
          return this.opts.cellHeight;
        }
        return Math.round(this.el.getBoundingClientRect().height) / parseInt(this.el.getAttribute("gs-current-row"));
      }
      cellHeight(val, update = true) {
        if (update && val !== void 0) {
          if (this._isAutoCellHeight !== (val === "auto")) {
            this._isAutoCellHeight = val === "auto";
            this._updateWindowResizeEvent();
          }
        }
        if (val === "initial" || val === "auto") {
          val = void 0;
        }
        if (val === void 0) {
          let marginDiff = -this.opts.marginRight - this.opts.marginLeft + this.opts.marginTop + this.opts.marginBottom;
          val = this.cellWidth() + marginDiff;
        }
        let data = utils_1.Utils.parseHeight(val);
        if (this.opts.cellHeightUnit === data.unit && this.opts.cellHeight === data.h) {
          return this;
        }
        this.opts.cellHeightUnit = data.unit;
        this.opts.cellHeight = data.h;
        if (update) {
          this._updateStyles(true, this.getRow());
        }
        return this;
      }
      cellWidth() {
        return this._widthOrContainer() / this.opts.column;
      }
      _widthOrContainer() {
        return this.el.clientWidth || this.el.parentElement.clientWidth || window.innerWidth;
      }
      commit() {
        this.engine.commit();
        this._triggerRemoveEvent();
        this._triggerAddEvent();
        this._triggerChangeEvent();
        return this;
      }
      compact() {
        this.engine.compact();
        this._triggerChangeEvent();
        return this;
      }
      column(column, layout = "moveScale") {
        if (this.opts.column === column)
          return this;
        let oldColumn = this.opts.column;
        if (column === 1) {
          this._prevColumn = oldColumn;
        } else {
          delete this._prevColumn;
        }
        this.el.classList.remove("grid-stack-" + oldColumn);
        this.el.classList.add("grid-stack-" + column);
        this.opts.column = this.engine.column = column;
        let domNodes;
        if (column === 1 && this.opts.oneColumnModeDomSort) {
          domNodes = [];
          this.getGridItems().forEach((el) => {
            if (el.gridstackNode) {
              domNodes.push(el.gridstackNode);
            }
          });
          if (!domNodes.length) {
            domNodes = void 0;
          }
        }
        this.engine.updateNodeWidths(oldColumn, column, domNodes, layout);
        if (this._isAutoCellHeight)
          this.cellHeight();
        this._ignoreLayoutsNodeChange = true;
        this._triggerChangeEvent();
        delete this._ignoreLayoutsNodeChange;
        return this;
      }
      getColumn() {
        return this.opts.column;
      }
      getGridItems() {
        return Array.from(this.el.children).filter((el) => el.matches("." + this.opts.itemClass) && !el.matches("." + this.opts.placeholderClass));
      }
      destroy(removeDOM = true) {
        if (!this.el)
          return;
        this._updateWindowResizeEvent(true);
        this.setStatic(true, false);
        this.setAnimation(false);
        if (!removeDOM) {
          this.removeAll(removeDOM);
          this.el.classList.remove(this.opts._styleSheetClass);
        } else {
          this.el.parentNode.removeChild(this.el);
        }
        this._removeStylesheet();
        this.el.removeAttribute("gs-current-row");
        delete this.opts._isNested;
        delete this.opts;
        delete this._placeholder;
        delete this.engine;
        delete this.el.gridstack;
        delete this.el;
        return this;
      }
      float(val) {
        this.engine.float = val;
        this._triggerChangeEvent();
        return this;
      }
      getFloat() {
        return this.engine.float;
      }
      getCellFromPixel(position, useDocRelative = false) {
        let box = this.el.getBoundingClientRect();
        let containerPos;
        if (useDocRelative) {
          containerPos = {top: box.top + document.documentElement.scrollTop, left: box.left};
        } else {
          containerPos = {top: this.el.offsetTop, left: this.el.offsetLeft};
        }
        let relativeLeft = position.left - containerPos.left;
        let relativeTop = position.top - containerPos.top;
        let columnWidth = box.width / this.opts.column;
        let rowHeight = box.height / parseInt(this.el.getAttribute("gs-current-row"));
        return {x: Math.floor(relativeLeft / columnWidth), y: Math.floor(relativeTop / rowHeight)};
      }
      getRow() {
        return Math.max(this.engine.getRow(), this.opts.minRow);
      }
      isAreaEmpty(x, y, w, h) {
        return this.engine.isAreaEmpty(x, y, w, h);
      }
      makeWidget(els) {
        let el = GridStack2.getElement(els);
        this._prepareElement(el, true);
        this._updateContainerHeight();
        this._triggerAddEvent();
        this._triggerChangeEvent();
        return el;
      }
      on(name, callback) {
        if (name.indexOf(" ") !== -1) {
          let names = name.split(" ");
          names.forEach((name2) => this.on(name2, callback));
          return this;
        }
        if (name === "change" || name === "added" || name === "removed" || name === "enable" || name === "disable") {
          let noData = name === "enable" || name === "disable";
          if (noData) {
            this._gsEventHandler[name] = (event) => callback(event);
          } else {
            this._gsEventHandler[name] = (event) => callback(event, event.detail);
          }
          this.el.addEventListener(name, this._gsEventHandler[name]);
        } else if (name === "drag" || name === "dragstart" || name === "dragstop" || name === "resizestart" || name === "resize" || name === "resizestop" || name === "dropped") {
          this._gsEventHandler[name] = callback;
        } else {
          console.log("GridStack.on(" + name + ') event not supported, but you can still use $(".grid-stack").on(...) while jquery-ui is still used internally.');
        }
        return this;
      }
      off(name) {
        if (name.indexOf(" ") !== -1) {
          let names = name.split(" ");
          names.forEach((name2) => this.off(name2));
          return this;
        }
        if (name === "change" || name === "added" || name === "removed" || name === "enable" || name === "disable") {
          if (this._gsEventHandler[name]) {
            this.el.removeEventListener(name, this._gsEventHandler[name]);
          }
        }
        delete this._gsEventHandler[name];
        return this;
      }
      removeWidget(els, removeDOM = true, triggerEvent = true) {
        GridStack2.getElements(els).forEach((el) => {
          if (el.parentElement !== this.el)
            return;
          let node = el.gridstackNode;
          if (!node) {
            node = this.engine.nodes.find((n) => el === n.el);
          }
          if (!node)
            return;
          delete el.gridstackNode;
          gridstack_ddi_1.GridStackDDI.get().remove(el);
          this.engine.removeNode(node, removeDOM, triggerEvent);
          if (removeDOM && el.parentElement) {
            el.remove();
          }
        });
        if (triggerEvent) {
          this._triggerRemoveEvent();
          this._triggerChangeEvent();
        }
        return this;
      }
      removeAll(removeDOM = true) {
        this.engine.nodes.forEach((n) => {
          delete n.el.gridstackNode;
          gridstack_ddi_1.GridStackDDI.get().remove(n.el);
        });
        this.engine.removeAll(removeDOM);
        this._triggerRemoveEvent();
        return this;
      }
      setAnimation(doAnimate) {
        if (doAnimate) {
          this.el.classList.add("grid-stack-animate");
        } else {
          this.el.classList.remove("grid-stack-animate");
        }
        return this;
      }
      setStatic(val, updateClass = true) {
        if (this.opts.staticGrid === val)
          return this;
        this.opts.staticGrid = val;
        this._setupRemoveDrop();
        this._setupAcceptWidget();
        this.engine.nodes.forEach((n) => this._prepareDragDropByNode(n));
        if (updateClass) {
          this._setStaticClass();
        }
        return this;
      }
      update(els, opt) {
        if (arguments.length > 2) {
          console.warn("gridstack.ts: `update(el, x, y, w, h)` is deprecated. Use `update({x, w, content, ...})`. It will be removed soon");
          let a = arguments, i = 1;
          opt = {x: a[i++], y: a[i++], w: a[i++], h: a[i++]};
          return this.update(els, opt);
        }
        GridStack2.getElements(els).forEach((el) => {
          if (!el || !el.gridstackNode)
            return;
          let n = el.gridstackNode;
          let w = utils_1.Utils.cloneDeep(opt);
          delete w.autoPosition;
          let keys = ["x", "y", "w", "h"];
          let m;
          if (keys.some((k) => w[k] !== void 0 && w[k] !== n[k])) {
            m = {};
            keys.forEach((k) => {
              m[k] = w[k] !== void 0 ? w[k] : n[k];
              delete w[k];
            });
          }
          if (!m && (w.minW || w.minH || w.maxW || w.maxH)) {
            m = {};
          }
          if (w.content) {
            let sub = el.querySelector(".grid-stack-item-content");
            if (sub && sub.innerHTML !== w.content) {
              sub.innerHTML = w.content;
            }
            delete w.content;
          }
          let changed = false;
          let ddChanged = false;
          for (const key in w) {
            if (key[0] !== "_" && n[key] !== w[key]) {
              n[key] = w[key];
              changed = true;
              ddChanged = ddChanged || !this.opts.staticGrid && (key === "noResize" || key === "noMove" || key === "locked");
            }
          }
          if (m) {
            this.engine.cleanNodes().beginUpdate(n).moveNode(n, m);
            this._updateContainerHeight();
            this._triggerChangeEvent();
            this.engine.endUpdate();
          }
          if (changed) {
            this._writeAttr(el, n);
          }
          if (ddChanged) {
            this._prepareDragDropByNode(n);
          }
        });
        return this;
      }
      margin(value) {
        let isMultiValue = typeof value === "string" && value.split(" ").length > 1;
        if (!isMultiValue) {
          let data = utils_1.Utils.parseHeight(value);
          if (this.opts.marginUnit === data.unit && this.opts.margin === data.h)
            return;
        }
        this.opts.margin = value;
        this.opts.marginTop = this.opts.marginBottom = this.opts.marginLeft = this.opts.marginRight = void 0;
        this.initMargin();
        this._updateStyles(true);
        return this;
      }
      getMargin() {
        return this.opts.margin;
      }
      willItFit(node) {
        if (arguments.length > 1) {
          console.warn("gridstack.ts: `willItFit(x,y,w,h,autoPosition)` is deprecated. Use `willItFit({x, y,...})`. It will be removed soon");
          let a = arguments, i = 0, w = {x: a[i++], y: a[i++], w: a[i++], h: a[i++], autoPosition: a[i++]};
          return this.willItFit(w);
        }
        return this.engine.willItFit(node);
      }
      _triggerChangeEvent() {
        if (this.engine.batchMode)
          return this;
        let elements = this.engine.getDirtyNodes(true);
        if (elements && elements.length) {
          if (!this._ignoreLayoutsNodeChange) {
            this.engine.layoutsNodesChange(elements);
          }
          this._triggerEvent("change", elements);
        }
        this.engine.saveInitial();
        return this;
      }
      _triggerAddEvent() {
        if (this.engine.batchMode)
          return this;
        if (this.engine.addedNodes && this.engine.addedNodes.length > 0) {
          if (!this._ignoreLayoutsNodeChange) {
            this.engine.layoutsNodesChange(this.engine.addedNodes);
          }
          this.engine.addedNodes.forEach((n) => {
            delete n._dirty;
          });
          this._triggerEvent("added", this.engine.addedNodes);
          this.engine.addedNodes = [];
        }
        return this;
      }
      _triggerRemoveEvent() {
        if (this.engine.batchMode)
          return this;
        if (this.engine.removedNodes && this.engine.removedNodes.length > 0) {
          this._triggerEvent("removed", this.engine.removedNodes);
          this.engine.removedNodes = [];
        }
        return this;
      }
      _triggerEvent(name, data) {
        let event = data ? new CustomEvent(name, {bubbles: false, detail: data}) : new Event(name);
        this.el.dispatchEvent(event);
        return this;
      }
      _removeStylesheet() {
        if (this._styles) {
          utils_1.Utils.removeStylesheet(this._styles._id);
          delete this._styles;
        }
        return this;
      }
      _updateStyles(forceUpdate = false, maxH) {
        if (forceUpdate) {
          this._removeStylesheet();
        }
        this._updateContainerHeight();
        if (this.opts.cellHeight === 0) {
          return this;
        }
        let cellHeight = this.opts.cellHeight;
        let cellHeightUnit = this.opts.cellHeightUnit;
        let prefix = `.${this.opts._styleSheetClass} > .${this.opts.itemClass}`;
        if (!this._styles) {
          let id = "gridstack-style-" + (Math.random() * 1e5).toFixed();
          let styleLocation = this.opts.styleInHead ? void 0 : this.el.parentNode;
          this._styles = utils_1.Utils.createStylesheet(id, styleLocation);
          if (!this._styles)
            return this;
          this._styles._id = id;
          this._styles._max = 0;
          utils_1.Utils.addCSSRule(this._styles, prefix, `min-height: ${cellHeight}${cellHeightUnit}`);
          let top = this.opts.marginTop + this.opts.marginUnit;
          let bottom = this.opts.marginBottom + this.opts.marginUnit;
          let right = this.opts.marginRight + this.opts.marginUnit;
          let left = this.opts.marginLeft + this.opts.marginUnit;
          let content = `${prefix} > .grid-stack-item-content`;
          let placeholder = `.${this.opts._styleSheetClass} > .grid-stack-placeholder > .placeholder-content`;
          utils_1.Utils.addCSSRule(this._styles, content, `top: ${top}; right: ${right}; bottom: ${bottom}; left: ${left};`);
          utils_1.Utils.addCSSRule(this._styles, placeholder, `top: ${top}; right: ${right}; bottom: ${bottom}; left: ${left};`);
          utils_1.Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-ne`, `right: ${right}`);
          utils_1.Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-e`, `right: ${right}`);
          utils_1.Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-se`, `right: ${right}; bottom: ${bottom}`);
          utils_1.Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-nw`, `left: ${left}`);
          utils_1.Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-w`, `left: ${left}`);
          utils_1.Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-sw`, `left: ${left}; bottom: ${bottom}`);
        }
        maxH = maxH || this._styles._max;
        if (maxH > this._styles._max) {
          let getHeight = (rows) => cellHeight * rows + cellHeightUnit;
          for (let i = this._styles._max + 1; i <= maxH; i++) {
            let h = getHeight(i);
            utils_1.Utils.addCSSRule(this._styles, `${prefix}[gs-y="${i - 1}"]`, `top: ${getHeight(i - 1)}`);
            utils_1.Utils.addCSSRule(this._styles, `${prefix}[gs-h="${i}"]`, `height: ${h}`);
            utils_1.Utils.addCSSRule(this._styles, `${prefix}[gs-min-h="${i}"]`, `min-height: ${h}`);
            utils_1.Utils.addCSSRule(this._styles, `${prefix}[gs-max-h="${i}"]`, `max-height: ${h}`);
          }
          this._styles._max = maxH;
        }
        return this;
      }
      _updateContainerHeight() {
        if (!this.engine || this.engine.batchMode)
          return this;
        let row = this.getRow() + this._extraDragRow;
        let cssMinHeight = parseInt(getComputedStyle(this.el)["min-height"]);
        if (cssMinHeight > 0) {
          let minRow = Math.round(cssMinHeight / this.getCellHeight(true));
          if (row < minRow) {
            row = minRow;
          }
        }
        this.el.setAttribute("gs-current-row", String(row));
        if (row === 0) {
          this.el.style.removeProperty("height");
          return this;
        }
        let cellHeight = this.opts.cellHeight;
        let unit = this.opts.cellHeightUnit;
        if (!cellHeight)
          return this;
        this.el.style.height = row * cellHeight + unit;
        return this;
      }
      _prepareElement(el, triggerAddEvent = false, node) {
        if (!node) {
          el.classList.add(this.opts.itemClass);
          node = this._readAttr(el);
        }
        el.gridstackNode = node;
        node.el = el;
        node.grid = this;
        let copy = Object.assign({}, node);
        node = this.engine.addNode(node, triggerAddEvent);
        if (!utils_1.Utils.same(node, copy)) {
          this._writeAttr(el, node);
        }
        this._prepareDragDropByNode(node);
        return this;
      }
      _writePosAttr(el, n) {
        if (n.x !== void 0 && n.x !== null) {
          el.setAttribute("gs-x", String(n.x));
        }
        if (n.y !== void 0 && n.y !== null) {
          el.setAttribute("gs-y", String(n.y));
        }
        if (n.w) {
          el.setAttribute("gs-w", String(n.w));
        }
        if (n.h) {
          el.setAttribute("gs-h", String(n.h));
        }
        return this;
      }
      _writeAttr(el, node) {
        if (!node)
          return this;
        this._writePosAttr(el, node);
        let attrs = {
          autoPosition: "gs-auto-position",
          minW: "gs-min-w",
          minH: "gs-min-h",
          maxW: "gs-max-w",
          maxH: "gs-max-h",
          noResize: "gs-no-resize",
          noMove: "gs-no-move",
          locked: "gs-locked",
          id: "gs-id",
          resizeHandles: "gs-resize-handles"
        };
        for (const key in attrs) {
          if (node[key]) {
            el.setAttribute(attrs[key], String(node[key]));
          } else {
            el.removeAttribute(attrs[key]);
          }
        }
        return this;
      }
      _readAttr(el) {
        let node = {};
        node.x = utils_1.Utils.toNumber(el.getAttribute("gs-x"));
        node.y = utils_1.Utils.toNumber(el.getAttribute("gs-y"));
        node.w = utils_1.Utils.toNumber(el.getAttribute("gs-w"));
        node.h = utils_1.Utils.toNumber(el.getAttribute("gs-h"));
        node.maxW = utils_1.Utils.toNumber(el.getAttribute("gs-max-w"));
        node.minW = utils_1.Utils.toNumber(el.getAttribute("gs-min-w"));
        node.maxH = utils_1.Utils.toNumber(el.getAttribute("gs-max-h"));
        node.minH = utils_1.Utils.toNumber(el.getAttribute("gs-min-h"));
        node.autoPosition = utils_1.Utils.toBool(el.getAttribute("gs-auto-position"));
        node.noResize = utils_1.Utils.toBool(el.getAttribute("gs-no-resize"));
        node.noMove = utils_1.Utils.toBool(el.getAttribute("gs-no-move"));
        node.locked = utils_1.Utils.toBool(el.getAttribute("gs-locked"));
        node.resizeHandles = el.getAttribute("gs-resize-handles");
        node.id = el.getAttribute("gs-id");
        for (const key in node) {
          if (!node.hasOwnProperty(key))
            return;
          if (!node[key] && node[key] !== 0) {
            delete node[key];
          }
        }
        return node;
      }
      _setStaticClass() {
        let classes = ["grid-stack-static"];
        if (this.opts.staticGrid) {
          this.el.classList.add(...classes);
          this.el.setAttribute("gs-static", "true");
        } else {
          this.el.classList.remove(...classes);
          this.el.removeAttribute("gs-static");
        }
        return this;
      }
      onParentResize() {
        if (!this.el || !this.el.clientWidth)
          return;
        let oneColumn = !this.opts.disableOneColumnMode && this.el.clientWidth <= this.opts.minWidth;
        let changedOneColumn = false;
        if (this.opts.column === 1 !== oneColumn) {
          changedOneColumn = true;
          if (this.opts.animate) {
            this.setAnimation(false);
          }
          this.column(oneColumn ? 1 : this._prevColumn);
          if (this.opts.animate) {
            this.setAnimation(true);
          }
        }
        if (this._isAutoCellHeight) {
          if (!changedOneColumn && this.opts.cellHeightThrottle) {
            if (!this._cellHeightThrottle) {
              this._cellHeightThrottle = utils_1.Utils.throttle(() => this.cellHeight(), this.opts.cellHeightThrottle);
            }
            this._cellHeightThrottle();
          } else {
            this.cellHeight();
          }
        }
        this.engine.nodes.forEach((n) => {
          if (n.subGrid) {
            n.subGrid.onParentResize();
          }
        });
        return this;
      }
      _updateWindowResizeEvent(forceRemove = false) {
        const workTodo = (this._isAutoCellHeight || !this.opts.disableOneColumnMode) && !this.opts._isNested;
        if (!forceRemove && workTodo && !this._windowResizeBind) {
          this._windowResizeBind = this.onParentResize.bind(this);
          window.addEventListener("resize", this._windowResizeBind);
        } else if ((forceRemove || !workTodo) && this._windowResizeBind) {
          window.removeEventListener("resize", this._windowResizeBind);
          delete this._windowResizeBind;
        }
        return this;
      }
      static getElement(els = ".grid-stack-item") {
        return utils_1.Utils.getElement(els);
      }
      static getElements(els = ".grid-stack-item") {
        return utils_1.Utils.getElements(els);
      }
      static getGridElement(els) {
        return GridStack2.getElement(els);
      }
      static getGridElements(els) {
        return utils_1.Utils.getElements(els);
      }
      initMargin() {
        let data;
        let margin = 0;
        let margins = [];
        if (typeof this.opts.margin === "string") {
          margins = this.opts.margin.split(" ");
        }
        if (margins.length === 2) {
          this.opts.marginTop = this.opts.marginBottom = margins[0];
          this.opts.marginLeft = this.opts.marginRight = margins[1];
        } else if (margins.length === 4) {
          this.opts.marginTop = margins[0];
          this.opts.marginRight = margins[1];
          this.opts.marginBottom = margins[2];
          this.opts.marginLeft = margins[3];
        } else {
          data = utils_1.Utils.parseHeight(this.opts.margin);
          this.opts.marginUnit = data.unit;
          margin = this.opts.margin = data.h;
        }
        if (this.opts.marginTop === void 0) {
          this.opts.marginTop = margin;
        } else {
          data = utils_1.Utils.parseHeight(this.opts.marginTop);
          this.opts.marginTop = data.h;
          delete this.opts.margin;
        }
        if (this.opts.marginBottom === void 0) {
          this.opts.marginBottom = margin;
        } else {
          data = utils_1.Utils.parseHeight(this.opts.marginBottom);
          this.opts.marginBottom = data.h;
          delete this.opts.margin;
        }
        if (this.opts.marginRight === void 0) {
          this.opts.marginRight = margin;
        } else {
          data = utils_1.Utils.parseHeight(this.opts.marginRight);
          this.opts.marginRight = data.h;
          delete this.opts.margin;
        }
        if (this.opts.marginLeft === void 0) {
          this.opts.marginLeft = margin;
        } else {
          data = utils_1.Utils.parseHeight(this.opts.marginLeft);
          this.opts.marginLeft = data.h;
          delete this.opts.margin;
        }
        this.opts.marginUnit = data.unit;
        if (this.opts.marginTop === this.opts.marginBottom && this.opts.marginLeft === this.opts.marginRight && this.opts.marginTop === this.opts.marginRight) {
          this.opts.margin = this.opts.marginTop;
        }
        return this;
      }
      static setupDragIn(dragIn, dragInOptions) {
      }
      movable(els, val) {
        return this;
      }
      resizable(els, val) {
        return this;
      }
      disable() {
        return this;
      }
      enable() {
        return this;
      }
      enableMove(doEnable) {
        return this;
      }
      enableResize(doEnable) {
        return this;
      }
      _setupAcceptWidget() {
        return this;
      }
      _setupRemoveDrop() {
        return this;
      }
      _prepareDragDropByNode(node) {
        return this;
      }
      _onStartMoving(el, event, ui, node, cellWidth, cellHeight) {
        return;
      }
      _dragOrResize(el, event, ui, node, cellWidth, cellHeight) {
        return;
      }
      _leave(el, helper) {
        return;
      }
    };
    exports.GridStack = GridStack2;
    GridStack2.Utils = utils_1.Utils;
    GridStack2.Engine = gridstack_engine_1.GridStackEngine;
  });

  // node_modules/gridstack/dist/gridstack-dd.js
  var require_gridstack_dd = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.GridStackDD = void 0;
    var gridstack_ddi_1 = require_gridstack_ddi();
    var gridstack_1 = require_gridstack();
    var utils_1 = require_utils();
    var GridStackDD = class extends gridstack_ddi_1.GridStackDDI {
      static get() {
        return gridstack_ddi_1.GridStackDDI.get();
      }
      remove(el) {
        this.draggable(el, "destroy").resizable(el, "destroy");
        if (el.gridstackNode) {
          delete el.gridstackNode._initDD;
        }
        return this;
      }
    };
    exports.GridStackDD = GridStackDD;
    gridstack_1.GridStack.prototype._setupAcceptWidget = function() {
      if (this.opts.staticGrid || !this.opts.acceptWidgets && !this.opts.removable) {
        GridStackDD.get().droppable(this.el, "destroy");
        return this;
      }
      let gridPos;
      let cellHeight, cellWidth;
      let onDrag = (event, el, helper) => {
        let node = el.gridstackNode;
        if (!node)
          return;
        helper = helper || el;
        let rec = helper.getBoundingClientRect();
        let left = rec.left - gridPos.left;
        let top = rec.top - gridPos.top;
        let ui = {position: {top, left}};
        if (node._temporaryRemoved) {
          node.x = Math.max(0, Math.round(left / cellWidth));
          node.y = Math.max(0, Math.round(top / cellHeight));
          delete node.autoPosition;
          this.engine.nodeBoundFix(node);
          if (!this.engine.willItFit(node)) {
            node.autoPosition = true;
            if (!this.engine.willItFit(node)) {
              GridStackDD.get().off(el, "drag");
              return;
            }
            if (node._willFitPos) {
              utils_1.Utils.copyPos(node, node._willFitPos);
              delete node._willFitPos;
            }
          }
          this._onStartMoving(helper, event, ui, node, cellWidth, cellHeight);
        } else {
          this._dragOrResize(helper, event, ui, node, cellWidth, cellHeight);
        }
      };
      GridStackDD.get().droppable(this.el, {
        accept: (el) => {
          let node = el.gridstackNode;
          if (node && node.grid === this)
            return true;
          if (!this.opts.acceptWidgets)
            return false;
          let canAccept = true;
          if (typeof this.opts.acceptWidgets === "function") {
            canAccept = this.opts.acceptWidgets(el);
          } else {
            let selector = this.opts.acceptWidgets === true ? ".grid-stack-item" : this.opts.acceptWidgets;
            canAccept = el.matches(selector);
          }
          if (canAccept && node && this.opts.maxRow) {
            let n = {w: node.w, h: node.h, minW: node.minW, minH: node.minH};
            canAccept = this.engine.willItFit(n);
          }
          return canAccept;
        }
      }).on(this.el, "dropover", (event, el, helper) => {
        let node = el.gridstackNode;
        if (node && node.grid === this && !node._temporaryRemoved) {
          return false;
        }
        if (node && node.grid && node.grid !== this && !node._temporaryRemoved) {
          let otherGrid = node.grid;
          otherGrid._leave(el, helper);
        }
        let box = this.el.getBoundingClientRect();
        gridPos = {top: box.top, left: box.left};
        cellWidth = this.cellWidth();
        cellHeight = this.getCellHeight(true);
        if (!node) {
          node = this._readAttr(el);
        }
        if (!node.grid) {
          node._isExternal = true;
          el.gridstackNode = node;
        }
        helper = helper || el;
        let w = node.w || Math.round(helper.offsetWidth / cellWidth) || 1;
        let h = node.h || Math.round(helper.offsetHeight / cellHeight) || 1;
        if (node.grid && node.grid !== this) {
          if (!el._gridstackNodeOrig)
            el._gridstackNodeOrig = node;
          el.gridstackNode = node = Object.assign(Object.assign({}, node), {w, h, grid: this});
          this.engine.cleanupNode(node).nodeBoundFix(node);
          node._initDD = node._isExternal = node._temporaryRemoved = true;
        } else {
          node.w = w;
          node.h = h;
          node._temporaryRemoved = true;
        }
        _itemRemoving(node.el, false);
        GridStackDD.get().on(el, "drag", onDrag);
        onDrag(event, el, helper);
        return false;
      }).on(this.el, "dropout", (event, el, helper) => {
        let node = el.gridstackNode;
        if (!node.grid || node.grid === this) {
          this._leave(el, helper);
        }
        return false;
      }).on(this.el, "drop", (event, el, helper) => {
        let node = el.gridstackNode;
        if (node && node.grid === this && !node._isExternal)
          return false;
        let wasAdded = !!this.placeholder.parentElement;
        this.placeholder.remove();
        let origNode = el._gridstackNodeOrig;
        delete el._gridstackNodeOrig;
        if (wasAdded && origNode && origNode.grid && origNode.grid !== this) {
          let oGrid = origNode.grid;
          oGrid.engine.removedNodes.push(origNode);
          oGrid._triggerRemoveEvent();
        }
        if (!node)
          return false;
        if (wasAdded) {
          this.engine.cleanupNode(node);
          node.grid = this;
        }
        GridStackDD.get().off(el, "drag");
        if (helper !== el) {
          helper.remove();
          el.gridstackNode = origNode;
          if (wasAdded) {
            el = el.cloneNode(true);
          }
        } else {
          el.remove();
          GridStackDD.get().remove(el);
        }
        if (!wasAdded)
          return false;
        el.gridstackNode = node;
        node.el = el;
        utils_1.Utils.copyPos(node, this._readAttr(this.placeholder));
        utils_1.Utils.removePositioningStyles(el);
        this._writeAttr(el, node);
        this.el.appendChild(el);
        this._updateContainerHeight();
        this.engine.addedNodes.push(node);
        this._triggerAddEvent();
        this._triggerChangeEvent();
        this.engine.endUpdate();
        if (this._gsEventHandler["dropped"]) {
          this._gsEventHandler["dropped"]({type: "dropped"}, origNode && origNode.grid ? origNode : void 0, node);
        }
        window.setTimeout(() => {
          if (node.el && node.el.parentElement) {
            this._prepareDragDropByNode(node);
          } else {
            this.engine.removeNode(node);
          }
        });
        return false;
      });
      return this;
    };
    function _itemRemoving(el, remove) {
      let node = el ? el.gridstackNode : void 0;
      if (!node || !node.grid)
        return;
      remove ? node._isAboutToRemove = true : delete node._isAboutToRemove;
      remove ? el.classList.add("grid-stack-item-removing") : el.classList.remove("grid-stack-item-removing");
    }
    gridstack_1.GridStack.prototype._setupRemoveDrop = function() {
      if (!this.opts.staticGrid && typeof this.opts.removable === "string") {
        let trashEl = document.querySelector(this.opts.removable);
        if (!trashEl)
          return this;
        if (!GridStackDD.get().isDroppable(trashEl)) {
          GridStackDD.get().droppable(trashEl, this.opts.removableOptions).on(trashEl, "dropover", (event, el) => _itemRemoving(el, true)).on(trashEl, "dropout", (event, el) => _itemRemoving(el, false));
        }
      }
      return this;
    };
    gridstack_1.GridStack.setupDragIn = function(_dragIn, _dragInOptions) {
      let dragIn;
      let dragInOptions;
      const dragInDefaultOptions = {
        revert: "invalid",
        handle: ".grid-stack-item-content",
        scroll: false,
        appendTo: "body"
      };
      if (_dragIn) {
        dragIn = _dragIn;
        dragInOptions = Object.assign(Object.assign({}, dragInDefaultOptions), _dragInOptions || {});
      }
      if (typeof dragIn !== "string")
        return;
      let dd = GridStackDD.get();
      utils_1.Utils.getElements(dragIn).forEach((el) => {
        if (!dd.isDraggable(el))
          dd.dragIn(el, dragInOptions);
      });
    };
    gridstack_1.GridStack.prototype._prepareDragDropByNode = function(node) {
      let el = node.el;
      let dd = GridStackDD.get();
      if (this.opts.staticGrid || (node.noMove || this.opts.disableDrag) && (node.noResize || this.opts.disableResize)) {
        if (node._initDD) {
          dd.remove(el);
          delete node._initDD;
        }
        el.classList.add("ui-draggable-disabled", "ui-resizable-disabled");
        return this;
      }
      if (!node._initDD) {
        let cellWidth;
        let cellHeight;
        let onStartMoving = (event, ui) => {
          if (this._gsEventHandler[event.type]) {
            this._gsEventHandler[event.type](event, event.target);
          }
          cellWidth = this.cellWidth();
          cellHeight = this.getCellHeight(true);
          this._onStartMoving(el, event, ui, node, cellWidth, cellHeight);
        };
        let dragOrResize = (event, ui) => {
          this._dragOrResize(el, event, ui, node, cellWidth, cellHeight);
        };
        let onEndMoving = (event) => {
          this.placeholder.remove();
          delete node._moving;
          delete node._lastTried;
          let target = event.target;
          if (!target.gridstackNode || target.gridstackNode.grid !== this)
            return;
          node.el = target;
          if (node._isAboutToRemove) {
            let gridToNotify = el.gridstackNode.grid;
            if (gridToNotify._gsEventHandler[event.type]) {
              gridToNotify._gsEventHandler[event.type](event, target);
            }
            dd.remove(el);
            gridToNotify.engine.removedNodes.push(node);
            gridToNotify._triggerRemoveEvent();
            delete el.gridstackNode;
            delete node.el;
            el.remove();
          } else {
            if (!node._temporaryRemoved) {
              utils_1.Utils.removePositioningStyles(target);
              this._writePosAttr(target, node);
            } else {
              utils_1.Utils.removePositioningStyles(target);
              utils_1.Utils.copyPos(node, node._orig);
              this._writePosAttr(target, node);
              this.engine.addNode(node);
            }
            if (this._gsEventHandler[event.type]) {
              this._gsEventHandler[event.type](event, target);
            }
          }
          this._extraDragRow = 0;
          this._updateContainerHeight();
          this._triggerChangeEvent();
          this.engine.endUpdate();
        };
        dd.draggable(el, {
          start: onStartMoving,
          stop: onEndMoving,
          drag: dragOrResize
        }).resizable(el, {
          start: onStartMoving,
          stop: onEndMoving,
          resize: dragOrResize
        });
        node._initDD = true;
      }
      if (node.noMove || this.opts.disableDrag) {
        dd.draggable(el, "disable");
        el.classList.add("ui-draggable-disabled");
      } else {
        dd.draggable(el, "enable");
        el.classList.remove("ui-draggable-disabled");
      }
      if (node.noResize || this.opts.disableResize) {
        dd.resizable(el, "disable");
        el.classList.add("ui-resizable-disabled");
      } else {
        dd.resizable(el, "enable");
        el.classList.remove("ui-resizable-disabled");
      }
      return this;
    };
    gridstack_1.GridStack.prototype._onStartMoving = function(el, event, ui, node, cellWidth, cellHeight) {
      this.engine.cleanNodes().beginUpdate(node);
      this._writePosAttr(this.placeholder, node);
      this.el.appendChild(this.placeholder);
      node.el = this.placeholder;
      node._lastUiPosition = ui.position;
      node._prevYPix = ui.position.top;
      node._moving = event.type === "dragstart";
      delete node._lastTried;
      if (event.type === "dropover" && node._temporaryRemoved) {
        this.engine.addNode(node);
        node._moving = true;
      }
      this.engine.cacheRects(cellWidth, cellHeight, this.opts.marginTop, this.opts.marginRight, this.opts.marginBottom, this.opts.marginLeft);
      if (event.type === "resizestart") {
        let dd = GridStackDD.get().resizable(el, "option", "minWidth", cellWidth * (node.minW || 1)).resizable(el, "option", "minHeight", cellHeight * (node.minH || 1));
        if (node.maxW) {
          dd.resizable(el, "option", "maxWidth", cellWidth * node.maxW);
        }
        if (node.maxH) {
          dd.resizable(el, "option", "maxHeight", cellHeight * node.maxH);
        }
      }
    };
    gridstack_1.GridStack.prototype._leave = function(el, helper) {
      let node = el.gridstackNode;
      if (!node)
        return;
      GridStackDD.get().off(el, "drag");
      if (node._temporaryRemoved)
        return;
      node._temporaryRemoved = true;
      this.engine.removeNode(node);
      node.el = node._isExternal && helper ? helper : el;
      if (this.opts.removable === true) {
        _itemRemoving(el, true);
      }
      if (el._gridstackNodeOrig) {
        el.gridstackNode = el._gridstackNodeOrig;
        delete el._gridstackNodeOrig;
      } else if (node._isExternal) {
        delete node.el;
        delete el.gridstackNode;
        this.engine.restoreInitial();
      }
    };
    gridstack_1.GridStack.prototype._dragOrResize = function(el, event, ui, node, cellWidth, cellHeight) {
      let p = Object.assign({}, node._orig);
      let resizing;
      const mLeft = this.opts.marginLeft, mRight = this.opts.marginRight, mTop = this.opts.marginTop, mBottom = this.opts.marginBottom;
      if (event.type === "drag") {
        if (node._temporaryRemoved)
          return;
        let distance = ui.position.top - node._prevYPix;
        node._prevYPix = ui.position.top;
        utils_1.Utils.updateScrollPosition(el, ui.position, distance);
        let left = ui.position.left + (ui.position.left > node._lastUiPosition.left ? -mRight : mLeft);
        let top = ui.position.top + (ui.position.top > node._lastUiPosition.top ? -mBottom : mTop);
        p.x = Math.round(left / cellWidth);
        p.y = Math.round(top / cellHeight);
        let prev = this._extraDragRow;
        if (this.engine.collide(node, p)) {
          let row = this.getRow();
          let extra = Math.max(0, p.y + node.h - row);
          if (this.opts.maxRow && row + extra > this.opts.maxRow) {
            extra = Math.max(0, this.opts.maxRow - row);
          }
          this._extraDragRow = extra;
        } else
          this._extraDragRow = 0;
        if (this._extraDragRow !== prev)
          this._updateContainerHeight();
        if (node.x === p.x && node.y === p.y)
          return;
      } else if (event.type === "resize") {
        if (p.x < 0)
          return;
        utils_1.Utils.updateScrollResize(event, el, cellHeight);
        p.w = Math.round((ui.size.width - mLeft) / cellWidth);
        p.h = Math.round((ui.size.height - mTop) / cellHeight);
        if (node.w === p.w && node.h === p.h)
          return;
        if (node._lastTried && node._lastTried.w === p.w && node._lastTried.h === p.h)
          return;
        let left = ui.position.left + mLeft;
        let top = ui.position.top + mTop;
        p.x = Math.round(left / cellWidth);
        p.y = Math.round(top / cellHeight);
        resizing = true;
      }
      node._lastTried = p;
      let rect = {
        x: ui.position.left + mLeft,
        y: ui.position.top + mTop,
        w: (ui.size ? ui.size.width : node.w * cellWidth) - mLeft - mRight,
        h: (ui.size ? ui.size.height : node.h * cellHeight) - mTop - mBottom
      };
      if (this.engine.moveNodeCheck(node, Object.assign(Object.assign({}, p), {cellWidth, cellHeight, rect}))) {
        node._lastUiPosition = ui.position;
        this.engine.cacheRects(cellWidth, cellHeight, mTop, mRight, mBottom, mLeft);
        delete node._skipDown;
        if (resizing && node.subGrid) {
          node.subGrid.onParentResize();
        }
        this._extraDragRow = 0;
        this._updateContainerHeight();
        let target = event.target;
        this._writePosAttr(target, node);
        if (this._gsEventHandler[event.type]) {
          this._gsEventHandler[event.type](event, target);
        }
      }
    };
    gridstack_1.GridStack.prototype.movable = function(els, val) {
      if (this.opts.staticGrid)
        return this;
      gridstack_1.GridStack.getElements(els).forEach((el) => {
        let node = el.gridstackNode;
        if (!node)
          return;
        if (val)
          delete node.noMove;
        else
          node.noMove = true;
        this._prepareDragDropByNode(node);
      });
      return this;
    };
    gridstack_1.GridStack.prototype.resizable = function(els, val) {
      if (this.opts.staticGrid)
        return this;
      gridstack_1.GridStack.getElements(els).forEach((el) => {
        let node = el.gridstackNode;
        if (!node)
          return;
        if (val)
          delete node.noResize;
        else
          node.noResize = true;
        this._prepareDragDropByNode(node);
      });
      return this;
    };
    gridstack_1.GridStack.prototype.disable = function() {
      if (this.opts.staticGrid)
        return;
      this.enableMove(false);
      this.enableResize(false);
      this._triggerEvent("disable");
      return this;
    };
    gridstack_1.GridStack.prototype.enable = function() {
      if (this.opts.staticGrid)
        return;
      this.enableMove(true);
      this.enableResize(true);
      this._triggerEvent("enable");
      return this;
    };
    gridstack_1.GridStack.prototype.enableMove = function(doEnable) {
      if (this.opts.staticGrid)
        return this;
      this.opts.disableDrag = !doEnable;
      this.engine.nodes.forEach((n) => this.movable(n.el, doEnable));
      return this;
    };
    gridstack_1.GridStack.prototype.enableResize = function(doEnable) {
      if (this.opts.staticGrid)
        return this;
      this.opts.disableResize = !doEnable;
      this.engine.nodes.forEach((n) => this.resizable(n.el, doEnable));
      return this;
    };
  });

  // node_modules/gridstack/dist/h5/gridstack-dd-native.js
  var require_gridstack_dd_native = __commonJS((exports) => {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !exports2.hasOwnProperty(p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.GridStackDDNative = void 0;
    var dd_manager_1 = require_dd_manager();
    var dd_element_1 = require_dd_element();
    var gridstack_dd_1 = require_gridstack_dd();
    var utils_1 = require_utils();
    __exportStar2(require_gridstack_dd(), exports);
    var GridStackDDNative = class extends gridstack_dd_1.GridStackDD {
      resizable(el, opts, key, value) {
        this._getDDElements(el).forEach((dEl) => {
          if (opts === "disable" || opts === "enable") {
            dEl.ddResizable && dEl.ddResizable[opts]();
          } else if (opts === "destroy") {
            dEl.ddResizable && dEl.cleanResizable();
          } else if (opts === "option") {
            dEl.setupResizable({[key]: value});
          } else {
            const grid = dEl.el.gridstackNode.grid;
            let handles = dEl.el.getAttribute("gs-resize-handles") ? dEl.el.getAttribute("gs-resize-handles") : grid.opts.resizable.handles;
            dEl.setupResizable(Object.assign(Object.assign(Object.assign({}, grid.opts.resizable), {handles}), {
              start: opts.start,
              stop: opts.stop,
              resize: opts.resize
            }));
          }
        });
        return this;
      }
      draggable(el, opts, key, value) {
        this._getDDElements(el).forEach((dEl) => {
          if (opts === "disable" || opts === "enable") {
            dEl.ddDraggable && dEl.ddDraggable[opts]();
          } else if (opts === "destroy") {
            dEl.ddDraggable && dEl.cleanDraggable();
          } else if (opts === "option") {
            dEl.setupDraggable({[key]: value});
          } else {
            const grid = dEl.el.gridstackNode.grid;
            dEl.setupDraggable(Object.assign(Object.assign({}, grid.opts.draggable), {
              containment: grid.opts._isNested && !grid.opts.dragOut ? grid.el.parentElement : grid.opts.draggable.containment || null,
              start: opts.start,
              stop: opts.stop,
              drag: opts.drag
            }));
          }
        });
        return this;
      }
      dragIn(el, opts) {
        this._getDDElements(el).forEach((dEl) => dEl.setupDraggable(opts));
        return this;
      }
      droppable(el, opts, key, value) {
        if (typeof opts.accept === "function" && !opts._accept) {
          opts._accept = opts.accept;
          opts.accept = (el2) => opts._accept(el2);
        }
        this._getDDElements(el).forEach((dEl) => {
          if (opts === "disable" || opts === "enable") {
            dEl.ddDroppable && dEl.ddDroppable[opts]();
          } else if (opts === "destroy") {
            if (dEl.ddDroppable) {
              dEl.cleanDroppable();
            }
          } else if (opts === "option") {
            dEl.setupDroppable({[key]: value});
          } else {
            dEl.setupDroppable(opts);
          }
        });
        return this;
      }
      isDroppable(el) {
        return !!(el && el.ddElement && el.ddElement.ddDroppable && !el.ddElement.ddDroppable.disabled);
      }
      isDraggable(el) {
        return !!(el && el.ddElement && el.ddElement.ddDraggable && !el.ddElement.ddDraggable.disabled);
      }
      isResizable(el) {
        return !!(el && el.ddElement && el.ddElement.ddResizable && !el.ddElement.ddResizable.disabled);
      }
      on(el, name, callback) {
        this._getDDElements(el).forEach((dEl) => dEl.on(name, (event) => {
          callback(event, dd_manager_1.DDManager.dragElement ? dd_manager_1.DDManager.dragElement.el : event.target, dd_manager_1.DDManager.dragElement ? dd_manager_1.DDManager.dragElement.helper : null);
        }));
        return this;
      }
      off(el, name) {
        this._getDDElements(el).forEach((dEl) => dEl.off(name));
        return this;
      }
      _getDDElements(els, create = true) {
        let hosts = utils_1.Utils.getElements(els);
        if (!hosts.length)
          return [];
        let list = hosts.map((e) => e.ddElement || (create ? dd_element_1.DDElement.init(e) : null));
        if (!create) {
          list.filter((d) => d);
        }
        return list;
      }
    };
    exports.GridStackDDNative = GridStackDDNative;
    gridstack_dd_1.GridStackDD.registerPlugin(GridStackDDNative);
  });

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

  // src/ilogin.js
  var iLogin = class extends iDialogBase {
    constructor(onconnect) {
      super();
      this.onconnect = onconnect;
    }
    build() {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      this.close.remove();
      this.content = this.root.appendChild(document.createElement("div"));
      this.content.textContent = "Login";
      this.content.style.width = "300px";
      this.content.style.height = "400px";
      this.content.style.display = "flex";
      this.content.style.flexDirection = "column";
      this.content.style.justifyContent = "space-evenly";
      this.content.style.alignItems = "stretch";
      this.content.style.backgroundColor = "rgba(37, 37, 37, 0.9)";
      this.content.style.padding = "50px";
      this.content.innerHTML = `
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
      this.url = this.content.querySelector("#url");
      this.url.value = localStorage.getItem("idom_url") || "ws://" + location.host;
      this.url.addEventListener("input", (a) => this.validate());
      this.username = this.content.querySelector("#username");
      this.username.value = localStorage.getItem("idom_username") || "";
      this.username.addEventListener("input", (a) => this.validate());
      this.password = this.content.querySelector("#password");
      this.password.value = localStorage.getItem("idom_password") || "";
      this.password.addEventListener("input", (a) => this.validate());
      this.button = this.content.querySelector("button");
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
      this.infobutton = new iIcon("info", 18, 18, () => {
        this.parentElement.parentElement.parentElement.appendChild(new iInfo(this.dev));
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
      if (dev.SENSOR || dev.STATUS8) {
        const sensor = dev.SENSOR || dev.STATUS8.StatusSNS;
        const tmp = sensor.AM2301 || sensor.SI7021;
        if (tmp) {
          this.sensorNode.style.display = "block";
          this.sensorNode.innerHTML = tmp ? `<i-icon width="24" height="24" name="temp" ></i-icon>${tmp.Temperature}C <i-icon width="24" height="24" name="hum" style="padding-left: 20px" ></i-icon> ${tmp.Humidity}%` : "?";
        }
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
  var tasmota_default = "/* THEME */\n.grid-stack { \n    background: #252525;\n    /* height: 100% !important; */\n}\n.grid-stack-item-content { \n    background-color:  #252525;\n    display: flex;\n    flex-direction: column;\n}\n\n/* .idom-main {\n    padding: 10px;\n    padding-bottom: 60px;\n\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n\n    gap: 1rem;\n    background-color: #252525;\n}\n\n@media (min-width: 0px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(1, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n@media (min-width: 700px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(2, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n@media (min-width: 1000px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n}\n\n@media (min-width: 1300px) {\n    .idom-main {\n        padding: 10px;\n        padding-bottom: 60px;\n        display: grid;\n        grid-template-columns: repeat(4, 1fr);    \n        gap: 1rem;\n        background-color: #252525;\n    }    \n} */\n\n.idom-device {\n    background-color: #283239;\n    border-radius: 0.5em;\n    flex: 1;\n}\n\n.idom-device h2 {\n    margin-top: 0px;\n}\n\ni-switch {\n    display: flex;\n    justify-content: center;\n}\n\n.idom-device-switches {\n    display: flex;\n    justify-content: center;\n    flex-wrap: wrap;\n}\n\n.idom-device .iswitch {\n    padding-left: 20px;\n    padding-right: 20px;\n    white-space: nowrap;\n    flex-basis: 250px;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-evenly;\n    gap: 0.5em;\n    /* margin-bottom: 20px; */\n    /* max-width: 350px; */\n}\n\n.idom-device .iswitch.OFF {\n    background-color: #88A9BB;\n}\n\n.idom-device-sensor {\n    font-size: 2em;\n}\n\n.idom-device-toolbar {\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n    padding: 6px;\n    padding-left: 10px;\n}\n\n.idom-device-body {\n    display: flex;\n    flex-direction: column;\n    align-content: center;\n    justify-content: center;\n    align-items: center;\n    flex: 1;\n    padding: 6px;\n    gap:6px;\n}\n\n.idom-device-root {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    /* align-content: center;\n    justify-content: center;\n    align-items: center; */\n}\n\n.spinner {\n    display: inline-block;\n    width: 24px;\n    height: 24px;\n    /* margin: 100px auto; */\n    background-color: #333;\n    border-radius: 100%;\n    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;\n    animation: sk-scaleout 1.0s infinite ease-in-out;\n}\n\n@-webkit-keyframes sk-scaleout {\n    0% {\n        -webkit-transform: scale(0)\n    }\n    100% {\n        -webkit-transform: scale(1.0);\n        opacity: 0;\n    }\n}\n\n@keyframes sk-scaleout {\n    0% {\n        -webkit-transform: scale(0);\n        transform: scale(0);\n    }\n    100% {\n        -webkit-transform: scale(1.0);\n        transform: scale(1.0);\n        opacity: 0;\n    }\n}\n\n/* */\n\n* {\n    color: #eaeaea;\n}\n\n/* */\n\ndiv, fieldset, input, select {\n    /* padding: 5px; */\n    font-size: 1em;\n}\n\nfieldset {\n    background: #4f4f4f;\n}\n\np {\n    margin: 0.5em 0;\n}\n\ninput {\n    width: 100%;\n    box-sizing: border-box;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    background: #dddddd;\n    color: #000000;\n}\n\ninput[type=checkbox], input[type=radio] {\n    width: 1em;\n    margin-right: 6px;\n    vertical-align: -1px;\n}\n\ninput[type=range] {\n    width: 99%;\n}\n\nselect {\n    width: 100%;\n    background: #dddddd;\n    color: #000000;\n}\n\ntextarea {\n    resize: vertical;\n    width: 98%;\n    height: 318px;\n    padding: 5px;\n    overflow: auto;\n    background: #1f1f1f;\n    color: #65c115;\n}\n\nbody {\n    text-align: center;\n    font-family: verdana, sans-serif;\n    background: #252525;\n}\n\ntd {\n    padding: 0px;\n}\n\nbutton {\n    border: 0;\n    border-radius: 0.3rem;\n    background: #1fa3ec;\n    color: #faffff;\n    line-height: 2.4rem;\n    font-size: 1.2rem;\n    width: 100%;\n    -webkit-transition-duration: 0.4s;\n    transition-duration: 0.4s;\n    cursor: pointer;\n}\n\nbutton:hover {\n    background: #0e70a4;\n}\n\nbutton:disabled, button[disabled] {\n    background: #cccccc;\n    cursor: default;\n}\n\n.bred {\n    background: #d43535;\n}\n\n.bred:hover {\n    background: #931f1f;\n}\n\n.bgrn {\n    background: #47c266;\n}\n\n.bgrn:hover {\n    background: #5aaf6f;\n}\n\na {\n    color: #1fa3ec;\n    text-decoration: none;\n}\n\n.p {\n    float: left;\n    text-align: left;\n}\n\n.q {\n    float: right;\n    text-align: right;\n}\n\n.r {\n    border-radius: 0.3em;\n    padding: 2px;\n    margin: 6px 2px;\n}";

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
  var import_gridstack_dd_native = __toModule(require_gridstack_dd_native());
  var import_gridstack = __toModule(require_gridstack());

  // node_modules/gridstack/dist/gridstack.min.css
  var gridstack_min_default = ":root .grid-stack-item>.ui-resizable-handle{filter:none}.grid-stack{position:relative}.grid-stack.grid-stack-rtl{direction:ltr}.grid-stack.grid-stack-rtl>.grid-stack-item{direction:rtl}.grid-stack .grid-stack-placeholder>.placeholder-content{border:1px dashed #d3d3d3;margin:0;position:absolute;width:auto;z-index:0!important;text-align:center}.grid-stack>.grid-stack-item{min-width:8.3333333333%;position:absolute;padding:0}.grid-stack>.grid-stack-item>.grid-stack-item-content{margin:0;position:absolute;width:auto;overflow-x:hidden;overflow-y:auto}.grid-stack>.grid-stack-item>.ui-resizable-handle{position:absolute;font-size:.1px;display:block;-ms-touch-action:none;touch-action:none}.grid-stack>.grid-stack-item.ui-resizable-autohide>.ui-resizable-handle,.grid-stack>.grid-stack-item.ui-resizable-disabled>.ui-resizable-handle{display:none}.grid-stack>.grid-stack-item.ui-draggable-dragging,.grid-stack>.grid-stack-item.ui-resizable-resizing{z-index:100}.grid-stack>.grid-stack-item.ui-draggable-dragging>.grid-stack-item-content,.grid-stack>.grid-stack-item.ui-resizable-resizing>.grid-stack-item-content{box-shadow:1px 4px 6px rgba(0,0,0,.2);opacity:.8}.grid-stack>.grid-stack-item>.ui-resizable-se,.grid-stack>.grid-stack-item>.ui-resizable-sw{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMS42MjYgNTExLjYyNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjYyNiA1MTEuNjI3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTMyOC45MDYsNDAxLjk5NGgtMzYuNTUzVjEwOS42MzZoMzYuNTUzYzQuOTQ4LDAsOS4yMzYtMS44MDksMTIuODQ3LTUuNDI2YzMuNjEzLTMuNjE1LDUuNDIxLTcuODk4LDUuNDIxLTEyLjg0NSAgIGMwLTQuOTQ5LTEuODAxLTkuMjMxLTUuNDI4LTEyLjg1MWwtNzMuMDg3LTczLjA5QzI2NS4wNDQsMS44MDksMjYwLjc2LDAsMjU1LjgxMywwYy00Ljk0OCwwLTkuMjI5LDEuODA5LTEyLjg0Nyw1LjQyNCAgIGwtNzMuMDg4LDczLjA5Yy0zLjYxOCwzLjYxOS01LjQyNCw3LjkwMi01LjQyNCwxMi44NTFjMCw0Ljk0NiwxLjgwNyw5LjIyOSw1LjQyNCwxMi44NDVjMy42MTksMy42MTcsNy45MDEsNS40MjYsMTIuODUsNS40MjYgICBoMzYuNTQ1djI5Mi4zNThoLTM2LjU0MmMtNC45NTIsMC05LjIzNSwxLjgwOC0xMi44NSw1LjQyMWMtMy42MTcsMy42MjEtNS40MjQsNy45MDUtNS40MjQsMTIuODU0ICAgYzAsNC45NDUsMS44MDcsOS4yMjcsNS40MjQsMTIuODQ3bDczLjA4OSw3My4wODhjMy42MTcsMy42MTcsNy44OTgsNS40MjQsMTIuODQ3LDUuNDI0YzQuOTUsMCw5LjIzNC0xLjgwNywxMi44NDktNS40MjQgICBsNzMuMDg3LTczLjA4OGMzLjYxMy0zLjYyLDUuNDIxLTcuOTAxLDUuNDIxLTEyLjg0N2MwLTQuOTQ4LTEuODA4LTkuMjMyLTUuNDIxLTEyLjg1NCAgIEMzMzguMTQyLDQwMy44MDIsMzMzLjg1Nyw0MDEuOTk0LDMyOC45MDYsNDAxLjk5NHoiIGZpbGw9IiM2NjY2NjYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);background-repeat:no-repeat;background-position:center;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.grid-stack>.grid-stack-item>.ui-resizable-se{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}.grid-stack>.grid-stack-item>.ui-resizable-nw{cursor:nw-resize;width:20px;height:20px;top:0}.grid-stack>.grid-stack-item>.ui-resizable-n{cursor:n-resize;height:10px;top:0;left:25px;right:25px}.grid-stack>.grid-stack-item>.ui-resizable-ne{cursor:ne-resize;width:20px;height:20px;top:0}.grid-stack>.grid-stack-item>.ui-resizable-e{cursor:e-resize;width:10px;top:15px;bottom:15px}.grid-stack>.grid-stack-item>.ui-resizable-se{cursor:se-resize;width:20px;height:20px}.grid-stack>.grid-stack-item>.ui-resizable-s{cursor:s-resize;height:10px;left:25px;bottom:0;right:25px}.grid-stack>.grid-stack-item>.ui-resizable-sw{cursor:sw-resize;width:20px;height:20px;bottom:0}.grid-stack>.grid-stack-item>.ui-resizable-w{cursor:w-resize;width:10px;top:15px;bottom:15px}.grid-stack>.grid-stack-item.ui-draggable-dragging>.ui-resizable-handle{display:none!important}.grid-stack>.grid-stack-item[gs-w='0']{width:0%}.grid-stack>.grid-stack-item[gs-x='0']{left:0}.grid-stack>.grid-stack-item[gs-min-w='0']{min-width:0}.grid-stack>.grid-stack-item[gs-max-w='0']{max-width:0%}.grid-stack>.grid-stack-item[gs-w='1']{width:8.3333333333%}.grid-stack>.grid-stack-item[gs-x='1']{left:8.3333333333%}.grid-stack>.grid-stack-item[gs-min-w='1']{min-width:8.3333333333%}.grid-stack>.grid-stack-item[gs-max-w='1']{max-width:8.3333333333%}.grid-stack>.grid-stack-item[gs-w='2']{width:16.6666666667%}.grid-stack>.grid-stack-item[gs-x='2']{left:16.6666666667%}.grid-stack>.grid-stack-item[gs-min-w='2']{min-width:16.6666666667%}.grid-stack>.grid-stack-item[gs-max-w='2']{max-width:16.6666666667%}.grid-stack>.grid-stack-item[gs-w='3']{width:25%}.grid-stack>.grid-stack-item[gs-x='3']{left:25%}.grid-stack>.grid-stack-item[gs-min-w='3']{min-width:25%}.grid-stack>.grid-stack-item[gs-max-w='3']{max-width:25%}.grid-stack>.grid-stack-item[gs-w='4']{width:33.3333333333%}.grid-stack>.grid-stack-item[gs-x='4']{left:33.3333333333%}.grid-stack>.grid-stack-item[gs-min-w='4']{min-width:33.3333333333%}.grid-stack>.grid-stack-item[gs-max-w='4']{max-width:33.3333333333%}.grid-stack>.grid-stack-item[gs-w='5']{width:41.6666666667%}.grid-stack>.grid-stack-item[gs-x='5']{left:41.6666666667%}.grid-stack>.grid-stack-item[gs-min-w='5']{min-width:41.6666666667%}.grid-stack>.grid-stack-item[gs-max-w='5']{max-width:41.6666666667%}.grid-stack>.grid-stack-item[gs-w='6']{width:50%}.grid-stack>.grid-stack-item[gs-x='6']{left:50%}.grid-stack>.grid-stack-item[gs-min-w='6']{min-width:50%}.grid-stack>.grid-stack-item[gs-max-w='6']{max-width:50%}.grid-stack>.grid-stack-item[gs-w='7']{width:58.3333333333%}.grid-stack>.grid-stack-item[gs-x='7']{left:58.3333333333%}.grid-stack>.grid-stack-item[gs-min-w='7']{min-width:58.3333333333%}.grid-stack>.grid-stack-item[gs-max-w='7']{max-width:58.3333333333%}.grid-stack>.grid-stack-item[gs-w='8']{width:66.6666666667%}.grid-stack>.grid-stack-item[gs-x='8']{left:66.6666666667%}.grid-stack>.grid-stack-item[gs-min-w='8']{min-width:66.6666666667%}.grid-stack>.grid-stack-item[gs-max-w='8']{max-width:66.6666666667%}.grid-stack>.grid-stack-item[gs-w='9']{width:75%}.grid-stack>.grid-stack-item[gs-x='9']{left:75%}.grid-stack>.grid-stack-item[gs-min-w='9']{min-width:75%}.grid-stack>.grid-stack-item[gs-max-w='9']{max-width:75%}.grid-stack>.grid-stack-item[gs-w='10']{width:83.3333333333%}.grid-stack>.grid-stack-item[gs-x='10']{left:83.3333333333%}.grid-stack>.grid-stack-item[gs-min-w='10']{min-width:83.3333333333%}.grid-stack>.grid-stack-item[gs-max-w='10']{max-width:83.3333333333%}.grid-stack>.grid-stack-item[gs-w='11']{width:91.6666666667%}.grid-stack>.grid-stack-item[gs-x='11']{left:91.6666666667%}.grid-stack>.grid-stack-item[gs-min-w='11']{min-width:91.6666666667%}.grid-stack>.grid-stack-item[gs-max-w='11']{max-width:91.6666666667%}.grid-stack>.grid-stack-item[gs-w='12']{width:100%}.grid-stack>.grid-stack-item[gs-x='12']{left:100%}.grid-stack>.grid-stack-item[gs-min-w='12']{min-width:100%}.grid-stack>.grid-stack-item[gs-max-w='12']{max-width:100%}.grid-stack.grid-stack-1>.grid-stack-item{min-width:100%}.grid-stack.grid-stack-1>.grid-stack-item[gs-w='1']{width:100%}.grid-stack.grid-stack-1>.grid-stack-item[gs-x='1']{left:100%}.grid-stack.grid-stack-1>.grid-stack-item[gs-min-w='1']{min-width:100%}.grid-stack.grid-stack-1>.grid-stack-item[gs-max-w='1']{max-width:100%}.grid-stack.grid-stack-animate,.grid-stack.grid-stack-animate .grid-stack-item{-webkit-transition:left .3s,top .3s,height .3s,width .3s;-moz-transition:left .3s,top .3s,height .3s,width .3s;-ms-transition:left .3s,top .3s,height .3s,width .3s;-o-transition:left .3s,top .3s,height .3s,width .3s;transition:left .3s,top .3s,height .3s,width .3s}.grid-stack.grid-stack-animate .grid-stack-item.grid-stack-placeholder,.grid-stack.grid-stack-animate .grid-stack-item.ui-draggable-dragging,.grid-stack.grid-stack-animate .grid-stack-item.ui-resizable-resizing{-webkit-transition:left 0s,top 0s,height 0s,width 0s;-moz-transition:left 0s,top 0s,height 0s,width 0s;-ms-transition:left 0s,top 0s,height 0s,width 0s;-o-transition:left 0s,top 0s,height 0s,width 0s;transition:left 0s,top 0s,height 0s,width 0s}.grid-stack.ui-droppable.ui-droppable-over>:not(.ui-droppable){pointer-events:none}";

  // node_modules/gridstack/dist/gridstack-extra.min.css
  var gridstack_extra_min_default = ".grid-stack.grid-stack-2>.grid-stack-item{min-width:50%}.grid-stack.grid-stack-2>.grid-stack-item[gs-w='1']{width:50%}.grid-stack.grid-stack-2>.grid-stack-item[gs-x='1']{left:50%}.grid-stack.grid-stack-2>.grid-stack-item[gs-min-w='1']{min-width:50%}.grid-stack.grid-stack-2>.grid-stack-item[gs-max-w='1']{max-width:50%}.grid-stack.grid-stack-2>.grid-stack-item[gs-w='2']{width:100%}.grid-stack.grid-stack-2>.grid-stack-item[gs-x='2']{left:100%}.grid-stack.grid-stack-2>.grid-stack-item[gs-min-w='2']{min-width:100%}.grid-stack.grid-stack-2>.grid-stack-item[gs-max-w='2']{max-width:100%}.grid-stack.grid-stack-3>.grid-stack-item{min-width:33.3333333333%}.grid-stack.grid-stack-3>.grid-stack-item[gs-w='1']{width:33.3333333333%}.grid-stack.grid-stack-3>.grid-stack-item[gs-x='1']{left:33.3333333333%}.grid-stack.grid-stack-3>.grid-stack-item[gs-min-w='1']{min-width:33.3333333333%}.grid-stack.grid-stack-3>.grid-stack-item[gs-max-w='1']{max-width:33.3333333333%}.grid-stack.grid-stack-3>.grid-stack-item[gs-w='2']{width:66.6666666667%}.grid-stack.grid-stack-3>.grid-stack-item[gs-x='2']{left:66.6666666667%}.grid-stack.grid-stack-3>.grid-stack-item[gs-min-w='2']{min-width:66.6666666667%}.grid-stack.grid-stack-3>.grid-stack-item[gs-max-w='2']{max-width:66.6666666667%}.grid-stack.grid-stack-3>.grid-stack-item[gs-w='3']{width:100%}.grid-stack.grid-stack-3>.grid-stack-item[gs-x='3']{left:100%}.grid-stack.grid-stack-3>.grid-stack-item[gs-min-w='3']{min-width:100%}.grid-stack.grid-stack-3>.grid-stack-item[gs-max-w='3']{max-width:100%}.grid-stack.grid-stack-4>.grid-stack-item{min-width:25%}.grid-stack.grid-stack-4>.grid-stack-item[gs-w='1']{width:25%}.grid-stack.grid-stack-4>.grid-stack-item[gs-x='1']{left:25%}.grid-stack.grid-stack-4>.grid-stack-item[gs-min-w='1']{min-width:25%}.grid-stack.grid-stack-4>.grid-stack-item[gs-max-w='1']{max-width:25%}.grid-stack.grid-stack-4>.grid-stack-item[gs-w='2']{width:50%}.grid-stack.grid-stack-4>.grid-stack-item[gs-x='2']{left:50%}.grid-stack.grid-stack-4>.grid-stack-item[gs-min-w='2']{min-width:50%}.grid-stack.grid-stack-4>.grid-stack-item[gs-max-w='2']{max-width:50%}.grid-stack.grid-stack-4>.grid-stack-item[gs-w='3']{width:75%}.grid-stack.grid-stack-4>.grid-stack-item[gs-x='3']{left:75%}.grid-stack.grid-stack-4>.grid-stack-item[gs-min-w='3']{min-width:75%}.grid-stack.grid-stack-4>.grid-stack-item[gs-max-w='3']{max-width:75%}.grid-stack.grid-stack-4>.grid-stack-item[gs-w='4']{width:100%}.grid-stack.grid-stack-4>.grid-stack-item[gs-x='4']{left:100%}.grid-stack.grid-stack-4>.grid-stack-item[gs-min-w='4']{min-width:100%}.grid-stack.grid-stack-4>.grid-stack-item[gs-max-w='4']{max-width:100%}.grid-stack.grid-stack-5>.grid-stack-item{min-width:20%}.grid-stack.grid-stack-5>.grid-stack-item[gs-w='1']{width:20%}.grid-stack.grid-stack-5>.grid-stack-item[gs-x='1']{left:20%}.grid-stack.grid-stack-5>.grid-stack-item[gs-min-w='1']{min-width:20%}.grid-stack.grid-stack-5>.grid-stack-item[gs-max-w='1']{max-width:20%}.grid-stack.grid-stack-5>.grid-stack-item[gs-w='2']{width:40%}.grid-stack.grid-stack-5>.grid-stack-item[gs-x='2']{left:40%}.grid-stack.grid-stack-5>.grid-stack-item[gs-min-w='2']{min-width:40%}.grid-stack.grid-stack-5>.grid-stack-item[gs-max-w='2']{max-width:40%}.grid-stack.grid-stack-5>.grid-stack-item[gs-w='3']{width:60%}.grid-stack.grid-stack-5>.grid-stack-item[gs-x='3']{left:60%}.grid-stack.grid-stack-5>.grid-stack-item[gs-min-w='3']{min-width:60%}.grid-stack.grid-stack-5>.grid-stack-item[gs-max-w='3']{max-width:60%}.grid-stack.grid-stack-5>.grid-stack-item[gs-w='4']{width:80%}.grid-stack.grid-stack-5>.grid-stack-item[gs-x='4']{left:80%}.grid-stack.grid-stack-5>.grid-stack-item[gs-min-w='4']{min-width:80%}.grid-stack.grid-stack-5>.grid-stack-item[gs-max-w='4']{max-width:80%}.grid-stack.grid-stack-5>.grid-stack-item[gs-w='5']{width:100%}.grid-stack.grid-stack-5>.grid-stack-item[gs-x='5']{left:100%}.grid-stack.grid-stack-5>.grid-stack-item[gs-min-w='5']{min-width:100%}.grid-stack.grid-stack-5>.grid-stack-item[gs-max-w='5']{max-width:100%}.grid-stack.grid-stack-6>.grid-stack-item{min-width:16.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-w='1']{width:16.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-x='1']{left:16.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-min-w='1']{min-width:16.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-max-w='1']{max-width:16.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-w='2']{width:33.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-x='2']{left:33.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-min-w='2']{min-width:33.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-max-w='2']{max-width:33.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-w='3']{width:50%}.grid-stack.grid-stack-6>.grid-stack-item[gs-x='3']{left:50%}.grid-stack.grid-stack-6>.grid-stack-item[gs-min-w='3']{min-width:50%}.grid-stack.grid-stack-6>.grid-stack-item[gs-max-w='3']{max-width:50%}.grid-stack.grid-stack-6>.grid-stack-item[gs-w='4']{width:66.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-x='4']{left:66.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-min-w='4']{min-width:66.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-max-w='4']{max-width:66.6666666667%}.grid-stack.grid-stack-6>.grid-stack-item[gs-w='5']{width:83.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-x='5']{left:83.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-min-w='5']{min-width:83.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-max-w='5']{max-width:83.3333333333%}.grid-stack.grid-stack-6>.grid-stack-item[gs-w='6']{width:100%}.grid-stack.grid-stack-6>.grid-stack-item[gs-x='6']{left:100%}.grid-stack.grid-stack-6>.grid-stack-item[gs-min-w='6']{min-width:100%}.grid-stack.grid-stack-6>.grid-stack-item[gs-max-w='6']{max-width:100%}.grid-stack.grid-stack-7>.grid-stack-item{min-width:14.2857142857%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='1']{width:14.2857142857%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='1']{left:14.2857142857%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='1']{min-width:14.2857142857%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='1']{max-width:14.2857142857%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='2']{width:28.5714285714%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='2']{left:28.5714285714%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='2']{min-width:28.5714285714%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='2']{max-width:28.5714285714%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='3']{width:42.8571428571%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='3']{left:42.8571428571%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='3']{min-width:42.8571428571%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='3']{max-width:42.8571428571%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='4']{width:57.1428571429%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='4']{left:57.1428571429%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='4']{min-width:57.1428571429%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='4']{max-width:57.1428571429%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='5']{width:71.4285714286%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='5']{left:71.4285714286%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='5']{min-width:71.4285714286%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='5']{max-width:71.4285714286%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='6']{width:85.7142857143%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='6']{left:85.7142857143%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='6']{min-width:85.7142857143%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='6']{max-width:85.7142857143%}.grid-stack.grid-stack-7>.grid-stack-item[gs-w='7']{width:100%}.grid-stack.grid-stack-7>.grid-stack-item[gs-x='7']{left:100%}.grid-stack.grid-stack-7>.grid-stack-item[gs-min-w='7']{min-width:100%}.grid-stack.grid-stack-7>.grid-stack-item[gs-max-w='7']{max-width:100%}.grid-stack.grid-stack-8>.grid-stack-item{min-width:12.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='1']{width:12.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='1']{left:12.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='1']{min-width:12.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='1']{max-width:12.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='2']{width:25%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='2']{left:25%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='2']{min-width:25%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='2']{max-width:25%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='3']{width:37.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='3']{left:37.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='3']{min-width:37.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='3']{max-width:37.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='4']{width:50%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='4']{left:50%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='4']{min-width:50%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='4']{max-width:50%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='5']{width:62.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='5']{left:62.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='5']{min-width:62.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='5']{max-width:62.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='6']{width:75%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='6']{left:75%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='6']{min-width:75%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='6']{max-width:75%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='7']{width:87.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='7']{left:87.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='7']{min-width:87.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='7']{max-width:87.5%}.grid-stack.grid-stack-8>.grid-stack-item[gs-w='8']{width:100%}.grid-stack.grid-stack-8>.grid-stack-item[gs-x='8']{left:100%}.grid-stack.grid-stack-8>.grid-stack-item[gs-min-w='8']{min-width:100%}.grid-stack.grid-stack-8>.grid-stack-item[gs-max-w='8']{max-width:100%}.grid-stack.grid-stack-9>.grid-stack-item{min-width:11.1111111111%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='1']{width:11.1111111111%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='1']{left:11.1111111111%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='1']{min-width:11.1111111111%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='1']{max-width:11.1111111111%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='2']{width:22.2222222222%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='2']{left:22.2222222222%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='2']{min-width:22.2222222222%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='2']{max-width:22.2222222222%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='3']{width:33.3333333333%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='3']{left:33.3333333333%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='3']{min-width:33.3333333333%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='3']{max-width:33.3333333333%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='4']{width:44.4444444444%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='4']{left:44.4444444444%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='4']{min-width:44.4444444444%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='4']{max-width:44.4444444444%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='5']{width:55.5555555556%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='5']{left:55.5555555556%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='5']{min-width:55.5555555556%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='5']{max-width:55.5555555556%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='6']{width:66.6666666667%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='6']{left:66.6666666667%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='6']{min-width:66.6666666667%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='6']{max-width:66.6666666667%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='7']{width:77.7777777778%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='7']{left:77.7777777778%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='7']{min-width:77.7777777778%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='7']{max-width:77.7777777778%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='8']{width:88.8888888889%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='8']{left:88.8888888889%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='8']{min-width:88.8888888889%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='8']{max-width:88.8888888889%}.grid-stack.grid-stack-9>.grid-stack-item[gs-w='9']{width:100%}.grid-stack.grid-stack-9>.grid-stack-item[gs-x='9']{left:100%}.grid-stack.grid-stack-9>.grid-stack-item[gs-min-w='9']{min-width:100%}.grid-stack.grid-stack-9>.grid-stack-item[gs-max-w='9']{max-width:100%}.grid-stack.grid-stack-10>.grid-stack-item{min-width:10%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='1']{width:10%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='1']{left:10%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='1']{min-width:10%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='1']{max-width:10%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='2']{width:20%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='2']{left:20%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='2']{min-width:20%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='2']{max-width:20%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='3']{width:30%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='3']{left:30%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='3']{min-width:30%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='3']{max-width:30%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='4']{width:40%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='4']{left:40%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='4']{min-width:40%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='4']{max-width:40%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='5']{width:50%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='5']{left:50%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='5']{min-width:50%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='5']{max-width:50%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='6']{width:60%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='6']{left:60%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='6']{min-width:60%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='6']{max-width:60%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='7']{width:70%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='7']{left:70%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='7']{min-width:70%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='7']{max-width:70%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='8']{width:80%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='8']{left:80%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='8']{min-width:80%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='8']{max-width:80%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='9']{width:90%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='9']{left:90%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='9']{min-width:90%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='9']{max-width:90%}.grid-stack.grid-stack-10>.grid-stack-item[gs-w='10']{width:100%}.grid-stack.grid-stack-10>.grid-stack-item[gs-x='10']{left:100%}.grid-stack.grid-stack-10>.grid-stack-item[gs-min-w='10']{min-width:100%}.grid-stack.grid-stack-10>.grid-stack-item[gs-max-w='10']{max-width:100%}.grid-stack.grid-stack-11>.grid-stack-item{min-width:9.0909090909%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='1']{width:9.0909090909%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='1']{left:9.0909090909%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='1']{min-width:9.0909090909%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='1']{max-width:9.0909090909%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='2']{width:18.1818181818%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='2']{left:18.1818181818%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='2']{min-width:18.1818181818%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='2']{max-width:18.1818181818%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='3']{width:27.2727272727%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='3']{left:27.2727272727%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='3']{min-width:27.2727272727%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='3']{max-width:27.2727272727%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='4']{width:36.3636363636%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='4']{left:36.3636363636%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='4']{min-width:36.3636363636%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='4']{max-width:36.3636363636%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='5']{width:45.4545454545%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='5']{left:45.4545454545%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='5']{min-width:45.4545454545%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='5']{max-width:45.4545454545%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='6']{width:54.5454545455%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='6']{left:54.5454545455%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='6']{min-width:54.5454545455%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='6']{max-width:54.5454545455%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='7']{width:63.6363636364%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='7']{left:63.6363636364%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='7']{min-width:63.6363636364%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='7']{max-width:63.6363636364%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='8']{width:72.7272727273%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='8']{left:72.7272727273%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='8']{min-width:72.7272727273%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='8']{max-width:72.7272727273%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='9']{width:81.8181818182%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='9']{left:81.8181818182%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='9']{min-width:81.8181818182%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='9']{max-width:81.8181818182%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='10']{width:90.9090909091%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='10']{left:90.9090909091%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='10']{min-width:90.9090909091%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='10']{max-width:90.9090909091%}.grid-stack.grid-stack-11>.grid-stack-item[gs-w='11']{width:100%}.grid-stack.grid-stack-11>.grid-stack-item[gs-x='11']{left:100%}.grid-stack.grid-stack-11>.grid-stack-item[gs-min-w='11']{min-width:100%}.grid-stack.grid-stack-11>.grid-stack-item[gs-max-w='11']{max-width:100%}";

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
      this.worker = new Worker("idomworkernats.js");
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
      s.innerHTML = tasmota_default + "\n" + gridstack_min_default + "\n" + gridstack_extra_min_default;
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
      this.netstat = this.toolbar.appendChild(new iIcon("wifioff", 24, 24, () => {
        console.log(this.grid.save().map((e) => {
          return {...e, content: void 0};
        }));
      }));
      this.logout = this.toolbar.appendChild(new iIcon("logout", 24, 24, () => {
        this.worker.postMessage({action: "logout"});
      }));
      this.connect();
      this.buildGrid();
    }
    resizeGrid() {
      let width = document.body.clientWidth;
      let layout = "move";
      if (width < 400) {
        this.grid.column(1, layout).cellHeight("150px");
      } else if (width < 700) {
        this.grid.column(1, layout).cellHeight("100px");
      } else if (width < 850) {
        this.grid.column(3, layout).cellHeight("100px");
      } else if (width < 950) {
        this.grid.column(6, layout).cellHeight("100px");
      } else if (width < 1100) {
        this.grid.column(8, layout).cellHeight("100px");
      } else {
        this.grid.column(12, layout).cellHeight("100px");
      }
    }
    buildGrid() {
      this.gridNode = this.appendChild(document.createElement("div"));
      this.gridNode.className = "grid-stack";
      this.grid = import_gridstack.GridStack.init({
        disableDrag: false,
        alwaysShowResizeHandle: true,
        disableOneColumnMode: true,
        cellHeight: "initial",
        float: true
      }, this.gridNode);
      this.grid.load([]);
      this.resizeGrid();
      window.addEventListener("resize", () => {
        this.resizeGrid();
      });
    }
    connect() {
      if (localStorage.getItem("idom_username") && localStorage.getItem("idom_password")) {
        this.worker.postMessage({action: "connect", url: localStorage.getItem("idom_url") || "ws://" + location.host, username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password")});
      } else {
        this.loginDialog();
      }
    }
    _addWidget(name, dev) {
      const tmp = document.createElement("div");
      tmp.className = "grid-stack-item";
      tmp.innerHTML = `<div class="grid-stack-item-content"></div>`;
      this.wdevs[name] = tmp.firstChild.appendChild(dev);
      this.wdevs[name].setOrder(Number(localStorage.getItem("idom_order|" + name) || this.lastOrder));
      this.lastOrder = localStorage.getItem("idom_order|" + name) && Number(localStorage.getItem("idom_order|" + name)) > this.lastOrder ? Number(localStorage.getItem("idom_order|" + name)) + 1 : this.lastOrder + 1;
      this.wdevs[name].className = "idom-device";
      this.grid.addWidget(tmp, {w: 3, h: 2, id: name});
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
              this._addWidget(name, new iDevCam(name, this));
              break;
            default:
              this._addWidget(name, new iDev(name, this));
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
