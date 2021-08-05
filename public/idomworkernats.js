(() => {
  // node_modules/nats.ws/nats.js
  var Empty1 = new Uint8Array(0);
  var Events1;
  (function(Events12) {
    Events12["Disconnect"] = "disconnect";
    Events12["Reconnect"] = "reconnect";
    Events12["Update"] = "update";
    Events12["LDM"] = "ldm";
    Events12["Error"] = "error";
  })(Events1 || (Events1 = {}));
  var DebugEvents1;
  (function(DebugEvents12) {
    DebugEvents12["Reconnecting"] = "reconnecting";
    DebugEvents12["PingTimer"] = "pingTimer";
    DebugEvents12["StaleConnection"] = "staleConnection";
  })(DebugEvents1 || (DebugEvents1 = {}));
  var DEFAULT_PORT = 4222;
  var DEFAULT_HOST = "127.0.0.1";
  var DEFAULT_RECONNECT_TIME_WAIT = 2 * 1e3;
  var DEFAULT_PING_INTERVAL = 2 * 60 * 1e3;
  var DEFAULT_MAX_PING_OUT = 2;
  var AdvisoryKind1;
  (function(AdvisoryKind12) {
    AdvisoryKind12["API"] = "api_audit";
    AdvisoryKind12["StreamAction"] = "stream_action";
    AdvisoryKind12["ConsumerAction"] = "consumer_action";
    AdvisoryKind12["SnapshotCreate"] = "snapshot_create";
    AdvisoryKind12["SnapshotComplete"] = "snapshot_complete";
    AdvisoryKind12["RestoreCreate"] = "restore_create";
    AdvisoryKind12["RestoreComplete"] = "restore_complete";
    AdvisoryKind12["MaxDeliver"] = "max_deliver";
    AdvisoryKind12["Terminated"] = "terminated";
    AdvisoryKind12["Ack"] = "consumer_ack";
    AdvisoryKind12["StreamLeaderElected"] = "stream_leader_elected";
    AdvisoryKind12["StreamQuorumLost"] = "stream_quorum_lost";
    AdvisoryKind12["ConsumerLeaderElected"] = "consumer_leader_elected";
    AdvisoryKind12["ConsumerQuorumLost"] = "consumer_quorum_lost";
  })(AdvisoryKind1 || (AdvisoryKind1 = {}));
  var RetentionPolicy1;
  (function(RetentionPolicy12) {
    RetentionPolicy12["Limits"] = "limits";
    RetentionPolicy12["Interest"] = "interest";
    RetentionPolicy12["Workqueue"] = "workqueue";
  })(RetentionPolicy1 || (RetentionPolicy1 = {}));
  var DiscardPolicy1;
  (function(DiscardPolicy12) {
    DiscardPolicy12["Old"] = "old";
    DiscardPolicy12["New"] = "new";
  })(DiscardPolicy1 || (DiscardPolicy1 = {}));
  var StorageType1;
  (function(StorageType12) {
    StorageType12["File"] = "file";
    StorageType12["Memory"] = "memory";
  })(StorageType1 || (StorageType1 = {}));
  var DeliverPolicy1;
  (function(DeliverPolicy12) {
    DeliverPolicy12["All"] = "all";
    DeliverPolicy12["Last"] = "last";
    DeliverPolicy12["New"] = "new";
    DeliverPolicy12["StartSequence"] = "by_start_sequence";
    DeliverPolicy12["StartTime"] = "by_start_time";
  })(DeliverPolicy1 || (DeliverPolicy1 = {}));
  var AckPolicy1;
  (function(AckPolicy12) {
    AckPolicy12["None"] = "none";
    AckPolicy12["All"] = "all";
    AckPolicy12["Explicit"] = "explicit";
    AckPolicy12["NotSet"] = "";
  })(AckPolicy1 || (AckPolicy1 = {}));
  var ReplayPolicy1;
  (function(ReplayPolicy12) {
    ReplayPolicy12["Instant"] = "instant";
    ReplayPolicy12["Original"] = "original";
  })(ReplayPolicy1 || (ReplayPolicy1 = {}));
  var JsHeaders1;
  (function(JsHeaders12) {
    JsHeaders12["StreamSourceHdr"] = "Nats-Stream-Source";
    JsHeaders12["LastConsumerSeqHdr"] = "Nats-Last-Consumer";
    JsHeaders12["LastStreamSeqHdr"] = "Nats-Last-Stream";
  })(JsHeaders1 || (JsHeaders1 = {}));
  var TE1 = new TextEncoder();
  var TD1 = new TextDecoder();
  function fastEncoder(...a) {
    let len = 0;
    for (let i = 0; i < a.length; i++) {
      len += a[i] ? a[i].length : 0;
    }
    if (len === 0) {
      return Empty1;
    }
    const buf = new Uint8Array(len);
    let c = 0;
    for (let i1 = 0; i1 < a.length; i1++) {
      const s = a[i1];
      if (s) {
        for (let j = 0; j < s.length; j++) {
          buf[c] = s.charCodeAt(j);
          c++;
        }
      }
    }
    return buf;
  }
  function fastDecoder(a) {
    if (!a || a.length === 0) {
      return "";
    }
    return String.fromCharCode(...a);
  }
  var DataBuffer1 = class {
    buffers;
    byteLength;
    constructor() {
      this.buffers = [];
      this.byteLength = 0;
    }
    static concat(...bufs) {
      let max = 0;
      for (let i = 0; i < bufs.length; i++) {
        max += bufs[i].length;
      }
      const out = new Uint8Array(max);
      let index = 0;
      for (let i1 = 0; i1 < bufs.length; i1++) {
        out.set(bufs[i1], index);
        index += bufs[i1].length;
      }
      return out;
    }
    static fromAscii(m) {
      if (!m) {
        m = "";
      }
      return TE1.encode(m);
    }
    static toAscii(a) {
      return TD1.decode(a);
    }
    reset() {
      this.buffers.length = 0;
      this.byteLength = 0;
    }
    pack() {
      if (this.buffers.length > 1) {
        const v = new Uint8Array(this.byteLength);
        let index = 0;
        for (let i = 0; i < this.buffers.length; i++) {
          v.set(this.buffers[i], index);
          index += this.buffers[i].length;
        }
        this.buffers.length = 0;
        this.buffers.push(v);
      }
    }
    drain(n) {
      if (this.buffers.length) {
        this.pack();
        const v = this.buffers.pop();
        if (v) {
          const max = this.byteLength;
          if (n === void 0 || n > max) {
            n = max;
          }
          const d = v.subarray(0, n);
          if (max > n) {
            this.buffers.push(v.subarray(n));
          }
          this.byteLength = max - n;
          return d;
        }
      }
      return new Uint8Array(0);
    }
    fill(a, ...bufs) {
      if (a) {
        this.buffers.push(a);
        this.byteLength += a.length;
      }
      for (let i = 0; i < bufs.length; i++) {
        if (bufs[i] && bufs[i].length) {
          this.buffers.push(bufs[i]);
          this.byteLength += bufs[i].length;
        }
      }
    }
    peek() {
      if (this.buffers.length) {
        this.pack();
        return this.buffers[0];
      }
      return new Uint8Array(0);
    }
    size() {
      return this.byteLength;
    }
    length() {
      return this.buffers.length;
    }
  };
  var ErrorCode1;
  (function(ErrorCode12) {
    ErrorCode12["ApiError"] = "BAD API";
    ErrorCode12["BadAuthentication"] = "BAD_AUTHENTICATION";
    ErrorCode12["BadCreds"] = "BAD_CREDS";
    ErrorCode12["BadHeader"] = "BAD_HEADER";
    ErrorCode12["BadJson"] = "BAD_JSON";
    ErrorCode12["BadPayload"] = "BAD_PAYLOAD";
    ErrorCode12["BadSubject"] = "BAD_SUBJECT";
    ErrorCode12["Cancelled"] = "CANCELLED";
    ErrorCode12["ConnectionClosed"] = "CONNECTION_CLOSED";
    ErrorCode12["ConnectionDraining"] = "CONNECTION_DRAINING";
    ErrorCode12["ConnectionRefused"] = "CONNECTION_REFUSED";
    ErrorCode12["ConnectionTimeout"] = "CONNECTION_TIMEOUT";
    ErrorCode12["Disconnect"] = "DISCONNECT";
    ErrorCode12["InvalidOption"] = "INVALID_OPTION";
    ErrorCode12["InvalidPayload"] = "INVALID_PAYLOAD";
    ErrorCode12["MaxPayloadExceeded"] = "MAX_PAYLOAD_EXCEEDED";
    ErrorCode12["NoResponders"] = "503";
    ErrorCode12["NotFunction"] = "NOT_FUNC";
    ErrorCode12["RequestError"] = "REQUEST_ERROR";
    ErrorCode12["ServerOptionNotAvailable"] = "SERVER_OPT_NA";
    ErrorCode12["SubClosed"] = "SUB_CLOSED";
    ErrorCode12["SubDraining"] = "SUB_DRAINING";
    ErrorCode12["Timeout"] = "TIMEOUT";
    ErrorCode12["Tls"] = "TLS";
    ErrorCode12["Unknown"] = "UNKNOWN_ERROR";
    ErrorCode12["WssRequired"] = "WSS_REQUIRED";
    ErrorCode12["JetStreamInvalidAck"] = "JESTREAM_INVALID_ACK";
    ErrorCode12["JetStream404NoMessages"] = "404";
    ErrorCode12["JetStream408RequestTimeout"] = "408";
    ErrorCode12["JetStream409MaxAckPendingExceeded"] = "409";
    ErrorCode12["JetStreamNotEnabled"] = "503";
    ErrorCode12["AuthorizationViolation"] = "AUTHORIZATION_VIOLATION";
    ErrorCode12["AuthenticationExpired"] = "AUTHENTICATION_EXPIRED";
    ErrorCode12["ProtocolError"] = "NATS_PROTOCOL_ERR";
    ErrorCode12["PermissionsViolation"] = "PERMISSIONS_VIOLATION";
  })(ErrorCode1 || (ErrorCode1 = {}));
  var Messages = class {
    messages;
    constructor() {
      this.messages = new Map();
      this.messages.set(ErrorCode1.InvalidPayload, "Invalid payload type - payloads can be 'binary', 'string', or 'json'");
      this.messages.set(ErrorCode1.BadJson, "Bad JSON");
      this.messages.set(ErrorCode1.WssRequired, "TLS is required, therefore a secure websocket connection is also required");
    }
    static getMessage(s) {
      return messages.getMessage(s);
    }
    getMessage(s) {
      return this.messages.get(s) || s;
    }
  };
  var messages = new Messages();
  function isNatsError(err) {
    return typeof err.code === "string";
  }
  var NatsError1 = class extends Error {
    name;
    message;
    code;
    chainedError;
    constructor(message, code1, chainedError1) {
      super(message);
      this.name = "NatsError";
      this.message = message;
      this.code = code1;
      this.chainedError = chainedError1;
    }
    static errorForCode(code, chainedError) {
      const m = Messages.getMessage(code);
      return new NatsError1(m, code, chainedError);
    }
    isAuthError() {
      return this.code === ErrorCode1.AuthenticationExpired || this.code === ErrorCode1.AuthorizationViolation;
    }
    isPermissionError() {
      return this.code === ErrorCode1.PermissionsViolation;
    }
    isProtocolError() {
      return this.code === ErrorCode1.ProtocolError;
    }
  };
  var CR_LF = "\r\n";
  var CRLF = DataBuffer1.fromAscii(CR_LF);
  var CR = new Uint8Array(CRLF)[0];
  var LF = new Uint8Array(CRLF)[1];
  function isUint8Array(a) {
    return a instanceof Uint8Array;
  }
  function protoLen(ba) {
    for (let i = 0; i < ba.length; i++) {
      const n = i + 1;
      if (ba.byteLength > n && ba[i] === CR && ba[n] === LF) {
        return n + 1;
      }
    }
    return -1;
  }
  function extractProtocolMessage1(a) {
    const len = protoLen(a);
    if (len) {
      const ba = new Uint8Array(a);
      const out = ba.slice(0, len);
      return TD1.decode(out);
    }
    return "";
  }
  function extend1(a, ...b) {
    for (let i = 0; i < b.length; i++) {
      const o = b[i];
      Object.keys(o).forEach(function(k) {
        a[k] = o[k];
      });
    }
    return a;
  }
  function render1(frame) {
    const cr = "\u240D";
    const lf = "\u240A";
    return TD1.decode(frame).replace(/\n/g, lf).replace(/\r/g, cr);
  }
  function timeout1(ms) {
    let methods;
    let timer;
    const p = new Promise((_resolve, reject) => {
      const cancel = () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
      methods = {
        cancel
      };
      timer = setTimeout(() => {
        reject(NatsError1.errorForCode(ErrorCode1.Timeout));
      }, ms);
    });
    return Object.assign(p, methods);
  }
  function delay1(ms = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
  function deferred1() {
    let methods = {};
    const p = new Promise((resolve, reject) => {
      methods = {
        resolve,
        reject
      };
    });
    return Object.assign(p, methods);
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [
        a[j],
        a[i]
      ];
    }
    return a;
  }
  function canonicalMIMEHeaderKey1(k) {
    const a = 97;
    const A2 = 65;
    const Z2 = 90;
    const z = 122;
    const dash = 45;
    const colon = 58;
    const start = 33;
    const end = 126;
    const toLower = 97 - 65;
    let upper = true;
    const buf = new Array(k.length);
    for (let i = 0; i < k.length; i++) {
      let c = k.charCodeAt(i);
      if (c === 58 || c < 33 || c > 126) {
        throw new NatsError1(`'${k[i]}' is not a valid character for a header key`, ErrorCode1.BadHeader);
      }
      if (upper && 97 <= c && c <= 122) {
        c -= toLower;
      } else if (!upper && 65 <= c && c <= 90) {
        c += toLower;
      }
      buf[i] = c;
      upper = c == dash;
    }
    return String.fromCharCode(...buf);
  }
  function headers1() {
    return new MsgHdrsImpl1();
  }
  var HEADER = "NATS/1.0";
  var Match1;
  (function(Match12) {
    Match12[Match12["Exact"] = 0] = "Exact";
    Match12[Match12["CanonicalMIME"] = 1] = "CanonicalMIME";
    Match12[Match12["IgnoreCase"] = 2] = "IgnoreCase";
  })(Match1 || (Match1 = {}));
  var MsgHdrsImpl1 = class {
    code;
    headers;
    description;
    constructor() {
      this.code = 0;
      this.headers = new Map();
      this.description = "";
    }
    [Symbol.iterator]() {
      return this.headers.entries();
    }
    size() {
      return this.headers.size;
    }
    equals(mh) {
      if (mh && this.headers.size === mh.headers.size && this.code === mh.code) {
        for (const [k, v] of this.headers) {
          const a = mh.values(k);
          if (v.length !== a.length) {
            return false;
          }
          const vv = [
            ...v
          ].sort();
          const aa = [
            ...a
          ].sort();
          for (let i = 0; i < vv.length; i++) {
            if (vv[i] !== aa[i]) {
              return false;
            }
          }
        }
        return true;
      }
      return false;
    }
    static decode(a) {
      const mh = new MsgHdrsImpl1();
      const s = TD1.decode(a);
      const lines = s.split("\r\n");
      const h = lines[0];
      if (h !== HEADER) {
        let str = h.replace(HEADER, "");
        mh.code = parseInt(str, 10);
        const scode = mh.code.toString();
        str = str.replace(scode, "");
        mh.description = str.trim();
      }
      if (lines.length >= 1) {
        lines.slice(1).map((s1) => {
          if (s1) {
            const idx = s1.indexOf(":");
            if (idx > -1) {
              const k = s1.slice(0, idx);
              const v = s1.slice(idx + 1).trim();
              mh.append(k, v);
            }
          }
        });
      }
      return mh;
    }
    toString() {
      if (this.headers.size === 0) {
        return "";
      }
      let s = HEADER;
      for (const [k, v] of this.headers) {
        for (let i = 0; i < v.length; i++) {
          s = `${s}\r
${k}: ${v[i]}`;
        }
      }
      return `${s}\r
\r
`;
    }
    encode() {
      return TE1.encode(this.toString());
    }
    static validHeaderValue(k) {
      const inv = /[\r\n]/;
      if (inv.test(k)) {
        throw new NatsError1("invalid header value - \\r and \\n are not allowed.", ErrorCode1.BadHeader);
      }
      return k.trim();
    }
    keys() {
      const keys = [];
      for (const sk of this.headers.keys()) {
        keys.push(sk);
      }
      return keys;
    }
    findKeys(k, match = Match1.Exact) {
      const keys = this.keys();
      switch (match) {
        case Match1.Exact:
          return keys.filter((v) => {
            return v === k;
          });
        case Match1.CanonicalMIME:
          k = canonicalMIMEHeaderKey1(k);
          return keys.filter((v) => {
            return v === k;
          });
        default: {
          const lci = k.toLowerCase();
          return keys.filter((v) => {
            return lci === v.toLowerCase();
          });
        }
      }
    }
    get(k, match = Match1.Exact) {
      const keys = this.findKeys(k, match);
      if (keys.length) {
        const v = this.headers.get(keys[0]);
        if (v) {
          return Array.isArray(v) ? v[0] : v;
        }
      }
      return "";
    }
    has(k, match = Match1.Exact) {
      return this.findKeys(k, match).length > 0;
    }
    set(k, v, match = Match1.Exact) {
      this.delete(k, match);
      this.append(k, v, match);
    }
    append(k, v, match = Match1.Exact) {
      const ck = canonicalMIMEHeaderKey1(k);
      if (match === Match1.CanonicalMIME) {
        k = ck;
      }
      const keys = this.findKeys(k, match);
      k = keys.length > 0 ? keys[0] : k;
      const value = MsgHdrsImpl1.validHeaderValue(v);
      let a = this.headers.get(k);
      if (!a) {
        a = [];
        this.headers.set(k, a);
      }
      a.push(value);
    }
    values(k, match = Match1.Exact) {
      const buf = [];
      const keys = this.findKeys(k, match);
      keys.forEach((v) => {
        const values = this.headers.get(v);
        if (values) {
          buf.push(...values);
        }
      });
      return buf;
    }
    delete(k, match = Match1.Exact) {
      const keys = this.findKeys(k, match);
      keys.forEach((v) => {
        this.headers.delete(v);
      });
    }
    get hasError() {
      return this.code >= 300;
    }
    get status() {
      return `${this.code} ${this.description}`.trim();
    }
  };
  function isRequestError(msg) {
    if (msg && msg.headers) {
      const headers2 = msg.headers;
      if (headers2.hasError) {
        if (headers2.code === 503) {
          return NatsError1.errorForCode(ErrorCode1.NoResponders);
        } else {
          let desc = headers2.description;
          if (desc === "") {
            desc = ErrorCode1.RequestError;
          }
          desc = desc.toLowerCase();
          return new NatsError1(desc, headers2.status);
        }
      }
    }
    return null;
  }
  var MsgImpl1 = class {
    _headers;
    _msg;
    _rdata;
    _reply;
    _subject;
    publisher;
    constructor(msg1, data1, publisher1) {
      this._msg = msg1;
      this._rdata = data1;
      this.publisher = publisher1;
    }
    get subject() {
      if (this._subject) {
        return this._subject;
      }
      this._subject = TD1.decode(this._msg.subject);
      return this._subject;
    }
    get reply() {
      if (this._reply) {
        return this._reply;
      }
      this._reply = TD1.decode(this._msg.reply);
      return this._reply;
    }
    get sid() {
      return this._msg.sid;
    }
    get headers() {
      if (this._msg.hdr > -1 && !this._headers) {
        const buf = this._rdata.subarray(0, this._msg.hdr);
        this._headers = MsgHdrsImpl1.decode(buf);
      }
      return this._headers;
    }
    get data() {
      if (!this._rdata) {
        return new Uint8Array(0);
      }
      return this._msg.hdr > -1 ? this._rdata.subarray(this._msg.hdr) : this._rdata;
    }
    respond(data = Empty1, opts) {
      if (this.reply) {
        this.publisher.publish(this.reply, data, opts);
        return true;
      }
      return false;
    }
  };
  var transportConfig;
  function setTransportFactory1(config) {
    transportConfig = config;
  }
  function defaultPort() {
    return transportConfig !== void 0 && transportConfig.defaultPort !== void 0 ? transportConfig.defaultPort : 4222;
  }
  function getUrlParseFn() {
    return transportConfig !== void 0 && transportConfig.urlParseFn ? transportConfig.urlParseFn : void 0;
  }
  function newTransport() {
    if (!transportConfig || typeof transportConfig.factory !== "function") {
      throw new Error("transport fn is not set");
    }
    return transportConfig.factory();
  }
  var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var base = 36;
  var maxSeq = 3656158440062976;
  var minInc = 33;
  var maxInc = 333;
  var totalLen = 12 + 10;
  var cryptoObj = initCrypto();
  function initCrypto() {
    let cryptoObj1 = null;
    if (typeof globalThis !== "undefined") {
      if ("crypto" in globalThis && globalThis.crypto.getRandomValues) {
        cryptoObj1 = globalThis.crypto;
      }
    }
    if (!cryptoObj1) {
      cryptoObj1 = {
        getRandomValues: function(array) {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 255);
          }
        }
      };
    }
    return cryptoObj1;
  }
  var Nuid1 = class {
    buf;
    seq;
    inc;
    constructor() {
      this.buf = new Uint8Array(totalLen);
      this.init();
    }
    init() {
      this.setPre();
      this.initSeqAndInc();
      this.fillSeq();
    }
    initSeqAndInc() {
      this.seq = Math.floor(Math.random() * maxSeq);
      this.inc = Math.floor(Math.random() * (maxInc - minInc) + minInc);
    }
    setPre() {
      const cbuf = new Uint8Array(12);
      cryptoObj.getRandomValues(cbuf);
      for (let i = 0; i < 12; i++) {
        const di = cbuf[i] % 36;
        this.buf[i] = digits.charCodeAt(di);
      }
    }
    fillSeq() {
      let n = this.seq;
      for (let i = totalLen - 1; i >= 12; i--) {
        this.buf[i] = digits.charCodeAt(n % base);
        n = Math.floor(n / base);
      }
    }
    next() {
      this.seq += this.inc;
      if (this.seq > 3656158440062976) {
        this.setPre();
        this.initSeqAndInc();
      }
      this.fillSeq();
      return String.fromCharCode.apply(String, this.buf);
    }
    reset() {
      this.init();
    }
  };
  var nuid1 = new Nuid1();
  var IPv4LEN = 4;
  var ASCII0 = 48;
  var ASCIIA = 65;
  var ASCIIa = 97;
  function ipV4(a, b, c, d) {
    const ip = new Uint8Array(16);
    const prefix = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      255,
      255
    ];
    prefix.forEach((v, idx) => {
      ip[idx] = v;
    });
    ip[12] = a;
    ip[13] = b;
    ip[14] = c;
    ip[15] = d;
    return ip;
  }
  function isIP1(h) {
    return parseIP1(h) !== void 0;
  }
  function parseIP1(h) {
    for (let i = 0; i < h.length; i++) {
      switch (h[i]) {
        case ".":
          return parseIPv4(h);
        case ":":
          return parseIPv6(h);
      }
    }
    return;
  }
  function parseIPv4(s) {
    const ip = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
      if (s.length === 0) {
        return void 0;
      }
      if (i > 0) {
        if (s[0] !== ".") {
          return void 0;
        }
        s = s.substring(1);
      }
      const { n, c, ok } = dtoi(s);
      if (!ok || n > 255) {
        return void 0;
      }
      s = s.substring(c);
      ip[i] = n;
    }
    return ipV4(ip[0], ip[1], ip[2], ip[3]);
  }
  function parseIPv6(s) {
    const ip = new Uint8Array(16);
    let ellipsis = -1;
    if (s.length >= 2 && s[0] === ":" && s[1] === ":") {
      ellipsis = 0;
      s = s.substring(2);
      if (s.length === 0) {
        return ip;
      }
    }
    let i = 0;
    while (i < 16) {
      const { n, c, ok } = xtoi(s);
      if (!ok || n > 65535) {
        return void 0;
      }
      if (c < s.length && s[c] === ".") {
        if (ellipsis < 0 && i != 16 - 4) {
          return void 0;
        }
        if (i + 4 > 16) {
          return void 0;
        }
        const ip4 = parseIPv4(s);
        if (ip4 === void 0) {
          return void 0;
        }
        ip[i] = ip4[12];
        ip[i + 1] = ip4[13];
        ip[i + 2] = ip4[14];
        ip[i + 3] = ip4[15];
        s = "";
        i += IPv4LEN;
        break;
      }
      ip[i] = n >> 8;
      ip[i + 1] = n;
      i += 2;
      s = s.substring(c);
      if (s.length === 0) {
        break;
      }
      if (s[0] !== ":" || s.length == 1) {
        return void 0;
      }
      s = s.substring(1);
      if (s[0] === ":") {
        if (ellipsis >= 0) {
          return void 0;
        }
        ellipsis = i;
        s = s.substring(1);
        if (s.length === 0) {
          break;
        }
      }
    }
    if (s.length !== 0) {
      return void 0;
    }
    if (i < 16) {
      if (ellipsis < 0) {
        return void 0;
      }
      const n = 16 - i;
      for (let j = i - 1; j >= ellipsis; j--) {
        ip[j + n] = ip[j];
      }
      for (let j1 = ellipsis + n - 1; j1 >= ellipsis; j1--) {
        ip[j1] = 0;
      }
    } else if (ellipsis >= 0) {
      return void 0;
    }
    return ip;
  }
  function dtoi(s) {
    let i = 0;
    let n = 0;
    for (i = 0; i < s.length && 48 <= s.charCodeAt(i) && s.charCodeAt(i) <= 57; i++) {
      n = n * 10 + (s.charCodeAt(i) - ASCII0);
      if (n >= 16777215) {
        return {
          n: 16777215,
          c: i,
          ok: false
        };
      }
    }
    if (i === 0) {
      return {
        n: 0,
        c: 0,
        ok: false
      };
    }
    return {
      n,
      c: i,
      ok: true
    };
  }
  function xtoi(s) {
    let n = 0;
    let i = 0;
    for (i = 0; i < s.length; i++) {
      if (48 <= s.charCodeAt(i) && s.charCodeAt(i) <= 57) {
        n *= 16;
        n += s.charCodeAt(i) - ASCII0;
      } else if (97 <= s.charCodeAt(i) && s.charCodeAt(i) <= 102) {
        n *= 16;
        n += s.charCodeAt(i) - ASCIIa + 10;
      } else if (65 <= s.charCodeAt(i) && s.charCodeAt(i) <= 70) {
        n *= 16;
        n += s.charCodeAt(i) - ASCIIA + 10;
      } else {
        break;
      }
      if (n >= 16777215) {
        return {
          n: 0,
          c: i,
          ok: false
        };
      }
    }
    if (i === 0) {
      return {
        n: 0,
        c: i,
        ok: false
      };
    }
    return {
      n,
      c: i,
      ok: true
    };
  }
  var ServerImpl = class {
    src;
    listen;
    hostname;
    port;
    didConnect;
    reconnects;
    lastConnect;
    gossiped;
    tlsName;
    constructor(u1, gossiped = false) {
      this.src = u1;
      this.tlsName = "";
      if (u1.match(/^(.*:\/\/)(.*)/m)) {
        u1 = u1.replace(/^(.*:\/\/)(.*)/gm, "$2");
      }
      const url = new URL(`http://${u1}`);
      if (!url.port) {
        url.port = `${DEFAULT_PORT}`;
      }
      this.listen = url.host;
      this.hostname = url.hostname;
      this.port = parseInt(url.port, 10);
      this.didConnect = false;
      this.reconnects = 0;
      this.lastConnect = 0;
      this.gossiped = gossiped;
    }
    toString() {
      return this.listen;
    }
  };
  var Servers = class {
    firstSelect;
    servers;
    currentServer;
    tlsName;
    constructor(randomize, listens = []) {
      this.firstSelect = true;
      this.servers = [];
      this.tlsName = "";
      const urlParseFn = getUrlParseFn();
      if (listens) {
        listens.forEach((hp) => {
          hp = urlParseFn ? urlParseFn(hp) : hp;
          this.servers.push(new ServerImpl(hp));
        });
        if (randomize) {
          this.servers = shuffle(this.servers);
        }
      }
      if (this.servers.length === 0) {
        this.addServer(`${DEFAULT_HOST}:${defaultPort()}`, false);
      }
      this.currentServer = this.servers[0];
    }
    updateTLSName() {
      const cs = this.getCurrentServer();
      if (!isIP1(cs.hostname)) {
        this.tlsName = cs.hostname;
        this.servers.forEach((s) => {
          if (s.gossiped) {
            s.tlsName = this.tlsName;
          }
        });
      }
    }
    getCurrentServer() {
      return this.currentServer;
    }
    addServer(u, implicit = false) {
      const urlParseFn1 = getUrlParseFn();
      u = urlParseFn1 ? urlParseFn1(u) : u;
      const s = new ServerImpl(u, implicit);
      if (isIP1(s.hostname)) {
        s.tlsName = this.tlsName;
      }
      this.servers.push(s);
    }
    selectServer() {
      if (this.firstSelect) {
        this.firstSelect = false;
        return this.currentServer;
      }
      const t = this.servers.shift();
      if (t) {
        this.servers.push(t);
        this.currentServer = t;
      }
      return t;
    }
    removeCurrentServer() {
      this.removeServer(this.currentServer);
    }
    removeServer(server) {
      if (server) {
        const index = this.servers.indexOf(server);
        this.servers.splice(index, 1);
      }
    }
    length() {
      return this.servers.length;
    }
    next() {
      return this.servers.length ? this.servers[0] : void 0;
    }
    getServers() {
      return this.servers;
    }
    update(info) {
      const added = [];
      let deleted = [];
      const urlParseFn1 = getUrlParseFn();
      const discovered = new Map();
      if (info.connect_urls && info.connect_urls.length > 0) {
        info.connect_urls.forEach((hp) => {
          hp = urlParseFn1 ? urlParseFn1(hp) : hp;
          const s = new ServerImpl(hp, true);
          discovered.set(hp, s);
        });
      }
      const toDelete = [];
      this.servers.forEach((s, index) => {
        const u2 = s.listen;
        if (s.gossiped && this.currentServer.listen !== u2 && discovered.get(u2) === void 0) {
          toDelete.push(index);
        }
        discovered.delete(u2);
      });
      toDelete.reverse();
      toDelete.forEach((index) => {
        const removed = this.servers.splice(index, 1);
        deleted = deleted.concat(removed[0].listen);
      });
      discovered.forEach((v, k) => {
        this.servers.push(v);
        added.push(k);
      });
      return {
        added,
        deleted
      };
    }
  };
  var QueuedIteratorImpl = class {
    inflight;
    processed;
    received;
    noIterator;
    iterClosed;
    done;
    signal;
    yields;
    dispatchedFn;
    err;
    constructor() {
      this.inflight = 0;
      this.processed = 0;
      this.received = 0;
      this.noIterator = false;
      this.done = false;
      this.signal = deferred1();
      this.yields = [];
      this.iterClosed = deferred1();
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
    push(v) {
      if (this.done) {
        return;
      }
      this.yields.push(v);
      this.signal.resolve();
    }
    async *iterate() {
      if (this.noIterator) {
        throw new NatsError1("unsupported iterator", ErrorCode1.ApiError);
      }
      while (true) {
        if (this.yields.length === 0) {
          await this.signal;
        }
        if (this.err) {
          throw this.err;
        }
        const yields = this.yields;
        this.inflight = yields.length;
        this.yields = [];
        for (let i = 0; i < yields.length; i++) {
          this.processed++;
          yield yields[i];
          if (this.dispatchedFn && yields[i]) {
            this.dispatchedFn(yields[i]);
          }
          this.inflight--;
        }
        if (this.done) {
          break;
        } else if (this.yields.length === 0) {
          yields.length = 0;
          this.yields = yields;
          this.signal = deferred1();
        }
      }
    }
    stop(err) {
      this.err = err;
      this.done = true;
      this.signal.resolve();
      this.iterClosed.resolve();
    }
    getProcessed() {
      return this.noIterator ? this.received : this.processed;
    }
    getPending() {
      return this.yields.length + this.inflight;
    }
    getReceived() {
      return this.received;
    }
  };
  var SubscriptionImpl1 = class extends QueuedIteratorImpl {
    sid;
    queue;
    draining;
    max;
    subject;
    drained;
    protocol;
    timer;
    info;
    cleanupFn;
    closed;
    constructor(protocol1, subject1, opts3 = {}) {
      super();
      extend1(this, opts3);
      this.protocol = protocol1;
      this.subject = subject1;
      this.draining = false;
      this.noIterator = typeof opts3.callback === "function";
      this.closed = deferred1();
      if (opts3.timeout) {
        this.timer = timeout1(opts3.timeout);
        this.timer.then(() => {
          this.timer = void 0;
        }).catch((err) => {
          this.stop(err);
          if (this.noIterator) {
            this.callback(err, {});
          }
        });
      }
    }
    setDispatchedFn(cb) {
      if (this.noIterator) {
        const uc = this.callback;
        this.callback = (err, msg1) => {
          uc(err, msg1);
          cb(msg1);
        };
      } else {
        this.dispatchedFn = cb;
      }
    }
    callback(err, msg) {
      this.cancelTimeout();
      err ? this.stop(err) : this.push(msg);
    }
    close() {
      if (!this.isClosed()) {
        this.cancelTimeout();
        this.stop();
        if (this.cleanupFn) {
          try {
            this.cleanupFn(this, this.info);
          } catch (_err) {
          }
        }
        this.closed.resolve();
      }
    }
    unsubscribe(max) {
      this.protocol.unsubscribe(this, max);
    }
    cancelTimeout() {
      if (this.timer) {
        this.timer.cancel();
        this.timer = void 0;
      }
    }
    drain() {
      if (this.protocol.isClosed()) {
        throw NatsError1.errorForCode(ErrorCode1.ConnectionClosed);
      }
      if (this.isClosed()) {
        throw NatsError1.errorForCode(ErrorCode1.SubClosed);
      }
      if (!this.drained) {
        this.protocol.unsub(this);
        this.drained = this.protocol.flush(deferred1());
        this.drained.then(() => {
          this.protocol.subscriptions.cancel(this);
        });
      }
      return this.drained;
    }
    isDraining() {
      return this.draining;
    }
    isClosed() {
      return this.done;
    }
    getSubject() {
      return this.subject;
    }
    getMax() {
      return this.max;
    }
    getID() {
      return this.sid;
    }
  };
  var Subscriptions1 = class {
    mux;
    subs;
    sidCounter;
    constructor() {
      this.sidCounter = 0;
      this.subs = new Map();
    }
    size() {
      return this.subs.size;
    }
    add(s) {
      this.sidCounter++;
      s.sid = this.sidCounter;
      this.subs.set(s.sid, s);
      return s;
    }
    setMux(s) {
      this.mux = s;
      return s;
    }
    getMux() {
      return this.mux;
    }
    get(sid) {
      return this.subs.get(sid);
    }
    all() {
      const buf = [];
      for (const s of this.subs.values()) {
        buf.push(s);
      }
      return buf;
    }
    cancel(s) {
      if (s) {
        s.close();
        this.subs.delete(s.sid);
      }
    }
    handleError(err) {
      let handled = false;
      if (err) {
        const re = /^'Permissions Violation for Subscription to "(\S+)"'/i;
        const ma = re.exec(err.message);
        if (ma) {
          const subj = ma[1];
          this.subs.forEach((sub) => {
            if (subj == sub.subject) {
              sub.callback(err, {});
              sub.close();
              handled = sub !== this.mux;
            }
          });
        }
      }
      return handled;
    }
    close() {
      this.subs.forEach((sub) => {
        sub.close();
      });
    }
  };
  var Heartbeat1 = class {
    ph;
    interval;
    maxOut;
    timer;
    pendings;
    constructor(ph, interval, maxOut) {
      this.ph = ph;
      this.interval = interval;
      this.maxOut = maxOut;
      this.pendings = [];
    }
    start() {
      this.cancel();
      this._schedule();
    }
    cancel(stale) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      this._reset();
      if (stale) {
        this.ph.disconnect();
      }
    }
    _schedule() {
      this.timer = setTimeout(() => {
        this.ph.dispatchStatus({
          type: DebugEvents1.PingTimer,
          data: `${this.pendings.length + 1}`
        });
        if (this.pendings.length === this.maxOut) {
          this.cancel(true);
          return;
        }
        const ping = deferred1();
        this.ph.flush(ping).then(() => {
          this._reset();
        }).catch(() => {
          this.cancel();
        });
        this.pendings.push(ping);
        this._schedule();
      }, this.interval);
    }
    _reset() {
      this.pendings = this.pendings.filter((p) => {
        const d = p;
        d.resolve();
        return false;
      });
    }
  };
  var AssertionError = class extends Error {
    constructor(msg2) {
      super(msg2);
      this.name = "AssertionError";
    }
  };
  function assert(cond, msg3 = "Assertion failed.") {
    if (!cond) {
      throw new AssertionError(msg3);
    }
  }
  var MIN_READ = 32 * 1024;
  var MAX_SIZE1 = 2 ** 32 - 2;
  function copy(src, dst, off = 0) {
    const r = dst.byteLength - off;
    if (src.byteLength > r) {
      src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
  }
  var DenoBuffer1 = class {
    _buf;
    _off;
    constructor(ab) {
      this._off = 0;
      if (ab == null) {
        this._buf = new Uint8Array(0);
        return;
      }
      this._buf = new Uint8Array(ab);
    }
    bytes(options = {
      copy: true
    }) {
      if (options.copy === false)
        return this._buf.subarray(this._off);
      return this._buf.slice(this._off);
    }
    empty() {
      return this._buf.byteLength <= this._off;
    }
    get length() {
      return this._buf.byteLength - this._off;
    }
    get capacity() {
      return this._buf.buffer.byteLength;
    }
    truncate(n) {
      if (n === 0) {
        this.reset();
        return;
      }
      if (n < 0 || n > this.length) {
        throw Error("bytes.Buffer: truncation out of range");
      }
      this._reslice(this._off + n);
    }
    reset() {
      this._reslice(0);
      this._off = 0;
    }
    _tryGrowByReslice(n) {
      const l = this._buf.byteLength;
      if (n <= this.capacity - l) {
        this._reslice(l + n);
        return l;
      }
      return -1;
    }
    _reslice(len) {
      assert(len <= this._buf.buffer.byteLength);
      this._buf = new Uint8Array(this._buf.buffer, 0, len);
    }
    readByte() {
      const a = new Uint8Array(1);
      if (this.read(a)) {
        return a[0];
      }
      return null;
    }
    read(p) {
      if (this.empty()) {
        this.reset();
        if (p.byteLength === 0) {
          return 0;
        }
        return null;
      }
      const nread = copy(this._buf.subarray(this._off), p);
      this._off += nread;
      return nread;
    }
    writeByte(n) {
      return this.write(Uint8Array.of(n));
    }
    writeString(s) {
      return this.write(TE1.encode(s));
    }
    write(p) {
      const m = this._grow(p.byteLength);
      return copy(p, this._buf, m);
    }
    _grow(n) {
      const m = this.length;
      if (m === 0 && this._off !== 0) {
        this.reset();
      }
      const i = this._tryGrowByReslice(n);
      if (i >= 0) {
        return i;
      }
      const c = this.capacity;
      if (n <= Math.floor(c / 2) - m) {
        copy(this._buf.subarray(this._off), this._buf);
      } else if (c + n > MAX_SIZE1) {
        throw new Error("The buffer cannot be grown beyond the maximum size.");
      } else {
        const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE1));
        copy(this._buf.subarray(this._off), buf);
        this._buf = buf;
      }
      this._off = 0;
      this._reslice(Math.min(m + n, MAX_SIZE1));
      return m;
    }
    grow(n) {
      if (n < 0) {
        throw Error("Buffer._grow: negative count");
      }
      const m = this._grow(n);
      this._reslice(m);
    }
    readFrom(r) {
      let n = 0;
      const tmp = new Uint8Array(MIN_READ);
      while (true) {
        const shouldGrow = this.capacity - this.length < MIN_READ;
        const buf = shouldGrow ? tmp : new Uint8Array(this._buf.buffer, this.length);
        const nread = r.read(buf);
        if (nread === null) {
          return n;
        }
        if (shouldGrow)
          this.write(buf.subarray(0, nread));
        else
          this._reslice(this.length + nread);
        n += nread;
      }
    }
  };
  var Kind1;
  (function(Kind12) {
    Kind12[Kind12["OK"] = 0] = "OK";
    Kind12[Kind12["ERR"] = 1] = "ERR";
    Kind12[Kind12["MSG"] = 2] = "MSG";
    Kind12[Kind12["INFO"] = 3] = "INFO";
    Kind12[Kind12["PING"] = 4] = "PING";
    Kind12[Kind12["PONG"] = 5] = "PONG";
  })(Kind1 || (Kind1 = {}));
  function newMsgArg() {
    const ma = {};
    ma.sid = -1;
    ma.hdr = -1;
    ma.size = -1;
    return ma;
  }
  var ASCII_0 = 48;
  var Parser1 = class {
    dispatcher;
    state;
    as;
    drop;
    hdr;
    ma;
    argBuf;
    msgBuf;
    constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.state = State1.OP_START;
      this.as = 0;
      this.drop = 0;
      this.hdr = 0;
    }
    parse(buf) {
      if (typeof module !== "undefined" && module.exports) {
        buf.subarray = buf.slice;
      }
      let i;
      for (i = 0; i < buf.length; i++) {
        const b = buf[i];
        switch (this.state) {
          case State1.OP_START:
            switch (b) {
              case cc.M:
              case cc.m:
                this.state = State1.OP_M;
                this.hdr = -1;
                this.ma = newMsgArg();
                break;
              case cc.H:
              case cc.h:
                this.state = State1.OP_H;
                this.hdr = 0;
                this.ma = newMsgArg();
                break;
              case cc.P:
              case cc.p:
                this.state = State1.OP_P;
                break;
              case cc.PLUS:
                this.state = State1.OP_PLUS;
                break;
              case cc.MINUS:
                this.state = State1.OP_MINUS;
                break;
              case cc.I:
              case cc.i:
                this.state = State1.OP_I;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_H:
            switch (b) {
              case cc.M:
              case cc.m:
                this.state = State1.OP_M;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_M:
            switch (b) {
              case cc.S:
              case cc.s:
                this.state = State1.OP_MS;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MS:
            switch (b) {
              case cc.G:
              case cc.g:
                this.state = State1.OP_MSG;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MSG:
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
                this.state = State1.OP_MSG_SPC;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MSG_SPC:
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
                continue;
              default:
                this.state = State1.MSG_ARG;
                this.as = i;
            }
            break;
          case State1.MSG_ARG:
            switch (b) {
              case cc.CR:
                this.drop = 1;
                break;
              case cc.NL: {
                const arg = this.argBuf ? this.argBuf.bytes() : buf.subarray(this.as, i - this.drop);
                this.processMsgArgs(arg);
                this.drop = 0;
                this.as = i + 1;
                this.state = State1.MSG_PAYLOAD;
                i = this.as + this.ma.size - 1;
                break;
              }
              default:
                if (this.argBuf) {
                  this.argBuf.writeByte(b);
                }
            }
            break;
          case State1.MSG_PAYLOAD:
            if (this.msgBuf) {
              if (this.msgBuf.length >= this.ma.size) {
                const data2 = this.msgBuf.bytes({
                  copy: false
                });
                this.dispatcher.push({
                  kind: Kind1.MSG,
                  msg: this.ma,
                  data: data2
                });
                this.argBuf = void 0;
                this.msgBuf = void 0;
                this.state = State1.MSG_END;
              } else {
                let toCopy = this.ma.size - this.msgBuf.length;
                const avail = buf.length - i;
                if (avail < toCopy) {
                  toCopy = avail;
                }
                if (toCopy > 0) {
                  this.msgBuf.write(buf.subarray(i, i + toCopy));
                  i = i + toCopy - 1;
                } else {
                  this.msgBuf.writeByte(b);
                }
              }
            } else if (i - this.as >= this.ma.size) {
              this.dispatcher.push({
                kind: Kind1.MSG,
                msg: this.ma,
                data: buf.subarray(this.as, i)
              });
              this.argBuf = void 0;
              this.msgBuf = void 0;
              this.state = State1.MSG_END;
            }
            break;
          case State1.MSG_END:
            switch (b) {
              case cc.NL:
                this.drop = 0;
                this.as = i + 1;
                this.state = State1.OP_START;
                break;
              default:
                continue;
            }
            break;
          case State1.OP_PLUS:
            switch (b) {
              case cc.O:
              case cc.o:
                this.state = State1.OP_PLUS_O;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PLUS_O:
            switch (b) {
              case cc.K:
              case cc.k:
                this.state = State1.OP_PLUS_OK;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PLUS_OK:
            switch (b) {
              case cc.NL:
                this.dispatcher.push({
                  kind: Kind1.OK
                });
                this.drop = 0;
                this.state = State1.OP_START;
                break;
            }
            break;
          case State1.OP_MINUS:
            switch (b) {
              case cc.E:
              case cc.e:
                this.state = State1.OP_MINUS_E;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MINUS_E:
            switch (b) {
              case cc.R:
              case cc.r:
                this.state = State1.OP_MINUS_ER;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MINUS_ER:
            switch (b) {
              case cc.R:
              case cc.r:
                this.state = State1.OP_MINUS_ERR;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MINUS_ERR:
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
                this.state = State1.OP_MINUS_ERR_SPC;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_MINUS_ERR_SPC:
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
                continue;
              default:
                this.state = State1.MINUS_ERR_ARG;
                this.as = i;
            }
            break;
          case State1.MINUS_ERR_ARG:
            switch (b) {
              case cc.CR:
                this.drop = 1;
                break;
              case cc.NL: {
                let arg;
                if (this.argBuf) {
                  arg = this.argBuf.bytes();
                  this.argBuf = void 0;
                } else {
                  arg = buf.subarray(this.as, i - this.drop);
                }
                this.dispatcher.push({
                  kind: Kind1.ERR,
                  data: arg
                });
                this.drop = 0;
                this.as = i + 1;
                this.state = State1.OP_START;
                break;
              }
              default:
                if (this.argBuf) {
                  this.argBuf.write(Uint8Array.of(b));
                }
            }
            break;
          case State1.OP_P:
            switch (b) {
              case cc.I:
              case cc.i:
                this.state = State1.OP_PI;
                break;
              case cc.O:
              case cc.o:
                this.state = State1.OP_PO;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PO:
            switch (b) {
              case cc.N:
              case cc.n:
                this.state = State1.OP_PON;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PON:
            switch (b) {
              case cc.G:
              case cc.g:
                this.state = State1.OP_PONG;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PONG:
            switch (b) {
              case cc.NL:
                this.dispatcher.push({
                  kind: Kind1.PONG
                });
                this.drop = 0;
                this.state = State1.OP_START;
                break;
            }
            break;
          case State1.OP_PI:
            switch (b) {
              case cc.N:
              case cc.n:
                this.state = State1.OP_PIN;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PIN:
            switch (b) {
              case cc.G:
              case cc.g:
                this.state = State1.OP_PING;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_PING:
            switch (b) {
              case cc.NL:
                this.dispatcher.push({
                  kind: Kind1.PING
                });
                this.drop = 0;
                this.state = State1.OP_START;
                break;
            }
            break;
          case State1.OP_I:
            switch (b) {
              case cc.N:
              case cc.n:
                this.state = State1.OP_IN;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_IN:
            switch (b) {
              case cc.F:
              case cc.f:
                this.state = State1.OP_INF;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_INF:
            switch (b) {
              case cc.O:
              case cc.o:
                this.state = State1.OP_INFO;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_INFO:
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
                this.state = State1.OP_INFO_SPC;
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
            break;
          case State1.OP_INFO_SPC:
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
                continue;
              default:
                this.state = State1.INFO_ARG;
                this.as = i;
            }
            break;
          case State1.INFO_ARG:
            switch (b) {
              case cc.CR:
                this.drop = 1;
                break;
              case cc.NL: {
                let arg;
                if (this.argBuf) {
                  arg = this.argBuf.bytes();
                  this.argBuf = void 0;
                } else {
                  arg = buf.subarray(this.as, i - this.drop);
                }
                this.dispatcher.push({
                  kind: Kind1.INFO,
                  data: arg
                });
                this.drop = 0;
                this.as = i + 1;
                this.state = State1.OP_START;
                break;
              }
              default:
                if (this.argBuf) {
                  this.argBuf.writeByte(b);
                }
            }
            break;
          default:
            throw this.fail(buf.subarray(i));
        }
      }
      if ((this.state === State1.MSG_ARG || this.state === State1.MINUS_ERR_ARG || this.state === State1.INFO_ARG) && !this.argBuf) {
        this.argBuf = new DenoBuffer1(buf.subarray(this.as, i - this.drop));
      }
      if (this.state === State1.MSG_PAYLOAD && !this.msgBuf) {
        if (!this.argBuf) {
          this.cloneMsgArg();
        }
        this.msgBuf = new DenoBuffer1(buf.subarray(this.as));
      }
    }
    cloneMsgArg() {
      const s = this.ma.subject.length;
      const r = this.ma.reply ? this.ma.reply.length : 0;
      const buf = new Uint8Array(s + r);
      buf.set(this.ma.subject);
      if (this.ma.reply) {
        buf.set(this.ma.reply, s);
      }
      this.argBuf = new DenoBuffer1(buf);
      this.ma.subject = buf.subarray(0, s);
      if (this.ma.reply) {
        this.ma.reply = buf.subarray(s);
      }
    }
    processMsgArgs(arg) {
      if (this.hdr >= 0) {
        return this.processHeaderMsgArgs(arg);
      }
      const args = [];
      let start = -1;
      for (let i = 0; i < arg.length; i++) {
        const b = arg[i];
        switch (b) {
          case cc.SPACE:
          case cc.TAB:
          case cc.CR:
          case cc.NL:
            if (start >= 0) {
              args.push(arg.subarray(start, i));
              start = -1;
            }
            break;
          default:
            if (start < 0) {
              start = i;
            }
        }
      }
      if (start >= 0) {
        args.push(arg.subarray(start));
      }
      switch (args.length) {
        case 3:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = void 0;
          this.ma.size = this.protoParseInt(args[2]);
          break;
        case 4:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = args[2];
          this.ma.size = this.protoParseInt(args[3]);
          break;
        default:
          throw this.fail(arg, "processMsgArgs Parse Error");
      }
      if (this.ma.sid < 0) {
        throw this.fail(arg, "processMsgArgs Bad or Missing Sid Error");
      }
      if (this.ma.size < 0) {
        throw this.fail(arg, "processMsgArgs Bad or Missing Size Error");
      }
    }
    fail(data, label = "") {
      if (!label) {
        label = `parse error [${this.state}]`;
      } else {
        label = `${label} [${this.state}]`;
      }
      return new Error(`${label}: ${TD1.decode(data)}`);
    }
    processHeaderMsgArgs(arg) {
      const args = [];
      let start = -1;
      for (let i = 0; i < arg.length; i++) {
        const b = arg[i];
        switch (b) {
          case cc.SPACE:
          case cc.TAB:
          case cc.CR:
          case cc.NL:
            if (start >= 0) {
              args.push(arg.subarray(start, i));
              start = -1;
            }
            break;
          default:
            if (start < 0) {
              start = i;
            }
        }
      }
      if (start >= 0) {
        args.push(arg.subarray(start));
      }
      switch (args.length) {
        case 4:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = void 0;
          this.ma.hdr = this.protoParseInt(args[2]);
          this.ma.size = this.protoParseInt(args[3]);
          break;
        case 5:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = args[2];
          this.ma.hdr = this.protoParseInt(args[3]);
          this.ma.size = this.protoParseInt(args[4]);
          break;
        default:
          throw this.fail(arg, "processHeaderMsgArgs Parse Error");
      }
      if (this.ma.sid < 0) {
        throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Sid Error");
      }
      if (this.ma.hdr < 0 || this.ma.hdr > this.ma.size) {
        throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Header Size Error");
      }
      if (this.ma.size < 0) {
        throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Size Error");
      }
    }
    protoParseInt(a) {
      if (a.length === 0) {
        return -1;
      }
      let n = 0;
      for (let i = 0; i < a.length; i++) {
        if (a[i] < 48 || a[i] > 57) {
          return -1;
        }
        n = n * 10 + (a[i] - ASCII_0);
      }
      return n;
    }
  };
  var State1;
  (function(State12) {
    State12[State12["OP_START"] = 0] = "OP_START";
    State12[State12["OP_PLUS"] = 1] = "OP_PLUS";
    State12[State12["OP_PLUS_O"] = 2] = "OP_PLUS_O";
    State12[State12["OP_PLUS_OK"] = 3] = "OP_PLUS_OK";
    State12[State12["OP_MINUS"] = 4] = "OP_MINUS";
    State12[State12["OP_MINUS_E"] = 5] = "OP_MINUS_E";
    State12[State12["OP_MINUS_ER"] = 6] = "OP_MINUS_ER";
    State12[State12["OP_MINUS_ERR"] = 7] = "OP_MINUS_ERR";
    State12[State12["OP_MINUS_ERR_SPC"] = 8] = "OP_MINUS_ERR_SPC";
    State12[State12["MINUS_ERR_ARG"] = 9] = "MINUS_ERR_ARG";
    State12[State12["OP_M"] = 10] = "OP_M";
    State12[State12["OP_MS"] = 11] = "OP_MS";
    State12[State12["OP_MSG"] = 12] = "OP_MSG";
    State12[State12["OP_MSG_SPC"] = 13] = "OP_MSG_SPC";
    State12[State12["MSG_ARG"] = 14] = "MSG_ARG";
    State12[State12["MSG_PAYLOAD"] = 15] = "MSG_PAYLOAD";
    State12[State12["MSG_END"] = 16] = "MSG_END";
    State12[State12["OP_H"] = 17] = "OP_H";
    State12[State12["OP_P"] = 18] = "OP_P";
    State12[State12["OP_PI"] = 19] = "OP_PI";
    State12[State12["OP_PIN"] = 20] = "OP_PIN";
    State12[State12["OP_PING"] = 21] = "OP_PING";
    State12[State12["OP_PO"] = 22] = "OP_PO";
    State12[State12["OP_PON"] = 23] = "OP_PON";
    State12[State12["OP_PONG"] = 24] = "OP_PONG";
    State12[State12["OP_I"] = 25] = "OP_I";
    State12[State12["OP_IN"] = 26] = "OP_IN";
    State12[State12["OP_INF"] = 27] = "OP_INF";
    State12[State12["OP_INFO"] = 28] = "OP_INFO";
    State12[State12["OP_INFO_SPC"] = 29] = "OP_INFO_SPC";
    State12[State12["INFO_ARG"] = 30] = "INFO_ARG";
  })(State1 || (State1 = {}));
  var cc;
  (function(cc1) {
    cc1[cc1["CR"] = "\r".charCodeAt(0)] = "CR";
    cc1[cc1["E"] = "E".charCodeAt(0)] = "E";
    cc1[cc1["e"] = "e".charCodeAt(0)] = "e";
    cc1[cc1["F"] = "F".charCodeAt(0)] = "F";
    cc1[cc1["f"] = "f".charCodeAt(0)] = "f";
    cc1[cc1["G"] = "G".charCodeAt(0)] = "G";
    cc1[cc1["g"] = "g".charCodeAt(0)] = "g";
    cc1[cc1["H"] = "H".charCodeAt(0)] = "H";
    cc1[cc1["h"] = "h".charCodeAt(0)] = "h";
    cc1[cc1["I"] = "I".charCodeAt(0)] = "I";
    cc1[cc1["i"] = "i".charCodeAt(0)] = "i";
    cc1[cc1["K"] = "K".charCodeAt(0)] = "K";
    cc1[cc1["k"] = "k".charCodeAt(0)] = "k";
    cc1[cc1["M"] = "M".charCodeAt(0)] = "M";
    cc1[cc1["m"] = "m".charCodeAt(0)] = "m";
    cc1[cc1["MINUS"] = "-".charCodeAt(0)] = "MINUS";
    cc1[cc1["N"] = "N".charCodeAt(0)] = "N";
    cc1[cc1["n"] = "n".charCodeAt(0)] = "n";
    cc1[cc1["NL"] = "\n".charCodeAt(0)] = "NL";
    cc1[cc1["O"] = "O".charCodeAt(0)] = "O";
    cc1[cc1["o"] = "o".charCodeAt(0)] = "o";
    cc1[cc1["P"] = "P".charCodeAt(0)] = "P";
    cc1[cc1["p"] = "p".charCodeAt(0)] = "p";
    cc1[cc1["PLUS"] = "+".charCodeAt(0)] = "PLUS";
    cc1[cc1["R"] = "R".charCodeAt(0)] = "R";
    cc1[cc1["r"] = "r".charCodeAt(0)] = "r";
    cc1[cc1["S"] = "S".charCodeAt(0)] = "S";
    cc1[cc1["s"] = "s".charCodeAt(0)] = "s";
    cc1[cc1["SPACE"] = " ".charCodeAt(0)] = "SPACE";
    cc1[cc1["TAB"] = "	".charCodeAt(0)] = "TAB";
  })(cc || (cc = {}));
  var FLUSH_THRESHOLD = 1024 * 32;
  var INFO1 = /^INFO\s+([^\r\n]+)\r\n/i;
  function createInbox1(prefix = "") {
    prefix = prefix || "_INBOX";
    if (typeof prefix !== "string") {
      throw new Error("prefix must be a string");
    }
    return `${prefix}.${nuid1.next()}`;
  }
  var MuxSubscription1 = class {
    baseInbox;
    reqs;
    constructor() {
      this.reqs = new Map();
    }
    size() {
      return this.reqs.size;
    }
    init(prefix) {
      this.baseInbox = `${createInbox1(prefix)}.`;
      return this.baseInbox;
    }
    add(r) {
      if (!isNaN(r.received)) {
        r.received = 0;
      }
      this.reqs.set(r.token, r);
    }
    get(token) {
      return this.reqs.get(token);
    }
    cancel(r) {
      this.reqs.delete(r.token);
    }
    getToken(m) {
      const s = m.subject || "";
      if (s.indexOf(this.baseInbox) === 0) {
        return s.substring(this.baseInbox.length);
      }
      return null;
    }
    dispatcher() {
      return (err, m) => {
        const token = this.getToken(m);
        if (token) {
          const r = this.get(token);
          if (r) {
            if (err === null && m.headers) {
              err = isRequestError(m);
            }
            r.resolver(err, m);
          }
        }
      };
    }
    close() {
      const err = NatsError1.errorForCode(ErrorCode1.Timeout);
      this.reqs.forEach((req) => {
        req.resolver(err, {});
      });
    }
  };
  var PONG_CMD = fastEncoder("PONG\r\n");
  var PING_CMD = fastEncoder("PING\r\n");
  var Connect1 = class {
    echo;
    no_responders;
    protocol;
    verbose;
    pedantic;
    jwt;
    nkey;
    sig;
    user;
    pass;
    auth_token;
    tls_required;
    name;
    lang;
    version;
    headers;
    constructor(transport1, opts1, nonce) {
      this.protocol = 1;
      this.version = transport1.version;
      this.lang = transport1.lang;
      this.echo = opts1.noEcho ? false : void 0;
      this.verbose = opts1.verbose;
      this.pedantic = opts1.pedantic;
      this.tls_required = opts1.tls ? true : void 0;
      this.name = opts1.name;
      const creds = (opts1 && opts1.authenticator ? opts1.authenticator(nonce) : {}) || {};
      extend1(this, creds);
    }
  };
  var ProtocolHandler1 = class {
    connected;
    connectedOnce;
    infoReceived;
    info;
    muxSubscriptions;
    options;
    outbound;
    pongs;
    subscriptions;
    transport;
    noMorePublishing;
    connectError;
    publisher;
    _closed;
    closed;
    listeners;
    heartbeats;
    parser;
    outMsgs;
    inMsgs;
    outBytes;
    inBytes;
    pendingLimit;
    lastError;
    abortReconnect;
    servers;
    server;
    constructor(options1, publisher2) {
      this._closed = false;
      this.connected = false;
      this.connectedOnce = false;
      this.infoReceived = false;
      this.noMorePublishing = false;
      this.abortReconnect = false;
      this.listeners = [];
      this.pendingLimit = FLUSH_THRESHOLD;
      this.outMsgs = 0;
      this.inMsgs = 0;
      this.outBytes = 0;
      this.inBytes = 0;
      this.options = options1;
      this.publisher = publisher2;
      this.subscriptions = new Subscriptions1();
      this.muxSubscriptions = new MuxSubscription1();
      this.outbound = new DataBuffer1();
      this.pongs = [];
      this.pendingLimit = options1.pendingLimit || this.pendingLimit;
      this.servers = new Servers(!options1.noRandomize, options1.servers);
      this.closed = deferred1();
      this.parser = new Parser1(this);
      this.heartbeats = new Heartbeat1(this, this.options.pingInterval || DEFAULT_PING_INTERVAL, this.options.maxPingOut || DEFAULT_MAX_PING_OUT);
    }
    resetOutbound() {
      this.outbound.reset();
      const pongs = this.pongs;
      this.pongs = [];
      pongs.forEach((p) => {
        p.reject(NatsError1.errorForCode(ErrorCode1.Disconnect));
      });
      this.parser = new Parser1(this);
      this.infoReceived = false;
    }
    dispatchStatus(status) {
      this.listeners.forEach((q) => {
        q.push(status);
      });
    }
    status() {
      const iter = new QueuedIteratorImpl();
      this.listeners.push(iter);
      return iter;
    }
    prepare() {
      this.info = void 0;
      this.resetOutbound();
      const pong = deferred1();
      this.pongs.unshift(pong);
      this.connectError = (err) => {
        pong.reject(err);
      };
      this.transport = newTransport();
      this.transport.closed().then(async (_err) => {
        this.connected = false;
        if (!this.isClosed()) {
          await this.disconnected(this.transport.closeError);
          return;
        }
      });
      return pong;
    }
    disconnect() {
      this.dispatchStatus({
        type: DebugEvents1.StaleConnection,
        data: ""
      });
      this.transport.disconnect();
    }
    async disconnected(_err) {
      this.dispatchStatus({
        type: Events1.Disconnect,
        data: this.servers.getCurrentServer().toString()
      });
      if (this.options.reconnect) {
        await this.dialLoop().then(() => {
          this.dispatchStatus({
            type: Events1.Reconnect,
            data: this.servers.getCurrentServer().toString()
          });
        }).catch((err) => {
          this._close(err);
        });
      } else {
        await this._close();
      }
    }
    async dial(srv) {
      const pong = this.prepare();
      let timer;
      try {
        timer = timeout1(this.options.timeout || 2e4);
        const cp = this.transport.connect(srv, this.options);
        await Promise.race([
          cp,
          timer
        ]);
        (async () => {
          try {
            for await (const b of this.transport) {
              this.parser.parse(b);
            }
          } catch (err) {
            console.log("reader closed", err);
          }
        })().then();
      } catch (err) {
        pong.reject(err);
      }
      try {
        await Promise.race([
          timer,
          pong
        ]);
        if (timer) {
          timer.cancel();
        }
        this.connected = true;
        this.connectError = void 0;
        this.sendSubscriptions();
        this.connectedOnce = true;
        this.server.didConnect = true;
        this.server.reconnects = 0;
        this.flushPending();
        this.heartbeats.start();
      } catch (err) {
        if (timer) {
          timer.cancel();
        }
        await this.transport.close(err);
        throw err;
      }
    }
    async dialLoop() {
      let lastError;
      while (true) {
        const wait = this.options.reconnectDelayHandler ? this.options.reconnectDelayHandler() : DEFAULT_RECONNECT_TIME_WAIT;
        let maxWait = wait;
        const srv = this.selectServer();
        if (!srv || this.abortReconnect) {
          throw lastError || NatsError1.errorForCode(ErrorCode1.ConnectionRefused);
        }
        const now = Date.now();
        if (srv.lastConnect === 0 || srv.lastConnect + wait <= now) {
          srv.lastConnect = Date.now();
          try {
            this.dispatchStatus({
              type: DebugEvents1.Reconnecting,
              data: srv.toString()
            });
            await this.dial(srv);
            break;
          } catch (err) {
            lastError = err;
            if (!this.connectedOnce) {
              if (this.options.waitOnFirstConnect) {
                continue;
              }
              this.servers.removeCurrentServer();
            }
            srv.reconnects++;
            const mra = this.options.maxReconnectAttempts || 0;
            if (mra !== -1 && srv.reconnects >= mra) {
              this.servers.removeCurrentServer();
            }
          }
        } else {
          maxWait = Math.min(maxWait, srv.lastConnect + wait - now);
          await delay1(maxWait);
        }
      }
    }
    static async connect(options, publisher) {
      const h = new ProtocolHandler1(options, publisher);
      await h.dialLoop();
      return h;
    }
    static toError(s) {
      const t = s ? s.toLowerCase() : "";
      if (t.indexOf("permissions violation") !== -1) {
        return new NatsError1(s, ErrorCode1.PermissionsViolation);
      } else if (t.indexOf("authorization violation") !== -1) {
        return new NatsError1(s, ErrorCode1.AuthorizationViolation);
      } else if (t.indexOf("user authentication expired") !== -1) {
        return new NatsError1(s, ErrorCode1.AuthenticationExpired);
      } else {
        return new NatsError1(s, ErrorCode1.ProtocolError);
      }
    }
    processMsg(msg, data) {
      this.inMsgs++;
      this.inBytes += data.length;
      if (!this.subscriptions.sidCounter) {
        return;
      }
      const sub = this.subscriptions.get(msg.sid);
      if (!sub) {
        return;
      }
      sub.received += 1;
      if (sub.callback) {
        sub.callback(null, new MsgImpl1(msg, data, this));
      }
      if (sub.max !== void 0 && sub.received >= sub.max) {
        sub.unsubscribe();
      }
    }
    async processError(m) {
      const s = fastDecoder(m);
      const err = ProtocolHandler1.toError(s);
      const handled = this.subscriptions.handleError(err);
      if (!handled) {
        this.dispatchStatus({
          type: Events1.Error,
          data: err.code
        });
      }
      await this.handleError(err);
    }
    async handleError(err) {
      if (err.isAuthError()) {
        this.handleAuthError(err);
      }
      if (err.isPermissionError() || err.isProtocolError()) {
        await this._close(err);
      }
      this.lastError = err;
    }
    handleAuthError(err) {
      if (this.lastError && err.code === this.lastError.code) {
        this.abortReconnect = true;
      }
      if (this.connectError) {
        this.connectError(err);
      } else {
        this.disconnect();
      }
    }
    processPing() {
      this.transport.send(PONG_CMD);
    }
    processPong() {
      const cb = this.pongs.shift();
      if (cb) {
        cb.resolve();
      }
    }
    processInfo(m) {
      const info = JSON.parse(fastDecoder(m));
      this.info = info;
      const updates = this.options && this.options.ignoreClusterUpdates ? void 0 : this.servers.update(info);
      if (!this.infoReceived) {
        this.infoReceived = true;
        if (this.transport.isEncrypted()) {
          this.servers.updateTLSName();
        }
        const { version, lang } = this.transport;
        try {
          const c = new Connect1({
            version,
            lang
          }, this.options, info.nonce);
          if (info.headers) {
            c.headers = true;
            c.no_responders = true;
          }
          const cs = JSON.stringify(c);
          this.transport.send(fastEncoder(`CONNECT ${cs}${CR_LF}`));
          this.transport.send(PING_CMD);
        } catch (err) {
          this._close(NatsError1.errorForCode(ErrorCode1.BadAuthentication, err));
        }
      }
      if (updates) {
        this.dispatchStatus({
          type: Events1.Update,
          data: updates
        });
      }
      const ldm = info.ldm !== void 0 ? info.ldm : false;
      if (ldm) {
        this.dispatchStatus({
          type: Events1.LDM,
          data: this.servers.getCurrentServer().toString()
        });
      }
    }
    push(e) {
      switch (e.kind) {
        case Kind1.MSG: {
          const { msg: msg3, data: data2 } = e;
          this.processMsg(msg3, data2);
          break;
        }
        case Kind1.OK:
          break;
        case Kind1.ERR:
          this.processError(e.data);
          break;
        case Kind1.PING:
          this.processPing();
          break;
        case Kind1.PONG:
          this.processPong();
          break;
        case Kind1.INFO:
          this.processInfo(e.data);
          break;
      }
    }
    sendCommand(cmd, ...payloads) {
      const len = this.outbound.length();
      let buf;
      if (typeof cmd === "string") {
        buf = fastEncoder(cmd);
      } else {
        buf = cmd;
      }
      this.outbound.fill(buf, ...payloads);
      if (len === 0) {
        setTimeout(() => {
          this.flushPending();
        });
      } else if (this.outbound.size() >= this.pendingLimit) {
        this.flushPending();
      }
    }
    publish(subject, data, options) {
      if (this.isClosed()) {
        throw NatsError1.errorForCode(ErrorCode1.ConnectionClosed);
      }
      if (this.noMorePublishing) {
        throw NatsError1.errorForCode(ErrorCode1.ConnectionDraining);
      }
      let len = data.length;
      options = options || {};
      options.reply = options.reply || "";
      let headers2 = Empty1;
      let hlen = 0;
      if (options.headers) {
        if (this.info && !this.info.headers) {
          throw new NatsError1("headers", ErrorCode1.ServerOptionNotAvailable);
        }
        const hdrs = options.headers;
        headers2 = hdrs.encode();
        hlen = headers2.length;
        len = data.length + hlen;
      }
      if (this.info && len > this.info.max_payload) {
        throw NatsError1.errorForCode(ErrorCode1.MaxPayloadExceeded);
      }
      this.outBytes += len;
      this.outMsgs++;
      let proto;
      if (options.headers) {
        if (options.reply) {
          proto = `HPUB ${subject} ${options.reply} ${hlen} ${len}${CR_LF}`;
        } else {
          proto = `HPUB ${subject} ${hlen} ${len}\r
`;
        }
        this.sendCommand(proto, headers2, data, CRLF);
      } else {
        if (options.reply) {
          proto = `PUB ${subject} ${options.reply} ${len}\r
`;
        } else {
          proto = `PUB ${subject} ${len}\r
`;
        }
        this.sendCommand(proto, data, CRLF);
      }
    }
    request(r) {
      this.initMux();
      this.muxSubscriptions.add(r);
      return r;
    }
    subscribe(s) {
      this.subscriptions.add(s);
      if (s.queue) {
        this.sendCommand(`SUB ${s.subject} ${s.queue} ${s.sid}\r
`);
      } else {
        this.sendCommand(`SUB ${s.subject} ${s.sid}\r
`);
      }
      if (s.max) {
        this.unsubscribe(s, s.max);
      }
      return s;
    }
    unsubscribe(s, max) {
      this.unsub(s, max);
      if (s.max === void 0 || s.received >= s.max) {
        this.subscriptions.cancel(s);
      }
    }
    unsub(s, max) {
      if (!s || this.isClosed()) {
        return;
      }
      if (max) {
        this.sendCommand(`UNSUB ${s.sid} ${max}${CR_LF}`);
      } else {
        this.sendCommand(`UNSUB ${s.sid}${CR_LF}`);
      }
      s.max = max;
    }
    flush(p) {
      if (!p) {
        p = deferred1();
      }
      this.pongs.push(p);
      this.sendCommand(PING_CMD);
      return p;
    }
    sendSubscriptions() {
      const cmds = [];
      this.subscriptions.all().forEach((s) => {
        const sub = s;
        if (sub.queue) {
          cmds.push(`SUB ${sub.subject} ${sub.queue} ${sub.sid}${CR_LF}`);
        } else {
          cmds.push(`SUB ${sub.subject} ${sub.sid}${CR_LF}`);
        }
      });
      if (cmds.length) {
        this.transport.send(fastEncoder(cmds.join("")));
      }
    }
    async _close(err) {
      if (this._closed) {
        return;
      }
      this.heartbeats.cancel();
      if (this.connectError) {
        this.connectError(err);
        this.connectError = void 0;
      }
      this.muxSubscriptions.close();
      this.subscriptions.close();
      this.listeners.forEach((l) => {
        l.stop();
      });
      this._closed = true;
      await this.transport.close(err);
      await this.closed.resolve(err);
    }
    close() {
      return this._close();
    }
    isClosed() {
      return this._closed;
    }
    drain() {
      const subs = this.subscriptions.all();
      const promises = [];
      subs.forEach((sub) => {
        promises.push(sub.drain());
      });
      return Promise.all(promises).then(async () => {
        this.noMorePublishing = true;
        await this.flush();
        return this.close();
      }).catch(() => {
      });
    }
    flushPending() {
      if (!this.infoReceived || !this.connected) {
        return;
      }
      if (this.outbound.size()) {
        const d = this.outbound.drain();
        this.transport.send(d);
      }
    }
    initMux() {
      const mux = this.subscriptions.getMux();
      if (!mux) {
        const inbox = this.muxSubscriptions.init(this.options.inboxPrefix);
        const sub = new SubscriptionImpl1(this, `${inbox}*`);
        sub.callback = this.muxSubscriptions.dispatcher();
        this.subscriptions.setMux(sub);
        this.subscribe(sub);
      }
    }
    selectServer() {
      const server = this.servers.selectServer();
      if (server === void 0) {
        return void 0;
      }
      this.server = server;
      return this.server;
    }
    getServer() {
      return this.server;
    }
  };
  var Request1 = class {
    token;
    received;
    deferred;
    timer;
    mux;
    constructor(mux, opts2 = {
      timeout: 1e3
    }) {
      this.mux = mux;
      this.received = 0;
      this.deferred = deferred1();
      this.token = nuid1.next();
      extend1(this, opts2);
      this.timer = timeout1(opts2.timeout);
    }
    resolver(err, msg) {
      if (this.timer) {
        this.timer.cancel();
      }
      if (err) {
        this.deferred.reject(err);
      } else {
        this.deferred.resolve(msg);
      }
      this.cancel();
    }
    cancel(err) {
      if (this.timer) {
        this.timer.cancel();
      }
      this.mux.cancel(this);
      this.deferred.reject(err ? err : NatsError1.errorForCode(ErrorCode1.Cancelled));
    }
  };
  function StringCodec1() {
    return {
      encode(d) {
        return TE1.encode(d);
      },
      decode(a) {
        return TD1.decode(a);
      }
    };
  }
  function JSONCodec1() {
    return {
      encode(d) {
        try {
          if (d === void 0) {
            d = null;
          }
          return TE1.encode(JSON.stringify(d));
        } catch (err) {
          throw NatsError1.errorForCode(ErrorCode1.BadJson, err);
        }
      },
      decode(a) {
        try {
          return JSON.parse(TD1.decode(a));
        } catch (err) {
          throw NatsError1.errorForCode(ErrorCode1.BadJson, err);
        }
      }
    };
  }
  function validateDurableName(name) {
    return validateName("durable", name);
  }
  function validateStreamName(name) {
    return validateName("stream", name);
  }
  function validateName(context, name = "") {
    if (name === "") {
      throw Error(`${context} name required`);
    }
    const bad = [
      ".",
      "*",
      ">"
    ];
    bad.forEach((v) => {
      if (name.indexOf(v) !== -1) {
        throw Error(`invalid ${context} name - ${context} name cannot contain '${v}'`);
      }
    });
  }
  function defaultConsumer(name, opts3 = {}) {
    return Object.assign({
      name,
      deliver_policy: DeliverPolicy1.All,
      ack_policy: AckPolicy1.Explicit,
      ack_wait: nanos1(30 * 1e3),
      replay_policy: ReplayPolicy1.Instant
    }, opts3);
  }
  function nanos1(millis) {
    return millis * 1e6;
  }
  function isFlowControlMsg1(msg3) {
    const h = msg3.headers;
    if (!h) {
      return false;
    }
    return h.code >= 100 && h.code < 200;
  }
  function checkJsError(msg3) {
    const h = msg3.headers;
    if (!h) {
      return null;
    }
    return checkJsErrorCode(h.code, h.status);
  }
  function checkJsErrorCode(code22, description = "") {
    if (code22 < 300) {
      return null;
    }
    description = description.toLowerCase();
    switch (code22) {
      case 503:
        return NatsError1.errorForCode(ErrorCode1.JetStreamNotEnabled, new Error(description));
      default:
        if (description === "") {
          description = ErrorCode1.Unknown;
        }
        return new NatsError1(description, `${code22}`);
    }
  }
  var defaultPrefix = "$JS.API";
  function defaultJsOptions(opts3) {
    opts3 = opts3 || {};
    if (opts3.domain) {
      opts3.apiPrefix = `$JS.${opts3.domain}.API`;
      delete opts3.domain;
    }
    return extend1({
      apiPrefix: defaultPrefix,
      timeout: 5e3
    }, opts3);
  }
  var BaseApiClient = class {
    nc;
    opts;
    prefix;
    timeout;
    jc;
    constructor(nc6, opts4) {
      this.nc = nc6;
      this.opts = defaultJsOptions(opts4);
      this._parseOpts();
      this.prefix = this.opts.apiPrefix;
      this.timeout = this.opts.timeout;
      this.jc = JSONCodec1();
    }
    _parseOpts() {
      let prefix = this.opts.apiPrefix;
      if (!prefix || prefix.length === 0) {
        throw new Error("invalid empty prefix");
      }
      const c = prefix[prefix.length - 1];
      if (c === ".") {
        prefix = prefix.substr(0, prefix.length - 1);
      }
      this.opts.apiPrefix = prefix;
    }
    async _request(subj, data = null, opts) {
      opts = opts || {};
      opts.timeout = this.timeout;
      let a = Empty1;
      if (data) {
        a = this.jc.encode(data);
      }
      const m = await this.nc.request(subj, a, opts);
      return this.parseJsResponse(m);
    }
    async findStream(subject) {
      const q = {
        subject
      };
      const r = await this._request(`${this.prefix}.STREAM.NAMES`, q);
      const names = r;
      if (!names.streams || names.streams.length !== 1) {
        throw new Error("no stream matches subject");
      }
      return names.streams[0];
    }
    parseJsResponse(m) {
      const v = this.jc.decode(m.data);
      const r = v;
      if (r.error) {
        const err = checkJsErrorCode(r.error.code, r.error.description);
        if (err !== null) {
          throw err;
        }
      }
      return v;
    }
  };
  var ListerImpl = class {
    err;
    offset;
    pageInfo;
    subject;
    jsm;
    filter;
    constructor(subject2, filter, jsm) {
      if (!subject2) {
        throw new Error("subject is required");
      }
      this.subject = subject2;
      this.jsm = jsm;
      this.offset = 0;
      this.pageInfo = {};
      this.filter = filter;
    }
    async next() {
      if (this.err) {
        return [];
      }
      if (this.pageInfo && this.offset >= this.pageInfo.total) {
        return [];
      }
      const offset = {
        offset: this.offset
      };
      try {
        const r = await this.jsm._request(this.subject, offset, {
          timeout: this.jsm.timeout
        });
        this.pageInfo = r;
        const a = this.filter(r);
        this.offset += a.length;
        return a;
      } catch (err) {
        this.err = err;
        throw err;
      }
    }
    async *[Symbol.asyncIterator]() {
      let page = await this.next();
      while (page.length > 0) {
        for (const item of page) {
          yield item;
        }
        page = await this.next();
      }
    }
  };
  var StreamAPIImpl = class extends BaseApiClient {
    constructor(nc1, opts5) {
      super(nc1, opts5);
    }
    async add(cfg = {}) {
      validateStreamName(cfg.name);
      const r = await this._request(`${this.prefix}.STREAM.CREATE.${cfg.name}`, cfg);
      return r;
    }
    async delete(stream) {
      validateStreamName(stream);
      const r = await this._request(`${this.prefix}.STREAM.DELETE.${stream}`);
      const cr = r;
      return cr.success;
    }
    async update(cfg = {}) {
      validateStreamName(cfg.name);
      const r = await this._request(`${this.prefix}.STREAM.UPDATE.${cfg.name}`, cfg);
      return r;
    }
    async info(name, data) {
      validateStreamName(name);
      const r = await this._request(`${this.prefix}.STREAM.INFO.${name}`, data);
      return r;
    }
    list() {
      const filter1 = (v) => {
        const slr = v;
        return slr.streams;
      };
      const subj = `${this.prefix}.STREAM.LIST`;
      return new ListerImpl(subj, filter1, this);
    }
    async purge(name, opts) {
      if (opts) {
        const { keep, seq } = opts;
        if (typeof keep === "number" && typeof seq === "number") {
          throw new Error("can specify one of keep or seq");
        }
      }
      validateStreamName(name);
      const v = await this._request(`${this.prefix}.STREAM.PURGE.${name}`, opts);
      return v;
    }
    async deleteMessage(stream, seq, erase = true) {
      validateStreamName(stream);
      const dr = {
        seq
      };
      if (!erase) {
        dr.no_erase = true;
      }
      const r = await this._request(`${this.prefix}.STREAM.MSG.DELETE.${stream}`, dr);
      const cr = r;
      return cr.success;
    }
    async getMessage(stream, query) {
      if (typeof query === "number") {
        console.log(`[33m [WARN] jsm.getMessage(number) is deprecated and will be removed on release - use \`{seq: number}\` as an argument [0m`);
        query = {
          seq: query
        };
      }
      validateStreamName(stream);
      const r = await this._request(`${this.prefix}.STREAM.MSG.GET.${stream}`, query);
      const sm = r;
      return new StoredMsgImpl(sm);
    }
    find(subject) {
      return this.findStream(subject);
    }
  };
  var StoredMsgImpl = class {
    subject;
    seq;
    data;
    time;
    header;
    constructor(smr) {
      this.subject = smr.message.subject;
      this.seq = smr.message.seq;
      this.time = new Date(smr.message.time);
      this.data = smr.message.data ? this._parse(smr.message.data) : Empty1;
      if (smr.message.hdrs) {
        const hd = this._parse(smr.message.hdrs);
        this.header = MsgHdrsImpl1.decode(hd);
      } else {
        this.header = headers1();
      }
    }
    _parse(s) {
      const bs = atob(s);
      const len = bs.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = bs.charCodeAt(i);
      }
      return bytes;
    }
  };
  var ConsumerAPIImpl = class extends BaseApiClient {
    constructor(nc2, opts6) {
      super(nc2, opts6);
    }
    async add(stream, cfg) {
      validateStreamName(stream);
      const cr = {};
      cr.config = cfg;
      cr.stream_name = stream;
      if (cr.config.durable_name) {
        validateDurableName(cr.config.durable_name);
      }
      const subj = cfg.durable_name ? `${this.prefix}.CONSUMER.DURABLE.CREATE.${stream}.${cfg.durable_name}` : `${this.prefix}.CONSUMER.CREATE.${stream}`;
      const r = await this._request(subj, cr);
      return r;
    }
    async info(stream, name) {
      validateStreamName(stream);
      validateDurableName(name);
      const r = await this._request(`${this.prefix}.CONSUMER.INFO.${stream}.${name}`);
      return r;
    }
    async delete(stream, name) {
      validateStreamName(stream);
      validateDurableName(name);
      const r = await this._request(`${this.prefix}.CONSUMER.DELETE.${stream}.${name}`);
      const cr = r;
      return cr.success;
    }
    list(stream) {
      validateStreamName(stream);
      const filter1 = (v) => {
        const clr = v;
        return clr.consumers;
      };
      const subj = `${this.prefix}.CONSUMER.LIST.${stream}`;
      return new ListerImpl(subj, filter1, this);
    }
  };
  var JetStreamManagerImpl = class extends BaseApiClient {
    streams;
    consumers;
    constructor(nc3, opts7) {
      super(nc3, opts7);
      this.streams = new StreamAPIImpl(nc3, opts7);
      this.consumers = new ConsumerAPIImpl(nc3, opts7);
    }
    async getAccountInfo() {
      const r = await this._request(`${this.prefix}.INFO`);
      return r;
    }
    advisories() {
      const iter = new QueuedIteratorImpl();
      this.nc.subscribe(`$JS.EVENT.ADVISORY.>`, {
        callback: (err, msg3) => {
          if (err) {
            throw err;
          }
          try {
            const d = this.parseJsResponse(msg3);
            const chunks = d.type.split(".");
            const kind = chunks[chunks.length - 1];
            iter.push({
              kind,
              data: d
            });
          } catch (err1) {
            iter.stop(err1);
          }
        }
      });
      return iter;
    }
  };
  var ACK = Uint8Array.of(43, 65, 67, 75);
  var NAK = Uint8Array.of(45, 78, 65, 75);
  var WPI = Uint8Array.of(43, 87, 80, 73);
  var NXT = Uint8Array.of(43, 78, 88, 84);
  var TERM = Uint8Array.of(43, 84, 69, 82, 77);
  var SPACE = Uint8Array.of(32);
  function toJsMsg1(m) {
    return new JsMsgImpl(m);
  }
  function parseInfo(s) {
    const tokens = s.split(".");
    if (tokens.length !== 9 && tokens[0] !== "$JS" && tokens[1] !== "ACK") {
      throw new Error(`not js message`);
    }
    const di = {};
    di.stream = tokens[2];
    di.consumer = tokens[3];
    di.redeliveryCount = parseInt(tokens[4], 10);
    di.streamSequence = parseInt(tokens[5], 10);
    di.deliverySequence = parseInt(tokens[6], 10);
    di.timestampNanos = parseInt(tokens[7], 10);
    di.pending = parseInt(tokens[8], 10);
    return di;
  }
  var JsMsgImpl = class {
    msg;
    di;
    didAck;
    constructor(msg3) {
      this.msg = msg3;
      this.didAck = false;
    }
    get subject() {
      return this.msg.subject;
    }
    get sid() {
      return this.msg.sid;
    }
    get data() {
      return this.msg.data;
    }
    get headers() {
      return this.msg.headers;
    }
    get info() {
      if (!this.di) {
        this.di = parseInfo(this.reply);
      }
      return this.di;
    }
    get redelivered() {
      return this.info.redeliveryCount > 1;
    }
    get reply() {
      return this.msg.reply || "";
    }
    get seq() {
      return this.info.streamSequence;
    }
    doAck(payload) {
      if (!this.didAck) {
        this.didAck = !this.isWIP(payload);
        this.msg.respond(payload);
      }
    }
    isWIP(p) {
      return p.length === 4 && p[0] === WPI[0] && p[1] === WPI[1] && p[2] === WPI[2] && p[3] === WPI[3];
    }
    async ackAck() {
      if (!this.didAck) {
        this.didAck = true;
        if (this.msg.reply) {
          const mi = this.msg;
          const proto = mi.publisher;
          const r = new Request1(proto.muxSubscriptions);
          proto.request(r);
          try {
            proto.publish(this.msg.reply, ACK, {
              reply: `${proto.muxSubscriptions.baseInbox}${r.token}`
            });
          } catch (err) {
            r.cancel(err);
          }
          try {
            await Promise.race([
              r.timer,
              r.deferred
            ]);
            return true;
          } catch (err) {
            r.cancel(err);
          }
        }
      }
      return false;
    }
    ack() {
      this.doAck(ACK);
    }
    nak() {
      this.doAck(NAK);
    }
    working() {
      this.doAck(WPI);
    }
    next(subj, ro) {
      let payload = NXT;
      if (ro) {
        const data2 = JSONCodec1().encode(ro);
        payload = DataBuffer1.concat(NXT, SPACE, data2);
      }
      const opts8 = subj ? {
        reply: subj
      } : void 0;
      this.msg.respond(payload, opts8);
    }
    term() {
      this.doAck(TERM);
    }
  };
  function checkFn(fn, name, required = false) {
    if (required === true && !fn) {
      throw NatsError1.errorForCode(ErrorCode1.ApiError, new Error(`${name} is not a function`));
    }
    if (fn && typeof fn !== "function") {
      throw NatsError1.errorForCode(ErrorCode1.ApiError, new Error(`${name} is not a function`));
    }
  }
  var TypedSubscription1 = class extends QueuedIteratorImpl {
    sub;
    adapter;
    subIterDone;
    constructor(nc4, subject3, opts8) {
      super();
      checkFn(opts8.adapter, "adapter", true);
      this.adapter = opts8.adapter;
      if (opts8.callback) {
        checkFn(opts8.callback, "callback");
      }
      this.noIterator = typeof opts8.callback === "function";
      if (opts8.dispatchedFn) {
        checkFn(opts8.dispatchedFn, "dispatchedFn");
        this.dispatchedFn = opts8.dispatchedFn;
      }
      if (opts8.cleanupFn) {
        checkFn(opts8.cleanupFn, "cleanupFn");
      }
      let callback = (err, msg4) => {
        this.callback(err, msg4);
      };
      if (opts8.callback) {
        const uh = opts8.callback;
        callback = (err, msg4) => {
          const [jer, tm] = this.adapter(err, msg4);
          uh(jer, tm);
          if (this.dispatchedFn && tm) {
            this.dispatchedFn(tm);
          }
        };
      }
      const { max: max1, queue, timeout: timeout2 } = opts8;
      const sopts = {
        queue,
        timeout: timeout2,
        callback
      };
      if (max1 && max1 > 0) {
        sopts.max = max1;
      }
      this.sub = nc4.subscribe(subject3, sopts);
      if (opts8.cleanupFn) {
        this.sub.cleanupFn = opts8.cleanupFn;
      }
      this.subIterDone = deferred1();
      Promise.all([
        this.sub.closed,
        this.iterClosed
      ]).then(() => {
        this.subIterDone.resolve();
      }).catch(() => {
        this.subIterDone.resolve();
      });
      (async (s) => {
        await s.closed;
        this.stop();
      })(this.sub).then().catch();
    }
    unsubscribe(max) {
      this.sub.unsubscribe(max);
    }
    drain() {
      return this.sub.drain();
    }
    isDraining() {
      return this.sub.isDraining();
    }
    isClosed() {
      return this.sub.isClosed();
    }
    callback(e, msg) {
      this.sub.cancelTimeout();
      const [err, tm] = this.adapter(e, msg);
      if (err) {
        this.stop(err);
      }
      if (tm) {
        this.push(tm);
      }
    }
    getSubject() {
      return this.sub.getSubject();
    }
    getReceived() {
      return this.sub.getReceived();
    }
    getProcessed() {
      return this.sub.getProcessed();
    }
    getPending() {
      return this.sub.getPending();
    }
    getID() {
      return this.sub.getID();
    }
    getMax() {
      return this.sub.getMax();
    }
    get closed() {
      return this.sub.closed;
    }
  };
  function consumerOpts1(opts9) {
    return new ConsumerOptsBuilderImpl(opts9);
  }
  var ConsumerOptsBuilderImpl = class {
    config;
    mack;
    stream;
    callbackFn;
    max;
    qname;
    constructor(opts9) {
      this.stream = "";
      this.mack = false;
      this.config = defaultConsumer("", opts9 || {});
      this.config.ack_policy = AckPolicy1.All;
    }
    getOpts() {
      const o = {};
      o.config = this.config;
      o.mack = this.mack;
      o.stream = this.stream;
      o.callbackFn = this.callbackFn;
      o.max = this.max;
      o.queue = this.qname;
      return o;
    }
    deliverTo(subject) {
      this.config.deliver_subject = subject;
    }
    manualAck() {
      this.mack = true;
    }
    durable(name) {
      validateDurableName(name);
      this.config.durable_name = name;
    }
    deliverAll() {
      this.config.deliver_policy = DeliverPolicy1.All;
    }
    deliverLast() {
      this.config.deliver_policy = DeliverPolicy1.Last;
    }
    deliverNew() {
      this.config.deliver_policy = DeliverPolicy1.New;
    }
    startSequence(seq) {
      if (seq <= 0) {
        throw new Error("sequence must be greater than 0");
      }
      this.config.deliver_policy = DeliverPolicy1.StartSequence;
      this.config.opt_start_seq = seq;
    }
    startTime(time) {
      this.config.deliver_policy = DeliverPolicy1.StartTime;
      this.config.opt_start_time = time.toISOString();
    }
    ackNone() {
      this.config.ack_policy = AckPolicy1.None;
    }
    ackAll() {
      this.config.ack_policy = AckPolicy1.All;
    }
    ackExplicit() {
      this.config.ack_policy = AckPolicy1.Explicit;
    }
    maxDeliver(max) {
      this.config.max_deliver = max;
    }
    maxAckPending(max) {
      this.config.max_ack_pending = max;
    }
    maxWaiting(max) {
      this.config.max_waiting = max;
    }
    maxMessages(max) {
      this.max = max;
    }
    callback(fn) {
      this.callbackFn = fn;
    }
    queue(n) {
      this.qname = n;
    }
    idleHeartbeat(millis) {
      this.config.idle_heartbeat = nanos1(millis);
    }
    flowControl() {
      this.config.flow_control = true;
    }
  };
  function isConsumerOptsBuilder(o) {
    return typeof o.getOpts === "function";
  }
  var PubHeaders;
  (function(PubHeaders1) {
    PubHeaders1["MsgIdHdr"] = "Nats-Msg-Id";
    PubHeaders1["ExpectedStreamHdr"] = "Nats-Expected-Stream";
    PubHeaders1["ExpectedLastSeqHdr"] = "Nats-Expected-Last-Sequence";
    PubHeaders1["ExpectedLastMsgIdHdr"] = "Nats-Expected-Last-Msg-Id";
    PubHeaders1["ExpectedLastSubjectSequenceHdr"] = "Nats-Expected-Last-Subject-Sequence";
  })(PubHeaders || (PubHeaders = {}));
  var JetStreamClientImpl = class extends BaseApiClient {
    api;
    constructor(nc5, opts10) {
      super(nc5, opts10);
      this.api = new ConsumerAPIImpl(nc5, opts10);
    }
    async publish(subj, data = Empty1, opts) {
      opts = opts || {};
      opts.expect = opts.expect || {};
      const mh = opts?.headers || headers1();
      if (opts) {
        if (opts.msgID) {
          mh.set(PubHeaders.MsgIdHdr, opts.msgID);
        }
        if (opts.expect.lastMsgID) {
          mh.set(PubHeaders.ExpectedLastMsgIdHdr, opts.expect.lastMsgID);
        }
        if (opts.expect.streamName) {
          mh.set(PubHeaders.ExpectedStreamHdr, opts.expect.streamName);
        }
        if (opts.expect.lastSequence) {
          mh.set(PubHeaders.ExpectedLastSeqHdr, `${opts.expect.lastSequence}`);
        }
        if (opts.expect.lastSubjectSequence) {
          mh.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.expect.lastSubjectSequence}`);
        }
      }
      const to = opts.timeout || this.timeout;
      const ro = {};
      if (to) {
        ro.timeout = to;
      }
      if (opts) {
        ro.headers = mh;
      }
      const r = await this.nc.request(subj, data, ro);
      const pa = this.parseJsResponse(r);
      if (pa.stream === "") {
        throw NatsError1.errorForCode(ErrorCode1.JetStreamInvalidAck);
      }
      pa.duplicate = pa.duplicate ? pa.duplicate : false;
      return pa;
    }
    async pull(stream, durable) {
      validateStreamName(stream);
      validateDurableName(durable);
      const msg4 = await this.nc.request(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode({
        no_wait: true,
        batch: 1,
        expires: nanos1(this.timeout)
      }), {
        noMux: true,
        timeout: this.timeout
      });
      const err = checkJsError(msg4);
      if (err) {
        throw err;
      }
      return toJsMsg1(msg4);
    }
    fetch(stream, durable, opts = {}) {
      validateStreamName(stream);
      validateDurableName(durable);
      let timer = null;
      const args = {};
      args.batch = opts.batch || 1;
      args.no_wait = opts.no_wait || false;
      const expires = opts.expires || 0;
      if (expires) {
        args.expires = nanos1(expires);
      }
      if (expires === 0 && args.no_wait === false) {
        throw new Error("expires or no_wait is required");
      }
      const qi = new QueuedIteratorImpl();
      const wants = args.batch;
      let received = 0;
      qi.dispatchedFn = (m) => {
        if (m) {
          received++;
          if (timer && m.info.pending === 0) {
            return;
          }
          if (qi.getPending() === 1 && m.info.pending === 0 || wants === received) {
            qi.stop();
          }
        }
      };
      const inbox = createInbox1(this.nc.options.inboxPrefix);
      const sub = this.nc.subscribe(inbox, {
        max: opts.batch,
        callback: (err, msg4) => {
          if (err === null) {
            err = checkJsError(msg4);
          }
          if (err !== null) {
            if (timer) {
              timer.cancel();
              timer = null;
            }
            if (isNatsError(err) && err.code === ErrorCode1.JetStream404NoMessages) {
              qi.stop();
            } else {
              qi.stop(err);
            }
          } else {
            qi.received++;
            qi.push(toJsMsg1(msg4));
          }
        }
      });
      if (expires) {
        timer = timeout1(expires);
        timer.catch(() => {
          if (!sub.isClosed()) {
            sub.drain();
            timer = null;
          }
        });
      }
      (async () => {
        await sub.closed;
        if (timer !== null) {
          timer.cancel();
          timer = null;
        }
        qi.stop();
      })().catch();
      this.nc.publish(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode(args), {
        reply: inbox
      });
      return qi;
    }
    async pullSubscribe(subject, opts = consumerOpts1()) {
      const cso = await this._processOptions(subject, opts);
      if (!cso.attached) {
        cso.config.filter_subject = subject;
      }
      if (cso.config.deliver_subject) {
        throw new Error("consumer info specifies deliver_subject - pull consumers cannot have deliver_subject set");
      }
      const ackPolicy = cso.config.ack_policy;
      if (ackPolicy === AckPolicy1.None || ackPolicy === AckPolicy1.All) {
        throw new Error("ack policy for pull consumers must be explicit");
      }
      const so = this._buildTypedSubscriptionOpts(cso);
      const sub = new JetStreamPullSubscriptionImpl(this, cso.deliver, so);
      try {
        await this._maybeCreateConsumer(cso);
      } catch (err) {
        sub.unsubscribe();
        throw err;
      }
      sub.info = cso;
      return sub;
    }
    async subscribe(subject, opts = consumerOpts1()) {
      const cso = await this._processOptions(subject, opts);
      if (!cso.config.deliver_subject) {
        throw new Error("consumer info specifies a pull consumer - deliver_subject is required");
      }
      const so = this._buildTypedSubscriptionOpts(cso);
      const sub = new JetStreamSubscriptionImpl(this, cso.deliver, so);
      try {
        await this._maybeCreateConsumer(cso);
      } catch (err) {
        sub.unsubscribe();
        throw err;
      }
      sub.info = cso;
      return sub;
    }
    async _processOptions(subject, opts = consumerOpts1()) {
      const jsi = isConsumerOptsBuilder(opts) ? opts.getOpts() : opts;
      jsi.api = this;
      jsi.config = jsi.config || {};
      jsi.stream = jsi.stream ? jsi.stream : await this.findStream(subject);
      jsi.attached = false;
      if (jsi.config.durable_name) {
        try {
          const info = await this.api.info(jsi.stream, jsi.config.durable_name);
          if (info) {
            if (info.config.filter_subject && info.config.filter_subject !== subject) {
              throw new Error("subject does not match consumer");
            }
            jsi.config = info.config;
            jsi.attached = true;
          }
        } catch (err) {
          if (err.code !== "404") {
            throw err;
          }
        }
      }
      if (!jsi.attached) {
        jsi.config.filter_subject = subject;
      }
      jsi.deliver = jsi.config.deliver_subject || createInbox1(this.nc.options.inboxPrefix);
      return jsi;
    }
    _buildTypedSubscriptionOpts(jsi) {
      const so = {};
      so.adapter = msgAdapter(jsi.callbackFn === void 0);
      if (jsi.callbackFn) {
        so.callback = jsi.callbackFn;
      }
      if (!jsi.mack) {
        so.dispatchedFn = autoAckJsMsg;
      }
      so.max = jsi.max || 0;
      so.queue = jsi.queue;
      return so;
    }
    async _maybeCreateConsumer(jsi) {
      if (jsi.attached) {
        return;
      }
      jsi.config = Object.assign({
        deliver_policy: DeliverPolicy1.All,
        ack_policy: AckPolicy1.Explicit,
        ack_wait: nanos1(30 * 1e3),
        replay_policy: ReplayPolicy1.Instant
      }, jsi.config);
      const ci = await this.api.add(jsi.stream, jsi.config);
      jsi.name = ci.name;
      jsi.config = ci.config;
    }
  };
  var JetStreamSubscriptionImpl = class extends TypedSubscription1 {
    constructor(js, subject4, opts11) {
      super(js.nc, subject4, opts11);
    }
    set info(info) {
      this.sub.info = info;
    }
    get info() {
      return this.sub.info;
    }
    async destroy() {
      if (!this.isClosed()) {
        await this.drain();
      }
      const jinfo = this.sub.info;
      const name = jinfo.config.durable_name || jinfo.name;
      const subj = `${jinfo.api.prefix}.CONSUMER.DELETE.${jinfo.stream}.${name}`;
      await jinfo.api._request(subj);
    }
    async consumerInfo() {
      const jinfo = this.sub.info;
      const name = jinfo.config.durable_name || jinfo.name;
      const subj = `${jinfo.api.prefix}.CONSUMER.INFO.${jinfo.stream}.${name}`;
      return await jinfo.api._request(subj);
    }
  };
  var JetStreamPullSubscriptionImpl = class extends JetStreamSubscriptionImpl {
    constructor(js1, subject5, opts12) {
      super(js1, subject5, opts12);
    }
    pull(opts = {
      batch: 1
    }) {
      const { stream, config } = this.sub.info;
      const consumer = config.durable_name;
      const args = {};
      args.batch = opts.batch || 1;
      args.no_wait = opts.no_wait || false;
      if (opts.expires && opts.expires > 0) {
        args.expires = opts.expires;
      }
      if (this.info) {
        const api = this.info.api;
        const subj = `${api.prefix}.CONSUMER.MSG.NEXT.${stream}.${consumer}`;
        const reply = this.sub.subject;
        api.nc.publish(subj, api.jc.encode(args), {
          reply
        });
      }
    }
  };
  function msgAdapter(iterator) {
    if (iterator) {
      return iterMsgAdapter;
    } else {
      return cbMsgAdapter;
    }
  }
  function cbMsgAdapter(err, msg4) {
    if (err) {
      return [
        err,
        null
      ];
    }
    err = checkJsError(msg4);
    if (err) {
      return [
        err,
        null
      ];
    }
    if (isFlowControlMsg1(msg4)) {
      msg4.respond();
      return [
        null,
        null
      ];
    }
    const jm = toJsMsg1(msg4);
    try {
      jm.info;
      return [
        null,
        jm
      ];
    } catch (err1) {
      return [
        err1,
        null
      ];
    }
  }
  function iterMsgAdapter(err, msg4) {
    if (err) {
      return [
        err,
        null
      ];
    }
    const ne = checkJsError(msg4);
    if (ne !== null) {
      switch (ne.code) {
        case ErrorCode1.JetStream404NoMessages:
        case ErrorCode1.JetStream408RequestTimeout:
        case ErrorCode1.JetStream409MaxAckPendingExceeded:
          return [
            null,
            null
          ];
        default:
          return [
            ne,
            null
          ];
      }
    }
    if (isFlowControlMsg1(msg4)) {
      msg4.respond();
      return [
        null,
        null
      ];
    }
    const jm = toJsMsg1(msg4);
    try {
      jm.info;
      return [
        null,
        jm
      ];
    } catch (err1) {
      return [
        err1,
        null
      ];
    }
  }
  function autoAckJsMsg(data2) {
    if (data2) {
      data2.ack();
    }
  }
  function ByteArray(n) {
    return new Uint8Array(n);
  }
  function IntArray(n) {
    return new Int32Array(n);
  }
  function NumArray(n) {
    return new Float64Array(n);
  }
  var lookup = [];
  var revLookup = [];
  var code2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (let i = 0, l = code2.length; i < l; ++i) {
    lookup[i] = code2[i];
    revLookup[code2.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  function gf(init) {
    const r = NumArray(16);
    if (init)
      for (let i1 = 0; i1 < init.length; i1++)
        r[i1] = init[i1];
    return r;
  }
  var _9 = ByteArray(32);
  _9[0] = 9;
  var gf0 = gf();
  var gf1 = gf([
    1
  ]);
  var D = gf([
    30883,
    4953,
    19914,
    30187,
    55467,
    16705,
    2637,
    112,
    59544,
    30585,
    16505,
    36039,
    65139,
    11119,
    27886,
    20995
  ]);
  var D2 = gf([
    61785,
    9906,
    39828,
    60374,
    45398,
    33411,
    5274,
    224,
    53552,
    61171,
    33010,
    6542,
    64743,
    22239,
    55772,
    9222
  ]);
  var X = gf([
    54554,
    36645,
    11616,
    51542,
    42930,
    38181,
    51040,
    26924,
    56412,
    64982,
    57905,
    49316,
    21502,
    52590,
    14035,
    8553
  ]);
  var Y = gf([
    26200,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214
  ]);
  var I = gf([
    41136,
    18958,
    6951,
    50414,
    58488,
    44335,
    6150,
    12099,
    55207,
    15867,
    153,
    11085,
    57099,
    20417,
    9344,
    11139
  ]);
  function A(o, a, b) {
    for (let i1 = 0; i1 < 16; i1++)
      o[i1] = a[i1] + b[i1];
  }
  function Z(o, a, b) {
    for (let i1 = 0; i1 < 16; i1++)
      o[i1] = a[i1] - b[i1];
  }
  function M(o, a, b) {
    let v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    v = a[0];
    t0 += v * b0;
    t1 += v * b1;
    t2 += v * b2;
    t3 += v * b3;
    t4 += v * b4;
    t5 += v * b5;
    t6 += v * b6;
    t7 += v * b7;
    t8 += v * b8;
    t9 += v * b9;
    t10 += v * b10;
    t11 += v * b11;
    t12 += v * b12;
    t13 += v * b13;
    t14 += v * b14;
    t15 += v * b15;
    v = a[1];
    t1 += v * b0;
    t2 += v * b1;
    t3 += v * b2;
    t4 += v * b3;
    t5 += v * b4;
    t6 += v * b5;
    t7 += v * b6;
    t8 += v * b7;
    t9 += v * b8;
    t10 += v * b9;
    t11 += v * b10;
    t12 += v * b11;
    t13 += v * b12;
    t14 += v * b13;
    t15 += v * b14;
    t16 += v * b15;
    v = a[2];
    t2 += v * b0;
    t3 += v * b1;
    t4 += v * b2;
    t5 += v * b3;
    t6 += v * b4;
    t7 += v * b5;
    t8 += v * b6;
    t9 += v * b7;
    t10 += v * b8;
    t11 += v * b9;
    t12 += v * b10;
    t13 += v * b11;
    t14 += v * b12;
    t15 += v * b13;
    t16 += v * b14;
    t17 += v * b15;
    v = a[3];
    t3 += v * b0;
    t4 += v * b1;
    t5 += v * b2;
    t6 += v * b3;
    t7 += v * b4;
    t8 += v * b5;
    t9 += v * b6;
    t10 += v * b7;
    t11 += v * b8;
    t12 += v * b9;
    t13 += v * b10;
    t14 += v * b11;
    t15 += v * b12;
    t16 += v * b13;
    t17 += v * b14;
    t18 += v * b15;
    v = a[4];
    t4 += v * b0;
    t5 += v * b1;
    t6 += v * b2;
    t7 += v * b3;
    t8 += v * b4;
    t9 += v * b5;
    t10 += v * b6;
    t11 += v * b7;
    t12 += v * b8;
    t13 += v * b9;
    t14 += v * b10;
    t15 += v * b11;
    t16 += v * b12;
    t17 += v * b13;
    t18 += v * b14;
    t19 += v * b15;
    v = a[5];
    t5 += v * b0;
    t6 += v * b1;
    t7 += v * b2;
    t8 += v * b3;
    t9 += v * b4;
    t10 += v * b5;
    t11 += v * b6;
    t12 += v * b7;
    t13 += v * b8;
    t14 += v * b9;
    t15 += v * b10;
    t16 += v * b11;
    t17 += v * b12;
    t18 += v * b13;
    t19 += v * b14;
    t20 += v * b15;
    v = a[6];
    t6 += v * b0;
    t7 += v * b1;
    t8 += v * b2;
    t9 += v * b3;
    t10 += v * b4;
    t11 += v * b5;
    t12 += v * b6;
    t13 += v * b7;
    t14 += v * b8;
    t15 += v * b9;
    t16 += v * b10;
    t17 += v * b11;
    t18 += v * b12;
    t19 += v * b13;
    t20 += v * b14;
    t21 += v * b15;
    v = a[7];
    t7 += v * b0;
    t8 += v * b1;
    t9 += v * b2;
    t10 += v * b3;
    t11 += v * b4;
    t12 += v * b5;
    t13 += v * b6;
    t14 += v * b7;
    t15 += v * b8;
    t16 += v * b9;
    t17 += v * b10;
    t18 += v * b11;
    t19 += v * b12;
    t20 += v * b13;
    t21 += v * b14;
    t22 += v * b15;
    v = a[8];
    t8 += v * b0;
    t9 += v * b1;
    t10 += v * b2;
    t11 += v * b3;
    t12 += v * b4;
    t13 += v * b5;
    t14 += v * b6;
    t15 += v * b7;
    t16 += v * b8;
    t17 += v * b9;
    t18 += v * b10;
    t19 += v * b11;
    t20 += v * b12;
    t21 += v * b13;
    t22 += v * b14;
    t23 += v * b15;
    v = a[9];
    t9 += v * b0;
    t10 += v * b1;
    t11 += v * b2;
    t12 += v * b3;
    t13 += v * b4;
    t14 += v * b5;
    t15 += v * b6;
    t16 += v * b7;
    t17 += v * b8;
    t18 += v * b9;
    t19 += v * b10;
    t20 += v * b11;
    t21 += v * b12;
    t22 += v * b13;
    t23 += v * b14;
    t24 += v * b15;
    v = a[10];
    t10 += v * b0;
    t11 += v * b1;
    t12 += v * b2;
    t13 += v * b3;
    t14 += v * b4;
    t15 += v * b5;
    t16 += v * b6;
    t17 += v * b7;
    t18 += v * b8;
    t19 += v * b9;
    t20 += v * b10;
    t21 += v * b11;
    t22 += v * b12;
    t23 += v * b13;
    t24 += v * b14;
    t25 += v * b15;
    v = a[11];
    t11 += v * b0;
    t12 += v * b1;
    t13 += v * b2;
    t14 += v * b3;
    t15 += v * b4;
    t16 += v * b5;
    t17 += v * b6;
    t18 += v * b7;
    t19 += v * b8;
    t20 += v * b9;
    t21 += v * b10;
    t22 += v * b11;
    t23 += v * b12;
    t24 += v * b13;
    t25 += v * b14;
    t26 += v * b15;
    v = a[12];
    t12 += v * b0;
    t13 += v * b1;
    t14 += v * b2;
    t15 += v * b3;
    t16 += v * b4;
    t17 += v * b5;
    t18 += v * b6;
    t19 += v * b7;
    t20 += v * b8;
    t21 += v * b9;
    t22 += v * b10;
    t23 += v * b11;
    t24 += v * b12;
    t25 += v * b13;
    t26 += v * b14;
    t27 += v * b15;
    v = a[13];
    t13 += v * b0;
    t14 += v * b1;
    t15 += v * b2;
    t16 += v * b3;
    t17 += v * b4;
    t18 += v * b5;
    t19 += v * b6;
    t20 += v * b7;
    t21 += v * b8;
    t22 += v * b9;
    t23 += v * b10;
    t24 += v * b11;
    t25 += v * b12;
    t26 += v * b13;
    t27 += v * b14;
    t28 += v * b15;
    v = a[14];
    t14 += v * b0;
    t15 += v * b1;
    t16 += v * b2;
    t17 += v * b3;
    t18 += v * b4;
    t19 += v * b5;
    t20 += v * b6;
    t21 += v * b7;
    t22 += v * b8;
    t23 += v * b9;
    t24 += v * b10;
    t25 += v * b11;
    t26 += v * b12;
    t27 += v * b13;
    t28 += v * b14;
    t29 += v * b15;
    v = a[15];
    t15 += v * b0;
    t16 += v * b1;
    t17 += v * b2;
    t18 += v * b3;
    t19 += v * b4;
    t20 += v * b5;
    t21 += v * b6;
    t22 += v * b7;
    t23 += v * b8;
    t24 += v * b9;
    t25 += v * b10;
    t26 += v * b11;
    t27 += v * b12;
    t28 += v * b13;
    t29 += v * b14;
    t30 += v * b15;
    t0 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    o[0] = t0;
    o[1] = t1;
    o[2] = t2;
    o[3] = t3;
    o[4] = t4;
    o[5] = t5;
    o[6] = t6;
    o[7] = t7;
    o[8] = t8;
    o[9] = t9;
    o[10] = t10;
    o[11] = t11;
    o[12] = t12;
    o[13] = t13;
    o[14] = t14;
    o[15] = t15;
  }
  function S(o, a) {
    M(o, a, a);
  }
  function randomBytes(n) {
    let b = ByteArray(n);
    window.crypto.getRandomValues(b);
    return b;
  }
  function vn(x, xi, y, yi, n) {
    let i1, d = 0;
    for (i1 = 0; i1 < n; i1++)
      d |= x[xi + i1] ^ y[yi + i1];
    return (1 & d - 1 >>> 8) - 1;
  }
  var SecretBoxLength;
  (function(SecretBoxLength1) {
    SecretBoxLength1[SecretBoxLength1["Key"] = 32] = "Key";
    SecretBoxLength1[SecretBoxLength1["Nonce"] = 24] = "Nonce";
    SecretBoxLength1[SecretBoxLength1["Overhead"] = 16] = "Overhead";
    SecretBoxLength1[SecretBoxLength1["Zero"] = 32] = "Zero";
  })(SecretBoxLength || (SecretBoxLength = {}));
  function set25519(r, a) {
    for (let i1 = 0; i1 < 16; i1++)
      r[i1] = a[i1] | 0;
  }
  var ScalarLength;
  var BoxLength;
  function _verify_32(x, xi, y, yi) {
    return vn(x, xi, y, yi, 32);
  }
  (function(BoxLength1) {
    BoxLength1[BoxLength1["PublicKey"] = 32] = "PublicKey";
    BoxLength1[BoxLength1["SecretKey"] = 32] = "SecretKey";
    BoxLength1[BoxLength1["SharedKey"] = 32] = "SharedKey";
    BoxLength1[BoxLength1["Nonce"] = SecretBoxLength.Nonce] = "Nonce";
    BoxLength1[BoxLength1["Overhead"] = SecretBoxLength.Overhead] = "Overhead";
  })(BoxLength || (BoxLength = {}));
  function checkArrayTypes(...arrays) {
    for (const array of arrays) {
      if (!(array instanceof Uint8Array)) {
        throw new TypeError("unexpected type, use ByteArray");
      }
    }
  }
  function car25519(o) {
    let i1, v, c = 1;
    for (i1 = 0; i1 < 16; i1++) {
      v = o[i1] + c + 65535;
      c = Math.floor(v / 65536);
      o[i1] = v - c * 65536;
    }
    o[0] += c - 1 + 37 * (c - 1);
  }
  function sel25519(p, q, b) {
    let t, c = ~(b - 1);
    for (let i1 = 0; i1 < 16; i1++) {
      t = c & (p[i1] ^ q[i1]);
      p[i1] ^= t;
      q[i1] ^= t;
    }
  }
  function pack25519(o, n) {
    const m = gf(), t = gf();
    let i1, j, b;
    for (i1 = 0; i1 < 16; i1++)
      t[i1] = n[i1];
    car25519(t);
    car25519(t);
    car25519(t);
    for (j = 0; j < 2; j++) {
      m[0] = t[0] - 65517;
      for (i1 = 1; i1 < 15; i1++) {
        m[i1] = t[i1] - 65535 - (m[i1 - 1] >> 16 & 1);
        m[i1 - 1] &= 65535;
      }
      m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
      b = m[15] >> 16 & 1;
      m[14] &= 65535;
      sel25519(t, m, 1 - b);
    }
    for (i1 = 0; i1 < 16; i1++) {
      o[2 * i1] = t[i1] & 255;
      o[2 * i1 + 1] = t[i1] >> 8;
    }
  }
  function neq25519(a, b) {
    const c = ByteArray(32), d = ByteArray(32);
    pack25519(c, a);
    pack25519(d, b);
    return _verify_32(c, 0, d, 0);
  }
  function par25519(a) {
    const d = ByteArray(32);
    pack25519(d, a);
    return d[0] & 1;
  }
  function unpack25519(o, n) {
    for (let i1 = 0; i1 < 16; i1++)
      o[i1] = n[2 * i1] + (n[2 * i1 + 1] << 8);
    o[15] &= 32767;
  }
  function inv25519(o, i1) {
    const c = gf();
    let a;
    for (a = 0; a < 16; a++)
      c[a] = i1[a];
    for (a = 253; a >= 0; a--) {
      S(c, c);
      if (a !== 2 && a !== 4)
        M(c, c, i1);
    }
    for (a = 0; a < 16; a++)
      o[a] = c[a];
  }
  (function(ScalarLength1) {
    ScalarLength1[ScalarLength1["Scalar"] = 32] = "Scalar";
    ScalarLength1[ScalarLength1["GroupElement"] = 32] = "GroupElement";
  })(ScalarLength || (ScalarLength = {}));
  var HashLength;
  (function(HashLength1) {
    HashLength1[HashLength1["Hash"] = 64] = "Hash";
  })(HashLength || (HashLength = {}));
  function _hash(out, m, n) {
    const hh = IntArray(8), hl = IntArray(8), x = ByteArray(256);
    let i1, b = n;
    hh[0] = 1779033703;
    hh[1] = 3144134277;
    hh[2] = 1013904242;
    hh[3] = 2773480762;
    hh[4] = 1359893119;
    hh[5] = 2600822924;
    hh[6] = 528734635;
    hh[7] = 1541459225;
    hl[0] = 4089235720;
    hl[1] = 2227873595;
    hl[2] = 4271175723;
    hl[3] = 1595750129;
    hl[4] = 2917565137;
    hl[5] = 725511199;
    hl[6] = 4215389547;
    hl[7] = 327033209;
    _hashblocks_hl(hh, hl, m, n);
    n %= 128;
    for (i1 = 0; i1 < n; i1++)
      x[i1] = m[b - n + i1];
    x[n] = 128;
    n = 256 - 128 * (n < 112 ? 1 : 0);
    x[n - 9] = 0;
    _ts64(x, n - 8, b / 536870912 | 0, b << 3);
    _hashblocks_hl(hh, hl, x, n);
    for (i1 = 0; i1 < 8; i1++)
      _ts64(out, 8 * i1, hh[i1], hl[i1]);
    return 0;
  }
  var _K = [
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ];
  function _hashblocks_hl(hh, hl, m, n) {
    const wh = IntArray(16), wl = IntArray(16);
    let bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i1, j, h, l1, a, b, c, d;
    let ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
    let pos = 0;
    while (n >= 128) {
      for (i1 = 0; i1 < 16; i1++) {
        j = 8 * i1 + pos;
        wh[i1] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
        wl[i1] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
      }
      for (i1 = 0; i1 < 80; i1++) {
        bh0 = ah0;
        bh1 = ah1;
        bh2 = ah2;
        bh3 = ah3;
        bh4 = ah4;
        bh5 = ah5;
        bh6 = ah6;
        bh7 = ah7;
        bl0 = al0;
        bl1 = al1;
        bl2 = al2;
        bl3 = al3;
        bl4 = al4;
        bl5 = al5;
        bl6 = al6;
        bl7 = al7;
        h = ah7;
        l1 = al7;
        a = l1 & 65535;
        b = l1 >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
        l1 = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        h = ah4 & ah5 ^ ~ah4 & ah6;
        l1 = al4 & al5 ^ ~al4 & al6;
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        h = _K[i1 * 2];
        l1 = _K[i1 * 2 + 1];
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        h = wh[i1 % 16];
        l1 = wl[i1 % 16];
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        th = c & 65535 | d << 16;
        tl = a & 65535 | b << 16;
        h = th;
        l1 = tl;
        a = l1 & 65535;
        b = l1 >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
        l1 = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
        l1 = al0 & al1 ^ al0 & al2 ^ al1 & al2;
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        bh7 = c & 65535 | d << 16;
        bl7 = a & 65535 | b << 16;
        h = bh3;
        l1 = bl3;
        a = l1 & 65535;
        b = l1 >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = th;
        l1 = tl;
        a += l1 & 65535;
        b += l1 >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        bh3 = c & 65535 | d << 16;
        bl3 = a & 65535 | b << 16;
        ah1 = bh0;
        ah2 = bh1;
        ah3 = bh2;
        ah4 = bh3;
        ah5 = bh4;
        ah6 = bh5;
        ah7 = bh6;
        ah0 = bh7;
        al1 = bl0;
        al2 = bl1;
        al3 = bl2;
        al4 = bl3;
        al5 = bl4;
        al6 = bl5;
        al7 = bl6;
        al0 = bl7;
        if (i1 % 16 === 15) {
          for (j = 0; j < 16; j++) {
            h = wh[j];
            l1 = wl[j];
            a = l1 & 65535;
            b = l1 >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = wh[(j + 9) % 16];
            l1 = wl[(j + 9) % 16];
            a += l1 & 65535;
            b += l1 >>> 16;
            c += h & 65535;
            d += h >>> 16;
            th = wh[(j + 1) % 16];
            tl = wl[(j + 1) % 16];
            h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
            l1 = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
            a += l1 & 65535;
            b += l1 >>> 16;
            c += h & 65535;
            d += h >>> 16;
            th = wh[(j + 14) % 16];
            tl = wl[(j + 14) % 16];
            h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
            l1 = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
            a += l1 & 65535;
            b += l1 >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            wh[j] = c & 65535 | d << 16;
            wl[j] = a & 65535 | b << 16;
          }
        }
      }
      h = ah0;
      l1 = al0;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[0];
      l1 = hl[0];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[0] = ah0 = c & 65535 | d << 16;
      hl[0] = al0 = a & 65535 | b << 16;
      h = ah1;
      l1 = al1;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[1];
      l1 = hl[1];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[1] = ah1 = c & 65535 | d << 16;
      hl[1] = al1 = a & 65535 | b << 16;
      h = ah2;
      l1 = al2;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[2];
      l1 = hl[2];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[2] = ah2 = c & 65535 | d << 16;
      hl[2] = al2 = a & 65535 | b << 16;
      h = ah3;
      l1 = al3;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[3];
      l1 = hl[3];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[3] = ah3 = c & 65535 | d << 16;
      hl[3] = al3 = a & 65535 | b << 16;
      h = ah4;
      l1 = al4;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[4];
      l1 = hl[4];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[4] = ah4 = c & 65535 | d << 16;
      hl[4] = al4 = a & 65535 | b << 16;
      h = ah5;
      l1 = al5;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[5];
      l1 = hl[5];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[5] = ah5 = c & 65535 | d << 16;
      hl[5] = al5 = a & 65535 | b << 16;
      h = ah6;
      l1 = al6;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[6];
      l1 = hl[6];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[6] = ah6 = c & 65535 | d << 16;
      hl[6] = al6 = a & 65535 | b << 16;
      h = ah7;
      l1 = al7;
      a = l1 & 65535;
      b = l1 >>> 16;
      c = h & 65535;
      d = h >>> 16;
      h = hh[7];
      l1 = hl[7];
      a += l1 & 65535;
      b += l1 >>> 16;
      c += h & 65535;
      d += h >>> 16;
      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;
      hh[7] = ah7 = c & 65535 | d << 16;
      hl[7] = al7 = a & 65535 | b << 16;
      pos += 128;
      n -= 128;
    }
    return n;
  }
  function _ts64(x, i1, h, l1) {
    x[i1] = h >> 24 & 255;
    x[i1 + 1] = h >> 16 & 255;
    x[i1 + 2] = h >> 8 & 255;
    x[i1 + 3] = h & 255;
    x[i1 + 4] = l1 >> 24 & 255;
    x[i1 + 5] = l1 >> 16 & 255;
    x[i1 + 6] = l1 >> 8 & 255;
    x[i1 + 7] = l1 & 255;
  }
  var SignLength;
  (function(SignLength1) {
    SignLength1[SignLength1["PublicKey"] = 32] = "PublicKey";
    SignLength1[SignLength1["SecretKey"] = 64] = "SecretKey";
    SignLength1[SignLength1["Seed"] = 32] = "Seed";
    SignLength1[SignLength1["Signature"] = 64] = "Signature";
  })(SignLength || (SignLength = {}));
  function sign(msg4, secretKey) {
    checkArrayTypes(msg4, secretKey);
    if (secretKey.length !== SignLength.SecretKey)
      throw new Error("bad secret key size");
    const signedMsg = ByteArray(SignLength.Signature + msg4.length);
    _sign(signedMsg, msg4, msg4.length, secretKey);
    return signedMsg;
  }
  function sign_detached(msg4, secretKey) {
    const signedMsg = sign(msg4, secretKey);
    const sig = ByteArray(SignLength.Signature);
    for (let i1 = 0; i1 < sig.length; i1++)
      sig[i1] = signedMsg[i1];
    return sig;
  }
  function sign_detached_verify(msg4, sig, publicKey) {
    checkArrayTypes(msg4, sig, publicKey);
    if (sig.length !== SignLength.Signature)
      throw new Error("bad signature size");
    if (publicKey.length !== SignLength.PublicKey)
      throw new Error("bad public key size");
    const sm = ByteArray(SignLength.Signature + msg4.length);
    const m = ByteArray(SignLength.Signature + msg4.length);
    let i1;
    for (i1 = 0; i1 < SignLength.Signature; i1++)
      sm[i1] = sig[i1];
    for (i1 = 0; i1 < msg4.length; i1++)
      sm[i1 + SignLength.Signature] = msg4[i1];
    return _sign_open(m, sm, sm.length, publicKey) >= 0;
  }
  function sign_keyPair_fromSeed(seed) {
    checkArrayTypes(seed);
    if (seed.length !== SignLength.Seed)
      throw new Error("bad seed size");
    const pk = ByteArray(SignLength.PublicKey);
    const sk = ByteArray(SignLength.SecretKey);
    for (let i1 = 0; i1 < 32; i1++)
      sk[i1] = seed[i1];
    _sign_keypair(pk, sk, true);
    return {
      publicKey: pk,
      secretKey: sk
    };
  }
  function _sign_keypair(pk, sk, seeded) {
    const d = ByteArray(64);
    const p = [
      gf(),
      gf(),
      gf(),
      gf()
    ];
    let i1;
    if (!seeded)
      sk.set(randomBytes(32));
    _hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    scalarbase(p, d);
    pack(pk, p);
    for (i1 = 0; i1 < 32; i1++)
      sk[i1 + 32] = pk[i1];
    return 0;
  }
  function _sign(sm, m, n, sk) {
    const d = ByteArray(64), h = ByteArray(64), r = ByteArray(64);
    const x = NumArray(64);
    const p = [
      gf(),
      gf(),
      gf(),
      gf()
    ];
    let i1, j;
    _hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    const smlen = n + 64;
    for (i1 = 0; i1 < n; i1++)
      sm[64 + i1] = m[i1];
    for (i1 = 0; i1 < 32; i1++)
      sm[32 + i1] = d[32 + i1];
    _hash(r, sm.subarray(32), n + 32);
    reduce(r);
    scalarbase(p, r);
    pack(sm, p);
    for (i1 = 32; i1 < 64; i1++)
      sm[i1] = sk[i1];
    _hash(h, sm, n + 64);
    reduce(h);
    for (i1 = 0; i1 < 64; i1++)
      x[i1] = 0;
    for (i1 = 0; i1 < 32; i1++)
      x[i1] = r[i1];
    for (i1 = 0; i1 < 32; i1++) {
      for (j = 0; j < 32; j++) {
        x[i1 + j] += h[i1] * d[j];
      }
    }
    modL(sm.subarray(32), x);
    return smlen;
  }
  function _sign_open(m, sm, n, pk) {
    const t = ByteArray(32), h = ByteArray(64);
    const p = [
      gf(),
      gf(),
      gf(),
      gf()
    ], q = [
      gf(),
      gf(),
      gf(),
      gf()
    ];
    let i1, mlen;
    mlen = -1;
    if (n < 64 || unpackneg(q, pk))
      return -1;
    for (i1 = 0; i1 < n; i1++)
      m[i1] = sm[i1];
    for (i1 = 0; i1 < 32; i1++)
      m[i1 + 32] = pk[i1];
    _hash(h, m, n);
    reduce(h);
    scalarmult(p, q, h);
    scalarbase(q, sm.subarray(32));
    add(p, q);
    pack(t, p);
    n -= 64;
    if (_verify_32(sm, 0, t, 0)) {
      for (i1 = 0; i1 < n; i1++)
        m[i1] = 0;
      return -1;
    }
    for (i1 = 0; i1 < n; i1++)
      m[i1] = sm[i1 + 64];
    mlen = n;
    return mlen;
  }
  function scalarbase(p, s) {
    const q = [
      gf(),
      gf(),
      gf(),
      gf()
    ];
    set25519(q[0], X);
    set25519(q[1], Y);
    set25519(q[2], gf1);
    M(q[3], X, Y);
    scalarmult(p, q, s);
  }
  function scalarmult(p, q, s) {
    let b, i1;
    set25519(p[0], gf0);
    set25519(p[1], gf1);
    set25519(p[2], gf1);
    set25519(p[3], gf0);
    for (i1 = 255; i1 >= 0; --i1) {
      b = s[i1 / 8 | 0] >> (i1 & 7) & 1;
      cswap(p, q, b);
      add(q, p);
      add(p, p);
      cswap(p, q, b);
    }
  }
  function pack(r, p) {
    const tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p[2]);
    M(tx, p[0], zi);
    M(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
  }
  function unpackneg(r, p) {
    const t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    set25519(r[2], gf1);
    unpack25519(r[1], p);
    S(num, r[1]);
    M(den, num, D);
    Z(num, num, r[2]);
    A(den, r[2], den);
    S(den2, den);
    S(den4, den2);
    M(den6, den4, den2);
    M(t, den6, num);
    M(t, t, den);
    pow2523(t, t);
    M(t, t, num);
    M(t, t, den);
    M(t, t, den);
    M(r[0], t, den);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num))
      M(r[0], r[0], I);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num))
      return -1;
    if (par25519(r[0]) === p[31] >> 7)
      Z(r[0], gf0, r[0]);
    M(r[3], r[0], r[1]);
    return 0;
  }
  function reduce(r) {
    const x = NumArray(64);
    let i1;
    for (i1 = 0; i1 < 64; i1++)
      x[i1] = r[i1];
    for (i1 = 0; i1 < 64; i1++)
      r[i1] = 0;
    modL(r, x);
  }
  var L = NumArray([
    237,
    211,
    245,
    92,
    26,
    99,
    18,
    88,
    214,
    156,
    247,
    162,
    222,
    249,
    222,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16
  ]);
  function modL(r, x) {
    let carry, i1, j, k;
    for (i1 = 63; i1 >= 32; --i1) {
      carry = 0;
      for (j = i1 - 32, k = i1 - 12; j < k; ++j) {
        x[j] += carry - 16 * x[i1] * L[j - (i1 - 32)];
        carry = x[j] + 128 >> 8;
        x[j] -= carry * 256;
      }
      x[j] += carry;
      x[i1] = 0;
    }
    carry = 0;
    for (j = 0; j < 32; j++) {
      x[j] += carry - (x[31] >> 4) * L[j];
      carry = x[j] >> 8;
      x[j] &= 255;
    }
    for (j = 0; j < 32; j++)
      x[j] -= carry * L[j];
    for (i1 = 0; i1 < 32; i1++) {
      x[i1 + 1] += x[i1] >> 8;
      r[i1] = x[i1] & 255;
    }
  }
  function add(p, q) {
    const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
    Z(a, p[1], p[0]);
    Z(t, q[1], q[0]);
    M(a, a, t);
    A(b, p[0], p[1]);
    A(t, q[0], q[1]);
    M(b, b, t);
    M(c, p[3], q[3]);
    M(c, c, D2);
    M(d, p[2], q[2]);
    A(d, d, d);
    Z(e, b, a);
    Z(f, d, c);
    A(g, d, c);
    A(h, b, a);
    M(p[0], e, f);
    M(p[1], h, g);
    M(p[2], g, f);
    M(p[3], e, h);
  }
  function cswap(p, q, b) {
    for (let i1 = 0; i1 < 4; i1++) {
      sel25519(p[i1], q[i1], b);
    }
  }
  function pow2523(o, i1) {
    const c = gf();
    let a;
    for (a = 0; a < 16; a++)
      c[a] = i1[a];
    for (a = 250; a >= 0; a--) {
      S(c, c);
      if (a !== 1)
        M(c, c, i1);
    }
    for (a = 0; a < 16; a++)
      o[a] = c[a];
  }
  var AuthLength;
  (function(AuthLength1) {
    AuthLength1[AuthLength1["Auth"] = 32] = "Auth";
    AuthLength1[AuthLength1["AuthFull"] = 64] = "AuthFull";
    AuthLength1[AuthLength1["Key"] = 32] = "Key";
  })(AuthLength || (AuthLength = {}));
  var SealedBoxLength;
  (function(SealedBoxLength1) {
    SealedBoxLength1[SealedBoxLength1["PublicKey"] = BoxLength.PublicKey] = "PublicKey";
    SealedBoxLength1[SealedBoxLength1["SecretKey"] = BoxLength.SecretKey] = "SecretKey";
    SealedBoxLength1[SealedBoxLength1["Nonce"] = BoxLength.Nonce] = "Nonce";
    SealedBoxLength1[SealedBoxLength1["Overhead"] = BoxLength.PublicKey + BoxLength.Overhead] = "Overhead";
  })(SealedBoxLength || (SealedBoxLength = {}));
  var denoHelper = {
    fromSeed: sign_keyPair_fromSeed,
    sign: sign_detached,
    verify: sign_detached_verify,
    randomBytes
  };
  var helper;
  function setEd25519Helper(lib) {
    helper = lib;
  }
  function getEd25519Helper() {
    return helper;
  }
  var crc16tab = new Uint16Array([
    0,
    4129,
    8258,
    12387,
    16516,
    20645,
    24774,
    28903,
    33032,
    37161,
    41290,
    45419,
    49548,
    53677,
    57806,
    61935,
    4657,
    528,
    12915,
    8786,
    21173,
    17044,
    29431,
    25302,
    37689,
    33560,
    45947,
    41818,
    54205,
    50076,
    62463,
    58334,
    9314,
    13379,
    1056,
    5121,
    25830,
    29895,
    17572,
    21637,
    42346,
    46411,
    34088,
    38153,
    58862,
    62927,
    50604,
    54669,
    13907,
    9842,
    5649,
    1584,
    30423,
    26358,
    22165,
    18100,
    46939,
    42874,
    38681,
    34616,
    63455,
    59390,
    55197,
    51132,
    18628,
    22757,
    26758,
    30887,
    2112,
    6241,
    10242,
    14371,
    51660,
    55789,
    59790,
    63919,
    35144,
    39273,
    43274,
    47403,
    23285,
    19156,
    31415,
    27286,
    6769,
    2640,
    14899,
    10770,
    56317,
    52188,
    64447,
    60318,
    39801,
    35672,
    47931,
    43802,
    27814,
    31879,
    19684,
    23749,
    11298,
    15363,
    3168,
    7233,
    60846,
    64911,
    52716,
    56781,
    44330,
    48395,
    36200,
    40265,
    32407,
    28342,
    24277,
    20212,
    15891,
    11826,
    7761,
    3696,
    65439,
    61374,
    57309,
    53244,
    48923,
    44858,
    40793,
    36728,
    37256,
    33193,
    45514,
    41451,
    53516,
    49453,
    61774,
    57711,
    4224,
    161,
    12482,
    8419,
    20484,
    16421,
    28742,
    24679,
    33721,
    37784,
    41979,
    46042,
    49981,
    54044,
    58239,
    62302,
    689,
    4752,
    8947,
    13010,
    16949,
    21012,
    25207,
    29270,
    46570,
    42443,
    38312,
    34185,
    62830,
    58703,
    54572,
    50445,
    13538,
    9411,
    5280,
    1153,
    29798,
    25671,
    21540,
    17413,
    42971,
    47098,
    34713,
    38840,
    59231,
    63358,
    50973,
    55100,
    9939,
    14066,
    1681,
    5808,
    26199,
    30326,
    17941,
    22068,
    55628,
    51565,
    63758,
    59695,
    39368,
    35305,
    47498,
    43435,
    22596,
    18533,
    30726,
    26663,
    6336,
    2273,
    14466,
    10403,
    52093,
    56156,
    60223,
    64286,
    35833,
    39896,
    43963,
    48026,
    19061,
    23124,
    27191,
    31254,
    2801,
    6864,
    10931,
    14994,
    64814,
    60687,
    56684,
    52557,
    48554,
    44427,
    40424,
    36297,
    31782,
    27655,
    23652,
    19525,
    15522,
    11395,
    7392,
    3265,
    61215,
    65342,
    53085,
    57212,
    44955,
    49082,
    36825,
    40952,
    28183,
    32310,
    20053,
    24180,
    11923,
    16050,
    3793,
    7920
  ]);
  var crc16 = class {
    static checksum(data) {
      let crc = 0;
      for (let i1 = 0; i1 < data.byteLength; i1++) {
        let b = data[i1];
        crc = crc << 8 & 65535 ^ crc16tab[(crc >> 8 ^ b) & 255];
      }
      return crc;
    }
    static validate(data, expected) {
      let ba = crc16.checksum(data);
      return ba == expected;
    }
  };
  var b32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  var base32 = class {
    static encode(src) {
      let bits = 0;
      let value = 0;
      let a = new Uint8Array(src);
      let buf = new Uint8Array(src.byteLength * 2);
      let j = 0;
      for (let i1 = 0; i1 < a.byteLength; i1++) {
        value = value << 8 | a[i1];
        bits += 8;
        while (bits >= 5) {
          let index = value >>> bits - 5 & 31;
          buf[j++] = b32Alphabet.charAt(index).charCodeAt(0);
          bits -= 5;
        }
      }
      if (bits > 0) {
        let index = value << 5 - bits & 31;
        buf[j++] = b32Alphabet.charAt(index).charCodeAt(0);
      }
      return buf.slice(0, j);
    }
    static decode(src) {
      let bits = 0;
      let __byte = 0;
      let j = 0;
      let a = new Uint8Array(src);
      let out = new Uint8Array(a.byteLength * 5 / 8 | 0);
      for (let i1 = 0; i1 < a.byteLength; i1++) {
        let v = String.fromCharCode(a[i1]);
        let vv = b32Alphabet.indexOf(v);
        if (vv === -1) {
          throw new Error("Illegal Base32 character: " + a[i1]);
        }
        __byte = __byte << 5 | vv;
        bits += 5;
        if (bits >= 8) {
          out[j++] = __byte >>> bits - 8 & 255;
          bits -= 8;
        }
      }
      return out.slice(0, j);
    }
  };
  var NKeysError = class extends Error {
    name;
    code;
    chainedError;
    constructor(code3, chainedError2) {
      super(code3);
      this.name = "NKeysError";
      this.code = code3;
      this.chainedError = chainedError2;
    }
  };
  function createOperator() {
    return createPair(Prefix.Operator);
  }
  function createAccount() {
    return createPair(Prefix.Account);
  }
  function createUser() {
    return createPair(Prefix.User);
  }
  var NKeysErrorCode;
  (function(NKeysErrorCode1) {
    NKeysErrorCode1["InvalidPrefixByte"] = "nkeys: invalid prefix byte";
    NKeysErrorCode1["InvalidKey"] = "nkeys: invalid key";
    NKeysErrorCode1["InvalidPublicKey"] = "nkeys: invalid public key";
    NKeysErrorCode1["InvalidSeedLen"] = "nkeys: invalid seed length";
    NKeysErrorCode1["InvalidSeed"] = "nkeys: invalid seed";
    NKeysErrorCode1["InvalidEncoding"] = "nkeys: invalid encoded key";
    NKeysErrorCode1["InvalidSignature"] = "nkeys: signature verification failed";
    NKeysErrorCode1["CannotSign"] = "nkeys: cannot sign, no private key available";
    NKeysErrorCode1["PublicKeyOnly"] = "nkeys: no seed or private key available";
    NKeysErrorCode1["InvalidChecksum"] = "nkeys: invalid checksum";
    NKeysErrorCode1["SerializationError"] = "nkeys: serialization error";
    NKeysErrorCode1["ApiError"] = "nkeys: api error";
    NKeysErrorCode1["ClearedPair"] = "nkeys: pair is cleared";
  })(NKeysErrorCode || (NKeysErrorCode = {}));
  var Prefix;
  (function(Prefix1) {
    Prefix1[Prefix1["Seed"] = 144] = "Seed";
    Prefix1[Prefix1["Private"] = 120] = "Private";
    Prefix1[Prefix1["Operator"] = 112] = "Operator";
    Prefix1[Prefix1["Server"] = 104] = "Server";
    Prefix1[Prefix1["Cluster"] = 16] = "Cluster";
    Prefix1[Prefix1["Account"] = 0] = "Account";
    Prefix1[Prefix1["User"] = 160] = "User";
  })(Prefix || (Prefix = {}));
  var Prefixes = class {
    static isValidPublicPrefix(prefix) {
      return prefix == Prefix.Server || prefix == Prefix.Operator || prefix == Prefix.Cluster || prefix == Prefix.Account || prefix == Prefix.User;
    }
    static startsWithValidPrefix(s) {
      let c = s[0];
      return c == "S" || c == "P" || c == "O" || c == "N" || c == "C" || c == "A" || c == "U";
    }
    static isValidPrefix(prefix) {
      let v = this.parsePrefix(prefix);
      return v != -1;
    }
    static parsePrefix(v) {
      switch (v) {
        case Prefix.Seed:
          return Prefix.Seed;
        case Prefix.Private:
          return Prefix.Private;
        case Prefix.Operator:
          return Prefix.Operator;
        case Prefix.Server:
          return Prefix.Server;
        case Prefix.Cluster:
          return Prefix.Cluster;
        case Prefix.Account:
          return Prefix.Account;
        case Prefix.User:
          return Prefix.User;
        default:
          return -1;
      }
    }
  };
  var Codec = class {
    static encode(prefix, src) {
      if (!src || !(src instanceof Uint8Array)) {
        throw new NKeysError(NKeysErrorCode.SerializationError);
      }
      if (!Prefixes.isValidPrefix(prefix)) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      return Codec._encode(false, prefix, src);
    }
    static encodeSeed(role, src) {
      if (!src) {
        throw new NKeysError(NKeysErrorCode.ApiError);
      }
      if (!Prefixes.isValidPublicPrefix(role)) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      if (src.byteLength !== 32) {
        throw new NKeysError(NKeysErrorCode.InvalidSeedLen);
      }
      return Codec._encode(true, role, src);
    }
    static decode(expected, src) {
      if (!Prefixes.isValidPrefix(expected)) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      const raw = Codec._decode(src);
      if (raw[0] !== expected) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      return raw.slice(1);
    }
    static decodeSeed(src) {
      const raw = Codec._decode(src);
      const prefix = Codec._decodePrefix(raw);
      if (prefix[0] != Prefix.Seed) {
        throw new NKeysError(NKeysErrorCode.InvalidSeed);
      }
      if (!Prefixes.isValidPublicPrefix(prefix[1])) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      return {
        buf: raw.slice(2),
        prefix: prefix[1]
      };
    }
    static _encode(seed, role, payload) {
      const payloadOffset = seed ? 2 : 1;
      const payloadLen = payload.byteLength;
      const checkLen = 2;
      const cap = payloadOffset + payloadLen + 2;
      const checkOffset = payloadOffset + payloadLen;
      const raw = new Uint8Array(cap);
      if (seed) {
        const encodedPrefix = Codec._encodePrefix(Prefix.Seed, role);
        raw.set(encodedPrefix);
      } else {
        raw[0] = role;
      }
      raw.set(payload, payloadOffset);
      const checksum = crc16.checksum(raw.slice(0, checkOffset));
      const dv = new DataView(raw.buffer);
      dv.setUint16(checkOffset, checksum, true);
      return base32.encode(raw);
    }
    static _decode(src) {
      if (src.byteLength < 4) {
        throw new NKeysError(NKeysErrorCode.InvalidEncoding);
      }
      let raw;
      try {
        raw = base32.decode(src);
      } catch (ex) {
        throw new NKeysError(NKeysErrorCode.InvalidEncoding, ex);
      }
      const checkOffset = raw.byteLength - 2;
      const dv = new DataView(raw.buffer);
      const checksum = dv.getUint16(checkOffset, true);
      const payload = raw.slice(0, checkOffset);
      if (!crc16.validate(payload, checksum)) {
        throw new NKeysError(NKeysErrorCode.InvalidChecksum);
      }
      return payload;
    }
    static _encodePrefix(kind, role) {
      const b1 = kind | role >> 5;
      const b2 = (role & 31) << 3;
      return new Uint8Array([
        b1,
        b2
      ]);
    }
    static _decodePrefix(raw) {
      const b1 = raw[0] & 248;
      const b2 = (raw[0] & 7) << 5 | (raw[1] & 248) >> 3;
      return new Uint8Array([
        b1,
        b2
      ]);
    }
  };
  var KP = class {
    seed;
    constructor(seed) {
      this.seed = seed;
    }
    getRawSeed() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      let sd = Codec.decodeSeed(this.seed);
      return sd.buf;
    }
    getSeed() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      return this.seed;
    }
    getPublicKey() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const sd = Codec.decodeSeed(this.seed);
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      const buf = Codec.encode(sd.prefix, kp.publicKey);
      return new TextDecoder().decode(buf);
    }
    getPrivateKey() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      return Codec.encode(Prefix.Private, kp.secretKey);
    }
    sign(input) {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      return getEd25519Helper().sign(input, kp.secretKey);
    }
    verify(input, sig) {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      return getEd25519Helper().verify(input, sig, kp.publicKey);
    }
    clear() {
      if (!this.seed) {
        return;
      }
      this.seed.fill(0);
      this.seed = void 0;
    }
  };
  function createPair(prefix) {
    const rawSeed = getEd25519Helper().randomBytes(32);
    let str = Codec.encodeSeed(prefix, new Uint8Array(rawSeed));
    return new KP(str);
  }
  var PublicKey = class {
    publicKey;
    constructor(publicKey) {
      this.publicKey = publicKey;
    }
    getPublicKey() {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      return new TextDecoder().decode(this.publicKey);
    }
    getPrivateKey() {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      throw new NKeysError(NKeysErrorCode.PublicKeyOnly);
    }
    getSeed() {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      throw new NKeysError(NKeysErrorCode.PublicKeyOnly);
    }
    sign(_) {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      throw new NKeysError(NKeysErrorCode.CannotSign);
    }
    verify(input, sig) {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      let buf = Codec._decode(this.publicKey);
      return getEd25519Helper().verify(input, sig, buf.slice(1));
    }
    clear() {
      if (!this.publicKey) {
        return;
      }
      this.publicKey.fill(0);
      this.publicKey = void 0;
    }
  };
  function fromPublic(src) {
    const ba = new TextEncoder().encode(src);
    const raw = Codec._decode(ba);
    const prefix = Prefixes.parsePrefix(raw[0]);
    if (Prefixes.isValidPublicPrefix(prefix)) {
      return new PublicKey(ba);
    }
    throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
  }
  function fromSeed(src) {
    Codec.decodeSeed(src);
    return new KP(src);
  }
  function encode(bytes) {
    return btoa(String.fromCharCode(...bytes));
  }
  function decode(b64str) {
    const bin = atob(b64str);
    const bytes = new Uint8Array(bin.length);
    for (let i1 = 0; i1 < bin.length; i1++) {
      bytes[i1] = bin.charCodeAt(i1);
    }
    return bytes;
  }
  setEd25519Helper(denoHelper);
  var mod = function() {
    return {
      createAccount,
      createOperator,
      createPair,
      createUser,
      fromPublic,
      fromSeed,
      NKeysError,
      NKeysErrorCode,
      Prefix,
      decode,
      encode
    };
  }();
  function buildAuthenticator(opts14) {
    if (opts14.authenticator) {
      return opts14.authenticator;
    }
    if (opts14.token) {
      return tokenFn(opts14.token);
    }
    if (opts14.user) {
      return passFn(opts14.user, opts14.pass);
    }
    return noAuthFn();
  }
  function defaultOptions() {
    return {
      maxPingOut: 2,
      maxReconnectAttempts: 10,
      noRandomize: false,
      pedantic: false,
      pingInterval: DEFAULT_PING_INTERVAL,
      reconnect: true,
      reconnectJitter: 100,
      reconnectJitterTLS: 1e3,
      reconnectTimeWait: DEFAULT_RECONNECT_TIME_WAIT,
      tls: void 0,
      verbose: false,
      waitOnFirstConnect: false
    };
  }
  function parseOptions(opts14) {
    const dhp = `${DEFAULT_HOST}:${defaultPort()}`;
    opts14 = opts14 || {
      servers: [
        dhp
      ]
    };
    if (opts14.port) {
      opts14.servers = [
        `${DEFAULT_HOST}:${opts14.port}`
      ];
    }
    if (typeof opts14.servers === "string") {
      opts14.servers = [
        opts14.servers
      ];
    }
    if (opts14.servers && opts14.servers.length === 0) {
      opts14.servers = [
        dhp
      ];
    }
    const options2 = extend1(defaultOptions(), opts14);
    if (opts14.user && opts14.token) {
      throw NatsError1.errorForCode(ErrorCode1.BadAuthentication);
    }
    if (opts14.authenticator && (opts14.token || opts14.user || opts14.pass)) {
      throw NatsError1.errorForCode(ErrorCode1.BadAuthentication);
    }
    options2.authenticator = buildAuthenticator(options2);
    [
      "reconnectDelayHandler",
      "authenticator"
    ].forEach((n) => {
      if (options2[n] && typeof options2[n] !== "function") {
        throw new NatsError1(`${n} option should be a function`, ErrorCode1.NotFunction);
      }
    });
    if (!options2.reconnectDelayHandler) {
      options2.reconnectDelayHandler = () => {
        let extra = options2.tls ? options2.reconnectJitterTLS : options2.reconnectJitter;
        if (extra) {
          extra++;
          extra = Math.floor(Math.random() * extra);
        }
        return options2.reconnectTimeWait + extra;
      };
    }
    if (options2.inboxPrefix) {
      try {
        createInbox1(options2.inboxPrefix);
      } catch (err) {
        throw new NatsError1(err.message, ErrorCode1.ApiError);
      }
    }
    return options2;
  }
  var NatsConnectionImpl1 = class {
    options;
    protocol;
    draining;
    listeners;
    constructor(opts14) {
      this.draining = false;
      this.options = parseOptions(opts14);
      this.listeners = [];
    }
    static connect(opts = {}) {
      return new Promise((resolve, reject) => {
        const nc8 = new NatsConnectionImpl1(opts);
        ProtocolHandler1.connect(nc8.options, nc8).then((ph1) => {
          nc8.protocol = ph1;
          (async function() {
            for await (const s of ph1.status()) {
              nc8.listeners.forEach((l1) => {
                l1.push(s);
              });
            }
          })();
          resolve(nc8);
        }).catch((err) => {
          reject(err);
        });
      });
    }
    closed() {
      return this.protocol.closed;
    }
    async close() {
      await this.protocol.close();
    }
    publish(subject, data = Empty1, options) {
      subject = subject || "";
      if (subject.length === 0) {
        throw NatsError1.errorForCode(ErrorCode1.BadSubject);
      }
      if (data && !isUint8Array(data)) {
        throw NatsError1.errorForCode(ErrorCode1.BadPayload);
      }
      this.protocol.publish(subject, data, options);
    }
    subscribe(subject, opts = {}) {
      if (this.isClosed()) {
        throw NatsError1.errorForCode(ErrorCode1.ConnectionClosed);
      }
      if (this.isDraining()) {
        throw NatsError1.errorForCode(ErrorCode1.ConnectionDraining);
      }
      subject = subject || "";
      if (subject.length === 0) {
        throw NatsError1.errorForCode(ErrorCode1.BadSubject);
      }
      const sub = new SubscriptionImpl1(this.protocol, subject, opts);
      this.protocol.subscribe(sub);
      return sub;
    }
    request(subject, data = Empty1, opts = {
      timeout: 1e3,
      noMux: false
    }) {
      if (this.isClosed()) {
        return Promise.reject(NatsError1.errorForCode(ErrorCode1.ConnectionClosed));
      }
      if (this.isDraining()) {
        return Promise.reject(NatsError1.errorForCode(ErrorCode1.ConnectionDraining));
      }
      subject = subject || "";
      if (subject.length === 0) {
        return Promise.reject(NatsError1.errorForCode(ErrorCode1.BadSubject));
      }
      opts.timeout = opts.timeout || 1e3;
      if (opts.timeout < 1) {
        return Promise.reject(new NatsError1("timeout", ErrorCode1.InvalidOption));
      }
      if (!opts.noMux && opts.reply) {
        return Promise.reject(new NatsError1("reply can only be used with noMux", ErrorCode1.InvalidOption));
      }
      if (opts.noMux) {
        const inbox = opts.reply ? opts.reply : createInbox1(this.options.inboxPrefix);
        const d = deferred1();
        this.subscribe(inbox, {
          max: 1,
          timeout: opts.timeout,
          callback: (err, msg4) => {
            if (err) {
              d.reject(err);
            } else {
              err = isRequestError(msg4);
              if (err) {
                d.reject(err);
              } else {
                d.resolve(msg4);
              }
            }
          }
        });
        this.publish(subject, data, {
          reply: inbox
        });
        return d;
      } else {
        const r = new Request1(this.protocol.muxSubscriptions, opts);
        this.protocol.request(r);
        try {
          this.publish(subject, data, {
            reply: `${this.protocol.muxSubscriptions.baseInbox}${r.token}`,
            headers: opts.headers
          });
        } catch (err) {
          r.cancel(err);
        }
        const p = Promise.race([
          r.timer,
          r.deferred
        ]);
        p.catch(() => {
          r.cancel();
        });
        return p;
      }
    }
    flush() {
      return this.protocol.flush();
    }
    drain() {
      if (this.isClosed()) {
        return Promise.reject(NatsError1.errorForCode(ErrorCode1.ConnectionClosed));
      }
      if (this.isDraining()) {
        return Promise.reject(NatsError1.errorForCode(ErrorCode1.ConnectionDraining));
      }
      this.draining = true;
      return this.protocol.drain();
    }
    isClosed() {
      return this.protocol.isClosed();
    }
    isDraining() {
      return this.draining;
    }
    getServer() {
      const srv = this.protocol.getServer();
      return srv ? srv.listen : "";
    }
    status() {
      const iter = new QueuedIteratorImpl();
      this.listeners.push(iter);
      return iter;
    }
    get info() {
      return this.protocol.isClosed() ? void 0 : this.protocol.info;
    }
    stats() {
      return {
        inBytes: this.protocol.inBytes,
        outBytes: this.protocol.outBytes,
        inMsgs: this.protocol.inMsgs,
        outMsgs: this.protocol.outMsgs
      };
    }
    async jetstreamManager(opts = {}) {
      jetstreamPreview(this);
      const adm = new JetStreamManagerImpl(this, opts);
      try {
        await adm.getAccountInfo();
      } catch (err) {
        const ne = err;
        if (ne.code === ErrorCode1.NoResponders) {
          throw NatsError1.errorForCode(ErrorCode1.JetStreamNotEnabled);
        }
        throw ne;
      }
      return adm;
    }
    jetstream(opts = {}) {
      jetstreamPreview(this);
      return new JetStreamClientImpl(this, opts);
    }
  };
  function checkOptions1(info, options2) {
    const { proto, tls_required: tlsRequired } = info;
    if ((proto === void 0 || proto < 1) && options2.noEcho) {
      throw new NatsError1("noEcho", ErrorCode1.ServerOptionNotAvailable);
    }
    if (options2.tls && !tlsRequired) {
      throw new NatsError1("tls", ErrorCode1.ServerOptionNotAvailable);
    }
  }
  function noAuthFn() {
    return () => {
      return;
    };
  }
  function passFn(user, pass) {
    return () => {
      return {
        user,
        pass
      };
    };
  }
  function tokenFn(token) {
    return () => {
      return {
        auth_token: token
      };
    };
  }
  var jetstreamPreview = (() => {
    let once = false;
    return (nci) => {
      if (!once) {
        once = true;
        const { lang } = nci?.protocol?.transport;
        if (lang) {
          console.log(`[33m >> jetstream functionality in ${lang} is preview functionality [0m`);
        } else {
          console.log(`[33m >> jetstream functionality is preview functionality [0m`);
        }
      }
    };
  })();
  var VERSION = "1.2.0";
  var LANG = "nats.ws";
  var WsTransport = class {
    version;
    lang;
    closeError;
    connected;
    done;
    socket;
    options;
    socketClosed;
    encrypted;
    peeked;
    yields;
    signal;
    closedNotification;
    constructor() {
      this.version = VERSION;
      this.lang = LANG;
      this.connected = false;
      this.done = false;
      this.socketClosed = false;
      this.encrypted = false;
      this.peeked = false;
      this.yields = [];
      this.signal = deferred1();
      this.closedNotification = deferred1();
    }
    connect(server, options) {
      const connected = false;
      const connLock = deferred1();
      if (options.tls) {
        connLock.reject(new NatsError1("tls", ErrorCode1.InvalidOption));
        return connLock;
      }
      this.options = options;
      const u2 = server.src;
      this.encrypted = u2.indexOf("wss://") === 0;
      this.socket = new WebSocket(u2);
      this.socket.binaryType = "arraybuffer";
      this.socket.onopen = () => {
      };
      this.socket.onmessage = (me) => {
        this.yields.push(new Uint8Array(me.data));
        if (this.peeked) {
          this.signal.resolve();
          return;
        }
        const t = DataBuffer1.concat(...this.yields);
        const pm = extractProtocolMessage1(t);
        if (pm) {
          const m = INFO1.exec(pm);
          if (!m) {
            if (options.debug) {
              console.error("!!!", render1(t));
            }
            connLock.reject(new Error("unexpected response from server"));
            return;
          }
          try {
            const info = JSON.parse(m[1]);
            checkOptions1(info, this.options);
            this.peeked = true;
            this.connected = true;
            this.signal.resolve();
            connLock.resolve();
          } catch (err) {
            connLock.reject(err);
            return;
          }
        }
      };
      this.socket.onclose = (evt) => {
        this.socketClosed = true;
        let reason;
        if (this.done)
          return;
        if (!evt.wasClean) {
          reason = new Error(evt.reason);
        }
        this._closed(reason);
      };
      this.socket.onerror = (e) => {
        const evt = e;
        const err = new NatsError1(evt.message, ErrorCode1.Unknown, new Error(evt.error));
        if (!connected) {
          connLock.reject(err);
        } else {
          this._closed(err);
        }
      };
      return connLock;
    }
    disconnect() {
      this._closed(void 0, true);
    }
    async _closed(err, internal = true) {
      if (!this.connected)
        return;
      if (this.done)
        return;
      this.closeError = err;
      if (!err) {
        while (!this.socketClosed && this.socket.bufferedAmount > 0) {
          console.log(this.socket.bufferedAmount);
          await delay1(100);
        }
      }
      this.done = true;
      try {
        this.socket.close(err ? 1002 : 1e3, err ? err.message : void 0);
      } catch (err2) {
      }
      if (internal) {
        this.closedNotification.resolve(err);
      }
    }
    get isClosed() {
      return this.done;
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
    async *iterate() {
      while (true) {
        if (this.yields.length === 0) {
          await this.signal;
        }
        const yields = this.yields;
        this.yields = [];
        for (let i1 = 0; i1 < yields.length; i1++) {
          if (this.options.debug) {
            console.info(`> ${render1(yields[i1])}`);
          }
          yield yields[i1];
        }
        if (this.done) {
          break;
        } else if (this.yields.length === 0) {
          yields.length = 0;
          this.yields = yields;
          this.signal = deferred1();
        }
      }
    }
    isEncrypted() {
      return this.connected && this.encrypted;
    }
    send(frame) {
      if (this.done) {
        return Promise.resolve();
      }
      try {
        this.socket.send(frame.buffer);
        if (this.options.debug) {
          console.info(`< ${render1(frame)}`);
        }
        return Promise.resolve();
      } catch (err) {
        if (this.options.debug) {
          console.error(`!!! ${render1(frame)}: ${err}`);
        }
        return Promise.reject(err);
      }
    }
    close(err) {
      return this._closed(err, false);
    }
    closed() {
      return this.closedNotification;
    }
  };
  function wsUrlParseFn(u2) {
    const ut = /^(.*:\/\/)(.*)/;
    if (!ut.test(u2)) {
      u2 = `https://${u2}`;
    }
    let url1 = new URL(u2);
    const srcProto = url1.protocol.toLowerCase();
    if (srcProto !== "https:" && srcProto !== "http") {
      u2 = u2.replace(/^(.*:\/\/)(.*)/gm, "$2");
      url1 = new URL(`http://${u2}`);
    }
    let protocol2;
    let port;
    const host = url1.hostname;
    const path = url1.pathname;
    const search = url1.search || "";
    switch (srcProto) {
      case "http:":
      case "ws:":
      case "nats:":
        port = url1.port || "80";
        protocol2 = "ws:";
        break;
      default:
        port = url1.port || "443";
        protocol2 = "wss:";
        break;
    }
    return `${protocol2}//${host}:${port}${path}${search}`;
  }
  function connect1(opts15 = {}) {
    setTransportFactory1({
      defaultPort: 443,
      urlParseFn: wsUrlParseFn,
      factory: () => {
        return new WsTransport();
      }
    });
    return NatsConnectionImpl1.connect(opts15);
  }

  // src/idomworkernats.js
  var sc = StringCodec1();
  async function handle(s) {
    for await (const m of s) {
      postMessage({ action: "message", topic: m.subject.replaceAll(".", "/"), payload: sc.decode(m.data) });
    }
    console.log("subscription closed");
  }
  var client = void 0;
  onmessage = (m) => {
    if (m.data && m.data.action) {
      switch (m.data.action) {
        case "logout":
          client.close();
          break;
        case "connect":
          console.log("connect");
          connect1({ servers: m.data.url, user: m.data.username, pass: m.data.password, pingInterval: 2e3, maxReconnectAttempts: -1 }).then((cli) => {
            client = cli;
            postMessage({ action: "connected" });
            handle(client.subscribe("stat.>"));
            handle(client.subscribe("tele.>"));
            handle(client.subscribe("hikmqtt.>"));
            handle(client.subscribe("weather.>"));
            client.publish("cmnd.tasmotas.STATE", sc.encode(""));
            client.publish("cmnd.tasmotas.STATUS", sc.encode(""));
            client.publish("cmnd.tasmotas.STATUS", sc.encode("5"));
            client.publish("cmnd.tasmotas.STATUS", sc.encode("8"));
            client.publish("cmnd.sonoffs.STATE", sc.encode(""));
            client.publish("cmnd.sonoffs.STATUS", sc.encode(""));
            client.publish("cmnd.sonoffs.STATUS", sc.encode("5"));
            client.publish("cmnd.sonoffs.STATUS", sc.encode("8"));
            (async () => {
              for await (const s of client.status()) {
                if (s.type == "disconnect") {
                  postMessage({ action: "disconnected" });
                } else if (s.type == "reconnect") {
                  postMessage({ action: "connected" });
                }
              }
            })().then();
            client.closed().then(() => {
              postMessage({ action: "disconnected" });
            });
          });
          break;
        case "publish":
          console.log("publish", m.data.topic, m.data.payload);
          if (client) {
            client.publish(m.data.topic.replaceAll("/", "."), sc.encode(m.data.payload));
          }
          break;
        default:
          postMessage({ action: "login" });
          console.log(m.data);
          break;
      }
    }
  };
})();
