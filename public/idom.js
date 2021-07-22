(() => {
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };

  // src/mqtt.min.js
  var require_mqtt_min = __commonJS((exports, module) => {
    !function(e) {
      if (typeof exports == "object" && typeof module != "undefined")
        module.exports = e();
      else if (typeof define == "function" && define.amd)
        define([], e);
      else {
        (typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this).mqtt = e();
      }
    }(function() {
      return function() {
        return function e(t, r, n) {
          function i(s2, a) {
            if (!r[s2]) {
              if (!t[s2]) {
                var c = false;
                if (!a && c)
                  return c(s2, true);
                if (o)
                  return o(s2, true);
                var u = new Error("Cannot find module '" + s2 + "'");
                throw u.code = "MODULE_NOT_FOUND", u;
              }
              var l = r[s2] = {exports: {}};
              t[s2][0].call(l.exports, function(e2) {
                return i(t[s2][1][e2] || e2);
              }, l, l.exports, e, t, r, n);
            }
            return r[s2].exports;
          }
          for (var o = false, s = 0; s < n.length; s++)
            i(n[s]);
          return i;
        };
      }()({1: [function(e, t, r) {
        (function(r2, n) {
          (function() {
            "use strict";
            var i = e("events").EventEmitter, o = e("./store"), s = e("mqtt-packet"), a = e("readable-stream").Writable, c = e("inherits"), u = e("reinterval"), l = e("./validations"), f = e("xtend"), h = e("debug")("mqttjs:client"), p = r2 ? r2.nextTick : function(e2) {
              setTimeout(e2, 0);
            }, d = n.setImmediate || function(e2) {
              p(e2);
            }, g = {keepalive: 60, reschedulePings: true, protocolId: "MQTT", protocolVersion: 4, reconnectPeriod: 1e3, connectTimeout: 3e4, clean: true, resubscribe: true}, b = ["ECONNREFUSED", "EADDRINUSE", "ECONNRESET", "ENOTFOUND"], m = {0: "", 1: "Unacceptable protocol version", 2: "Identifier rejected", 3: "Server unavailable", 4: "Bad username or password", 5: "Not authorized", 16: "No matching subscribers", 17: "No subscription existed", 128: "Unspecified error", 129: "Malformed Packet", 130: "Protocol Error", 131: "Implementation specific error", 132: "Unsupported Protocol Version", 133: "Client Identifier not valid", 134: "Bad User Name or Password", 135: "Not authorized", 136: "Server unavailable", 137: "Server busy", 138: "Banned", 139: "Server shutting down", 140: "Bad authentication method", 141: "Keep Alive timeout", 142: "Session taken over", 143: "Topic Filter invalid", 144: "Topic Name invalid", 145: "Packet identifier in use", 146: "Packet Identifier not found", 147: "Receive Maximum exceeded", 148: "Topic Alias invalid", 149: "Packet too large", 150: "Message rate too high", 151: "Quota exceeded", 152: "Administrative action", 153: "Payload format invalid", 154: "Retain not supported", 155: "QoS not supported", 156: "Use another server", 157: "Server moved", 158: "Shared Subscriptions not supported", 159: "Connection rate exceeded", 160: "Maximum connect time", 161: "Subscription Identifiers not supported", 162: "Wildcard Subscriptions not supported"};
            function y(e2, t2, r3) {
              h("sendPacket :: packet: %O", t2), h("sendPacket :: emitting `packetsend`"), e2.emit("packetsend", t2), h("sendPacket :: writing to stream");
              var n2 = s.writeToStream(t2, e2.stream, e2.options);
              h("sendPacket :: writeToStream result %s", n2), !n2 && r3 ? (h("sendPacket :: handle events on `drain` once through callback."), e2.stream.once("drain", r3)) : r3 && (h("sendPacket :: invoking cb"), r3());
            }
            function _(e2, t2, r3, n2) {
              h("storeAndSend :: store packet with cmd %s to outgoingStore", t2.cmd), e2.outgoingStore.put(t2, function(i2) {
                if (i2)
                  return r3 && r3(i2);
                n2(), y(e2, t2, r3);
              });
            }
            function w(e2) {
              h("nop ::", e2);
            }
            function v(e2, t2) {
              var r3, n2 = this;
              if (!(this instanceof v))
                return new v(e2, t2);
              for (r3 in this.options = t2 || {}, g)
                this.options[r3] === void 0 ? this.options[r3] = g[r3] : this.options[r3] = t2[r3];
              h("MqttClient :: options.protocol", t2.protocol), h("MqttClient :: options.protocolVersion", t2.protocolVersion), h("MqttClient :: options.username", t2.username), h("MqttClient :: options.keepalive", t2.keepalive), h("MqttClient :: options.reconnectPeriod", t2.reconnectPeriod), h("MqttClient :: options.rejectUnauthorized", t2.rejectUnauthorized), this.options.clientId = typeof t2.clientId == "string" ? t2.clientId : "mqttjs_" + Math.random().toString(16).substr(2, 8), h("MqttClient :: clientId", this.options.clientId), this.options.customHandleAcks = t2.protocolVersion === 5 && t2.customHandleAcks ? t2.customHandleAcks : function() {
                arguments[3](0);
              }, this.streamBuilder = e2, this.outgoingStore = t2.outgoingStore || new o(), this.incomingStore = t2.incomingStore || new o(), this.queueQoSZero = t2.queueQoSZero === void 0 || t2.queueQoSZero, this._resubscribeTopics = {}, this.messageIdToTopic = {}, this.pingTimer = null, this.connected = false, this.disconnecting = false, this.queue = [], this.connackTimer = null, this.reconnectTimer = null, this._storeProcessing = false, this._packetIdsDuringStoreProcessing = {}, this.nextId = Math.max(1, Math.floor(65535 * Math.random())), this.outgoing = {}, this._firstConnection = true, this.on("connect", function() {
                var e3 = this.queue;
                h("connect :: sending queued packets"), function t3() {
                  var r4 = e3.shift();
                  h("deliver :: entry %o", r4);
                  var i2;
                  r4 && (i2 = r4.packet, h("deliver :: call _sendPacket for %o", i2), n2._sendPacket(i2, function(e4) {
                    r4.cb && r4.cb(e4), t3();
                  }));
                }();
              }), this.on("close", function() {
                h("close :: connected set to `false`"), this.connected = false, h("close :: clearing connackTimer"), clearTimeout(this.connackTimer), h("close :: clearing ping timer"), n2.pingTimer !== null && (n2.pingTimer.clear(), n2.pingTimer = null), h("close :: calling _setupReconnect"), this._setupReconnect();
              }), i.call(this), h("MqttClient :: setting up stream"), this._setupStream();
            }
            c(v, i), v.prototype._setupStream = function() {
              var e2, t2 = this, r3 = new a(), n2 = s.parser(this.options), i2 = null, o2 = [];
              function c2() {
                if (o2.length)
                  p(u2);
                else {
                  var e3 = i2;
                  i2 = null, e3();
                }
              }
              function u2() {
                h("work :: getting next packet in queue");
                var e3 = o2.shift();
                if (e3)
                  h("work :: packet pulled from queue"), t2._handlePacket(e3, c2);
                else {
                  h("work :: no packets in queue");
                  var r4 = i2;
                  i2 = null, h("work :: done flag is %s", !!r4), r4 && r4();
                }
              }
              if (h("_setupStream :: calling method to clear reconnect"), this._clearReconnect(), h("_setupStream :: using streamBuilder provided to client to create stream"), this.stream = this.streamBuilder(this), n2.on("packet", function(e3) {
                h("parser :: on packet push to packets array."), o2.push(e3);
              }), r3._write = function(e3, t3, r4) {
                i2 = r4, h("writable stream :: parsing buffer"), n2.parse(e3), u2();
              }, h("_setupStream :: pipe stream to writable stream"), this.stream.pipe(r3), this.stream.on("error", function(e3) {
                h("streamErrorHandler :: error", e3.message), b.includes(e3.code) ? (h("streamErrorHandler :: emitting error"), t2.emit("error", e3)) : w(e3);
              }), this.stream.on("close", function() {
                var e3;
                h("(%s)stream :: on close", t2.options.clientId), (e3 = t2.outgoing) && (h("flushVolatile :: deleting volatile messages from the queue and setting their callbacks as error function"), Object.keys(e3).forEach(function(t3) {
                  e3[t3].volatile && typeof e3[t3].cb == "function" && (e3[t3].cb(new Error("Connection closed")), delete e3[t3]);
                })), h("stream: emit close to MqttClient"), t2.emit("close");
              }), h("_setupStream: sending packet `connect`"), (e2 = Object.create(this.options)).cmd = "connect", y(this, e2), n2.on("error", this.emit.bind(this, "error")), this.options.properties) {
                if (!this.options.properties.authenticationMethod && this.options.properties.authenticationData)
                  return t2.end(() => this.emit("error", new Error("Packet has no Authentication Method"))), this;
                if (this.options.properties.authenticationMethod && this.options.authPacket && typeof this.options.authPacket == "object")
                  y(this, f({cmd: "auth", reasonCode: 0}, this.options.authPacket));
              }
              this.stream.setMaxListeners(1e3), clearTimeout(this.connackTimer), this.connackTimer = setTimeout(function() {
                h("!!connectTimeout hit!! Calling _cleanUp with force `true`"), t2._cleanUp(true);
              }, this.options.connectTimeout);
            }, v.prototype._handlePacket = function(e2, t2) {
              var r3 = this.options;
              if (r3.protocolVersion === 5 && r3.properties && r3.properties.maximumPacketSize && r3.properties.maximumPacketSize < e2.length)
                return this.emit("error", new Error("exceeding packets size " + e2.cmd)), this.end({reasonCode: 149, properties: {reasonString: "Maximum packet size was exceeded"}}), this;
              switch (h("_handlePacket :: emitting packetreceive"), this.emit("packetreceive", e2), e2.cmd) {
                case "publish":
                  this._handlePublish(e2, t2);
                  break;
                case "puback":
                case "pubrec":
                case "pubcomp":
                case "suback":
                case "unsuback":
                  this._handleAck(e2), t2();
                  break;
                case "pubrel":
                  this._handlePubrel(e2, t2);
                  break;
                case "connack":
                  this._handleConnack(e2), t2();
                  break;
                case "pingresp":
                  this._handlePingresp(e2), t2();
                  break;
                case "disconnect":
                  this._handleDisconnect(e2), t2();
              }
            }, v.prototype._checkDisconnecting = function(e2) {
              return this.disconnecting && (e2 ? e2(new Error("client disconnecting")) : this.emit("error", new Error("client disconnecting"))), this.disconnecting;
            }, v.prototype.publish = function(e2, t2, r3, n2) {
              var i2;
              h("publish :: message `%s` to topic `%s`", t2, e2);
              var o2 = this.options;
              typeof r3 == "function" && (n2 = r3, r3 = null);
              if (r3 = f({qos: 0, retain: false, dup: false}, r3), this._checkDisconnecting(n2))
                return this;
              switch (i2 = {cmd: "publish", topic: e2, payload: t2, qos: r3.qos, retain: r3.retain, messageId: this._nextId(), dup: r3.dup}, o2.protocolVersion === 5 && (i2.properties = r3.properties, (!o2.properties && i2.properties && i2.properties.topicAlias || r3.properties && o2.properties && (r3.properties.topicAlias && o2.properties.topicAliasMaximum && r3.properties.topicAlias > o2.properties.topicAliasMaximum || !o2.properties.topicAliasMaximum && r3.properties.topicAlias)) && delete i2.properties.topicAlias), h("publish :: qos", r3.qos), r3.qos) {
                case 1:
                case 2:
                  this.outgoing[i2.messageId] = {volatile: false, cb: n2 || w}, this._storeProcessing ? (h("_storeProcessing enabled"), this._packetIdsDuringStoreProcessing[i2.messageId] = false, this._storePacket(i2, void 0, r3.cbStorePut)) : (h("MqttClient:publish: packet cmd: %s", i2.cmd), this._sendPacket(i2, void 0, r3.cbStorePut));
                  break;
                default:
                  this._storeProcessing ? (h("_storeProcessing enabled"), this._storePacket(i2, n2, r3.cbStorePut)) : (h("MqttClient:publish: packet cmd: %s", i2.cmd), this._sendPacket(i2, n2, r3.cbStorePut));
              }
              return this;
            }, v.prototype.subscribe = function() {
              for (var e2, t2 = new Array(arguments.length), r3 = 0; r3 < arguments.length; r3++)
                t2[r3] = arguments[r3];
              var n2, i2 = [], o2 = t2.shift(), s2 = o2.resubscribe, a2 = t2.pop() || w, c2 = t2.pop(), u2 = this, p2 = this.options.protocolVersion;
              if (delete o2.resubscribe, typeof o2 == "string" && (o2 = [o2]), typeof a2 != "function" && (c2 = a2, a2 = w), (n2 = l.validateTopics(o2)) !== null)
                return d(a2, new Error("Invalid topic " + n2)), this;
              if (this._checkDisconnecting(a2))
                return h("subscribe: discconecting true"), this;
              var g2 = {qos: 0};
              if (p2 === 5 && (g2.nl = false, g2.rap = false, g2.rh = 0), c2 = f(g2, c2), Array.isArray(o2) ? o2.forEach(function(e3) {
                if (h("subscribe: array topic %s", e3), !u2._resubscribeTopics.hasOwnProperty(e3) || u2._resubscribeTopics[e3].qos < c2.qos || s2) {
                  var t3 = {topic: e3, qos: c2.qos};
                  p2 === 5 && (t3.nl = c2.nl, t3.rap = c2.rap, t3.rh = c2.rh, t3.properties = c2.properties), h("subscribe: pushing topic `%s` and qos `%s` to subs list", t3.topic, t3.qos), i2.push(t3);
                }
              }) : Object.keys(o2).forEach(function(e3) {
                if (h("subscribe: object topic %s", e3), !u2._resubscribeTopics.hasOwnProperty(e3) || u2._resubscribeTopics[e3].qos < o2[e3].qos || s2) {
                  var t3 = {topic: e3, qos: o2[e3].qos};
                  p2 === 5 && (t3.nl = o2[e3].nl, t3.rap = o2[e3].rap, t3.rh = o2[e3].rh, t3.properties = c2.properties), h("subscribe: pushing `%s` to subs list", t3), i2.push(t3);
                }
              }), e2 = {cmd: "subscribe", subscriptions: i2, qos: 1, retain: false, dup: false, messageId: this._nextId()}, c2.properties && (e2.properties = c2.properties), i2.length) {
                if (this.options.resubscribe) {
                  h("subscribe :: resubscribe true");
                  var b2 = [];
                  i2.forEach(function(e3) {
                    if (u2.options.reconnectPeriod > 0) {
                      var t3 = {qos: e3.qos};
                      p2 === 5 && (t3.nl = e3.nl || false, t3.rap = e3.rap || false, t3.rh = e3.rh || 0, t3.properties = e3.properties), u2._resubscribeTopics[e3.topic] = t3, b2.push(e3.topic);
                    }
                  }), u2.messageIdToTopic[e2.messageId] = b2;
                }
                return this.outgoing[e2.messageId] = {volatile: true, cb: function(e3, t3) {
                  if (!e3)
                    for (var r4 = t3.granted, n3 = 0; n3 < r4.length; n3 += 1)
                      i2[n3].qos = r4[n3];
                  a2(e3, i2);
                }}, h("subscribe :: call _sendPacket"), this._sendPacket(e2), this;
              }
              a2(null, []);
            }, v.prototype.unsubscribe = function() {
              for (var e2 = {cmd: "unsubscribe", qos: 1, messageId: this._nextId()}, t2 = this, r3 = new Array(arguments.length), n2 = 0; n2 < arguments.length; n2++)
                r3[n2] = arguments[n2];
              var i2 = r3.shift(), o2 = r3.pop() || w, s2 = r3.pop();
              return typeof i2 == "string" && (i2 = [i2]), typeof o2 != "function" && (s2 = o2, o2 = w), this._checkDisconnecting(o2) ? this : (typeof i2 == "string" ? e2.unsubscriptions = [i2] : Array.isArray(i2) && (e2.unsubscriptions = i2), this.options.resubscribe && e2.unsubscriptions.forEach(function(e3) {
                delete t2._resubscribeTopics[e3];
              }), typeof s2 == "object" && s2.properties && (e2.properties = s2.properties), this.outgoing[e2.messageId] = {volatile: true, cb: o2}, h("unsubscribe: call _sendPacket"), this._sendPacket(e2), this);
            }, v.prototype.end = function(e2, t2, r3) {
              var n2 = this;
              function i2() {
                h("end :: (%s) :: finish :: calling _cleanUp with force %s", n2.options.clientId, e2), n2._cleanUp(e2, () => {
                  h("end :: finish :: calling process.nextTick on closeStores"), p(function() {
                    h("end :: closeStores: closing incoming and outgoing stores"), n2.disconnected = true, n2.incomingStore.close(function(e3) {
                      n2.outgoingStore.close(function(t3) {
                        if (h("end :: closeStores: emitting end"), n2.emit("end"), r3) {
                          let n3 = e3 || t3;
                          h("end :: closeStores: invoking callback with args"), r3(n3);
                        }
                      });
                    }), n2._deferredReconnect && n2._deferredReconnect();
                  }.bind(n2));
                }, t2);
              }
              return h("end :: (%s)", this.options.clientId), e2 != null && typeof e2 == "boolean" || (r3 = t2 || w, t2 = e2, e2 = false, typeof t2 != "object" && (r3 = t2, t2 = null, typeof r3 != "function" && (r3 = w))), typeof t2 != "object" && (r3 = t2, t2 = null), h("end :: cb? %s", !!r3), r3 = r3 || w, this.disconnecting ? (r3(), this) : (this._clearReconnect(), this.disconnecting = true, !e2 && Object.keys(this.outgoing).length > 0 ? (h("end :: (%s) :: calling finish in 10ms once outgoing is empty", n2.options.clientId), this.once("outgoingEmpty", setTimeout.bind(null, i2, 10))) : (h("end :: (%s) :: immediately calling finish", n2.options.clientId), i2()), this);
            }, v.prototype.removeOutgoingMessage = function(e2) {
              var t2 = this.outgoing[e2] ? this.outgoing[e2].cb : null;
              return delete this.outgoing[e2], this.outgoingStore.del({messageId: e2}, function() {
                t2(new Error("Message removed"));
              }), this;
            }, v.prototype.reconnect = function(e2) {
              h("client reconnect");
              var t2 = this, r3 = function() {
                e2 ? (t2.options.incomingStore = e2.incomingStore, t2.options.outgoingStore = e2.outgoingStore) : (t2.options.incomingStore = null, t2.options.outgoingStore = null), t2.incomingStore = t2.options.incomingStore || new o(), t2.outgoingStore = t2.options.outgoingStore || new o(), t2.disconnecting = false, t2.disconnected = false, t2._deferredReconnect = null, t2._reconnect();
              };
              return this.disconnecting && !this.disconnected ? this._deferredReconnect = r3 : r3(), this;
            }, v.prototype._reconnect = function() {
              h("_reconnect: emitting reconnect to client"), this.emit("reconnect"), this.connected ? (this.end(() => {
                this._setupStream();
              }), h("client already connected. disconnecting first.")) : (h("_reconnect: calling _setupStream"), this._setupStream());
            }, v.prototype._setupReconnect = function() {
              var e2 = this;
              !e2.disconnecting && !e2.reconnectTimer && e2.options.reconnectPeriod > 0 ? (this.reconnecting || (h("_setupReconnect :: emit `offline` state"), this.emit("offline"), h("_setupReconnect :: set `reconnecting` to `true`"), this.reconnecting = true), h("_setupReconnect :: setting reconnectTimer for %d ms", e2.options.reconnectPeriod), e2.reconnectTimer = setInterval(function() {
                h("reconnectTimer :: reconnect triggered!"), e2._reconnect();
              }, e2.options.reconnectPeriod)) : h("_setupReconnect :: doing nothing...");
            }, v.prototype._clearReconnect = function() {
              h("_clearReconnect : clearing reconnect timer"), this.reconnectTimer && (clearInterval(this.reconnectTimer), this.reconnectTimer = null);
            }, v.prototype._cleanUp = function(e2, t2) {
              var r3, n2 = arguments[2];
              if (t2 && (h("_cleanUp :: done callback provided for on stream close"), this.stream.on("close", t2)), h("_cleanUp :: forced? %s", e2), e2)
                this.options.reconnectPeriod === 0 && this.options.clean && (r3 = this.outgoing) && (h("flush: queue exists? %b", !!r3), Object.keys(r3).forEach(function(e3) {
                  typeof r3[e3].cb == "function" && (r3[e3].cb(new Error("Connection closed")), delete r3[e3]);
                })), h("_cleanUp :: (%s) :: destroying stream", this.options.clientId), this.stream.destroy();
              else {
                var i2 = f({cmd: "disconnect"}, n2);
                h("_cleanUp :: (%s) :: call _sendPacket with disconnect packet", this.options.clientId), this._sendPacket(i2, d.bind(null, this.stream.end.bind(this.stream)));
              }
              this.disconnecting || (h("_cleanUp :: client not disconnecting. Clearing and resetting reconnect."), this._clearReconnect(), this._setupReconnect()), this.pingTimer !== null && (h("_cleanUp :: clearing pingTimer"), this.pingTimer.clear(), this.pingTimer = null), t2 && !this.connected && (h("_cleanUp :: (%s) :: removing stream `done` callback `close` listener", this.options.clientId), this.stream.removeListener("close", t2), t2());
            }, v.prototype._sendPacket = function(e2, t2, r3) {
              if (h("_sendPacket :: (%s) ::  start", this.options.clientId), r3 = r3 || w, !this.connected)
                return h("_sendPacket :: client not connected. Storing packet offline."), void this._storePacket(e2, t2, r3);
              switch (this._shiftPingInterval(), e2.cmd) {
                case "publish":
                  break;
                case "pubrel":
                  return void _(this, e2, t2, r3);
                default:
                  return void y(this, e2, t2);
              }
              switch (e2.qos) {
                case 2:
                case 1:
                  _(this, e2, t2, r3);
                  break;
                case 0:
                default:
                  y(this, e2, t2);
              }
              h("_sendPacket :: (%s) ::  end", this.options.clientId);
            }, v.prototype._storePacket = function(e2, t2, r3) {
              h("_storePacket :: packet: %o", e2), h("_storePacket :: cb? %s", !!t2), r3 = r3 || w, (e2.qos || 0) === 0 && this.queueQoSZero || e2.cmd !== "publish" ? this.queue.push({packet: e2, cb: t2}) : e2.qos > 0 ? (t2 = this.outgoing[e2.messageId] ? this.outgoing[e2.messageId].cb : null, this.outgoingStore.put(e2, function(e3) {
                if (e3)
                  return t2 && t2(e3);
                r3();
              })) : t2 && t2(new Error("No connection to broker"));
            }, v.prototype._setupPingTimer = function() {
              h("_setupPingTimer :: keepalive %d (seconds)", this.options.keepalive);
              var e2 = this;
              !this.pingTimer && this.options.keepalive && (this.pingResp = true, this.pingTimer = u(function() {
                e2._checkPing();
              }, 1e3 * this.options.keepalive));
            }, v.prototype._shiftPingInterval = function() {
              this.pingTimer && this.options.keepalive && this.options.reschedulePings && this.pingTimer.reschedule(1e3 * this.options.keepalive);
            }, v.prototype._checkPing = function() {
              h("_checkPing :: checking ping..."), this.pingResp ? (h("_checkPing :: ping response received. Clearing flag and sending `pingreq`"), this.pingResp = false, this._sendPacket({cmd: "pingreq"})) : (h("_checkPing :: calling _cleanUp with force true"), this._cleanUp(true));
            }, v.prototype._handlePingresp = function() {
              this.pingResp = true;
            }, v.prototype._handleConnack = function(e2) {
              h("_handleConnack");
              var t2 = this.options, r3 = t2.protocolVersion === 5 ? e2.reasonCode : e2.returnCode;
              if (clearTimeout(this.connackTimer), e2.properties && (e2.properties.topicAliasMaximum && (t2.properties || (t2.properties = {}), t2.properties.topicAliasMaximum = e2.properties.topicAliasMaximum), e2.properties.serverKeepAlive && t2.keepalive && (t2.keepalive = e2.properties.serverKeepAlive, this._shiftPingInterval()), e2.properties.maximumPacketSize && (t2.properties || (t2.properties = {}), t2.properties.maximumPacketSize = e2.properties.maximumPacketSize)), r3 === 0)
                this.reconnecting = false, this._onConnect(e2);
              else if (r3 > 0) {
                var n2 = new Error("Connection refused: " + m[r3]);
                n2.code = r3, this.emit("error", n2);
              }
            }, v.prototype._handlePublish = function(e2, t2) {
              h("_handlePublish: packet %o", e2), t2 = t2 !== void 0 ? t2 : w;
              var r3 = e2.topic.toString(), n2 = e2.payload, i2 = e2.qos, o2 = e2.messageId, s2 = this, a2 = this.options, c2 = [0, 16, 128, 131, 135, 144, 145, 151, 153];
              switch (h("_handlePublish: qos %d", i2), i2) {
                case 2:
                  a2.customHandleAcks(r3, n2, e2, function(r4, n3) {
                    return r4 instanceof Error || (n3 = r4, r4 = null), r4 ? s2.emit("error", r4) : c2.indexOf(n3) === -1 ? s2.emit("error", new Error("Wrong reason code for pubrec")) : void (n3 ? s2._sendPacket({cmd: "pubrec", messageId: o2, reasonCode: n3}, t2) : s2.incomingStore.put(e2, function() {
                      s2._sendPacket({cmd: "pubrec", messageId: o2}, t2);
                    }));
                  });
                  break;
                case 1:
                  a2.customHandleAcks(r3, n2, e2, function(i3, a3) {
                    return i3 instanceof Error || (a3 = i3, i3 = null), i3 ? s2.emit("error", i3) : c2.indexOf(a3) === -1 ? s2.emit("error", new Error("Wrong reason code for puback")) : (a3 || s2.emit("message", r3, n2, e2), void s2.handleMessage(e2, function(e3) {
                      if (e3)
                        return t2 && t2(e3);
                      s2._sendPacket({cmd: "puback", messageId: o2, reasonCode: a3}, t2);
                    }));
                  });
                  break;
                case 0:
                  this.emit("message", r3, n2, e2), this.handleMessage(e2, t2);
                  break;
                default:
                  h("_handlePublish: unknown QoS. Doing nothing.");
              }
            }, v.prototype.handleMessage = function(e2, t2) {
              t2();
            }, v.prototype._handleAck = function(e2) {
              var t2, r3 = e2.messageId, n2 = e2.cmd, i2 = null, o2 = this.outgoing[r3] ? this.outgoing[r3].cb : null, s2 = this;
              if (o2) {
                switch (h("_handleAck :: packet type", n2), n2) {
                  case "pubcomp":
                  case "puback":
                    var a2 = e2.reasonCode;
                    a2 && a2 > 0 && a2 !== 16 && ((t2 = new Error("Publish error: " + m[a2])).code = a2, o2(t2, e2)), delete this.outgoing[r3], this.outgoingStore.del(e2, o2);
                    break;
                  case "pubrec":
                    i2 = {cmd: "pubrel", qos: 2, messageId: r3};
                    var c2 = e2.reasonCode;
                    c2 && c2 > 0 && c2 !== 16 ? ((t2 = new Error("Publish error: " + m[c2])).code = c2, o2(t2, e2)) : this._sendPacket(i2);
                    break;
                  case "suback":
                    delete this.outgoing[r3];
                    for (var u2 = 0; u2 < e2.granted.length; u2++)
                      if ((128 & e2.granted[u2]) != 0) {
                        var l2 = this.messageIdToTopic[r3];
                        l2 && l2.forEach(function(e3) {
                          delete s2._resubscribeTopics[e3];
                        });
                      }
                    o2(null, e2);
                    break;
                  case "unsuback":
                    delete this.outgoing[r3], o2(null);
                    break;
                  default:
                    s2.emit("error", new Error("unrecognized packet type"));
                }
                this.disconnecting && Object.keys(this.outgoing).length === 0 && this.emit("outgoingEmpty");
              } else
                h("_handleAck :: Server sent an ack in error. Ignoring.");
            }, v.prototype._handlePubrel = function(e2, t2) {
              h("handling pubrel packet"), t2 = t2 !== void 0 ? t2 : w;
              var r3 = this, n2 = {cmd: "pubcomp", messageId: e2.messageId};
              r3.incomingStore.get(e2, function(e3, i2) {
                e3 ? r3._sendPacket(n2, t2) : (r3.emit("message", i2.topic, i2.payload, i2), r3.handleMessage(i2, function(e4) {
                  if (e4)
                    return t2(e4);
                  r3.incomingStore.del(i2, w), r3._sendPacket(n2, t2);
                }));
              });
            }, v.prototype._handleDisconnect = function(e2) {
              this.emit("disconnect", e2);
            }, v.prototype._nextId = function() {
              var e2 = this.nextId++;
              return this.nextId === 65536 && (this.nextId = 1), e2;
            }, v.prototype.getLastMessageId = function() {
              return this.nextId === 1 ? 65535 : this.nextId - 1;
            }, v.prototype._resubscribe = function(e2) {
              h("_resubscribe");
              var t2 = Object.keys(this._resubscribeTopics);
              if (!this._firstConnection && (this.options.clean || this.options.protocolVersion === 5 && !e2.sessionPresent) && t2.length > 0)
                if (this.options.resubscribe)
                  if (this.options.protocolVersion === 5) {
                    h("_resubscribe: protocolVersion 5");
                    for (var r3 = 0; r3 < t2.length; r3++) {
                      var n2 = {};
                      n2[t2[r3]] = this._resubscribeTopics[t2[r3]], n2.resubscribe = true, this.subscribe(n2, {properties: n2[t2[r3]].properties});
                    }
                  } else
                    this._resubscribeTopics.resubscribe = true, this.subscribe(this._resubscribeTopics);
                else
                  this._resubscribeTopics = {};
              this._firstConnection = false;
            }, v.prototype._onConnect = function(e2) {
              if (this.disconnected)
                this.emit("connect", e2);
              else {
                var t2 = this;
                this._setupPingTimer(), this._resubscribe(e2), this.connected = true, function r3() {
                  var n2 = t2.outgoingStore.createStream();
                  function i2() {
                    t2._storeProcessing = false, t2._packetIdsDuringStoreProcessing = {};
                  }
                  function o2() {
                    n2.destroy(), n2 = null, i2();
                  }
                  t2.once("close", o2), n2.on("error", function(e3) {
                    i2(), t2.removeListener("close", o2), t2.emit("error", e3);
                  }), n2.on("end", function() {
                    var n3 = true;
                    for (var s2 in t2._packetIdsDuringStoreProcessing)
                      if (!t2._packetIdsDuringStoreProcessing[s2]) {
                        n3 = false;
                        break;
                      }
                    n3 ? (i2(), t2.removeListener("close", o2), t2.emit("connect", e2)) : r3();
                  }), function e3() {
                    if (n2) {
                      t2._storeProcessing = true;
                      var r4, i3 = n2.read(1);
                      i3 ? t2._packetIdsDuringStoreProcessing[i3.messageId] ? e3() : t2.disconnecting || t2.reconnectTimer ? n2.destroy && n2.destroy() : (r4 = t2.outgoing[i3.messageId] ? t2.outgoing[i3.messageId].cb : null, t2.outgoing[i3.messageId] = {volatile: false, cb: function(t3, n3) {
                        r4 && r4(t3, n3), e3();
                      }}, t2._packetIdsDuringStoreProcessing[i3.messageId] = true, t2._sendPacket(i3)) : n2.once("readable", e3);
                    }
                  }();
                }();
              }
            }, t.exports = v;
          }).call(this);
        }).call(this, e("_process"), typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
      }, {"./store": 7, "./validations": 8, _process: 32, debug: 15, events: 19, inherits: 21, "mqtt-packet": 24, "readable-stream": 51, reinterval: 52, xtend: 61}], 2: [function(e, t, r) {
        (function(r2) {
          (function() {
            "use strict";
            var n, i, o, s = e("readable-stream").Transform, a = e("duplexify"), c = false;
            t.exports = function(e2, t2) {
              if (t2.hostname = t2.hostname || t2.host, !t2.hostname)
                throw new Error("Could not determine host. Specify host manually.");
              var u = t2.protocolId === "MQIsdp" && t2.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
              !function(e3) {
                e3.hostname || (e3.hostname = "localhost"), e3.path || (e3.path = "/"), e3.wsOptions || (e3.wsOptions = {});
              }(t2);
              var l = function(e3, t3) {
                var r3 = e3.protocol === "alis" ? "wss" : "ws", n2 = r3 + "://" + e3.hostname + e3.path;
                return e3.port && e3.port !== 80 && e3.port !== 443 && (n2 = r3 + "://" + e3.hostname + ":" + e3.port + e3.path), typeof e3.transformWsUrl == "function" && (n2 = e3.transformWsUrl(n2, e3, t3)), n2;
              }(t2, e2);
              return (n = t2.my).connectSocket({url: l, protocols: u}), i = function() {
                var e3 = new s();
                return e3._write = function(e4, t3, r3) {
                  n.sendSocketMessage({data: e4.buffer, success: function() {
                    r3();
                  }, fail: function() {
                    r3(new Error());
                  }});
                }, e3._flush = function(e4) {
                  n.closeSocket({success: function() {
                    e4();
                  }});
                }, e3;
              }(), o = a.obj(), c || (c = true, n.onSocketOpen(function() {
                o.setReadable(i), o.setWritable(i), o.emit("connect");
              }), n.onSocketMessage(function(e3) {
                if (typeof e3.data == "string") {
                  var t3 = r2.from(e3.data, "base64");
                  i.push(t3);
                } else {
                  var n2 = new FileReader();
                  n2.addEventListener("load", function() {
                    var e4 = n2.result;
                    e4 = e4 instanceof ArrayBuffer ? r2.from(e4) : r2.from(e4, "utf8"), i.push(e4);
                  }), n2.readAsArrayBuffer(e3.data);
                }
              }), n.onSocketClose(function() {
                o.end(), o.destroy();
              }), n.onSocketError(function(e3) {
                o.destroy(e3);
              })), o;
            };
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {buffer: 14, duplexify: 17, "readable-stream": 51}], 3: [function(e, t, r) {
        "use strict";
        var n = e("net"), i = e("debug")("mqttjs:tcp");
        t.exports = function(e2, t2) {
          var r2, o;
          return t2.port = t2.port || 1883, t2.hostname = t2.hostname || t2.host || "localhost", r2 = t2.port, o = t2.hostname, i("port %d and host %s", r2, o), n.createConnection(r2, o);
        };
      }, {debug: 15, net: 13}], 4: [function(e, t, r) {
        "use strict";
        var n = e("tls"), i = e("debug")("mqttjs:tls");
        t.exports = function(e2, t2) {
          var r2;
          function o(n2) {
            t2.rejectUnauthorized && e2.emit("error", n2), r2.end();
          }
          return t2.port = t2.port || 8883, t2.host = t2.hostname || t2.host || "localhost", t2.servername = t2.host, t2.rejectUnauthorized = t2.rejectUnauthorized !== false, delete t2.path, i("port %d host %s rejectUnauthorized %b", t2.port, t2.host, t2.rejectUnauthorized), (r2 = n.connect(t2)).on("secureConnect", function() {
            t2.rejectUnauthorized && !r2.authorized ? r2.emit("error", new Error("TLS not authorized")) : r2.removeListener("error", o);
          }), r2.on("error", o), r2;
        };
      }, {debug: 15, tls: 13}], 5: [function(e, t, r) {
        (function(r2, n) {
          (function() {
            "use strict";
            const i = e("ws"), o = e("debug")("mqttjs:ws"), s = e("duplexify"), a = e("readable-stream").Transform;
            let c = ["rejectUnauthorized", "ca", "cert", "key", "pfx", "passphrase"];
            const u = r2 !== void 0 && r2.title === "browser" || typeof __webpack_require__ == "function";
            function l(e2, t2) {
              let r3 = e2.protocol + "://" + e2.hostname + ":" + e2.port + e2.path;
              return typeof e2.transformWsUrl == "function" && (r3 = e2.transformWsUrl(r3, e2, t2)), r3;
            }
            function f(e2) {
              let t2 = e2;
              return e2.hostname || (t2.hostname = "localhost"), e2.port || (e2.protocol === "wss" ? t2.port = 443 : t2.port = 80), e2.path || (t2.path = "/"), e2.wsOptions || (t2.wsOptions = {}), u || e2.protocol !== "wss" || c.forEach(function(r3) {
                e2.hasOwnProperty(r3) && !e2.wsOptions.hasOwnProperty(r3) && (t2.wsOptions[r3] = e2[r3]);
              }), t2;
            }
            t.exports = u ? function(e2, t2) {
              let r3;
              o("browserStreamBuilder");
              const i2 = function(e3) {
                let t3 = f(e3);
                if (t3.hostname || (t3.hostname = t3.host), !t3.hostname) {
                  if (typeof document == "undefined")
                    throw new Error("Could not determine host. Specify host manually.");
                  const e4 = new URL(document.URL);
                  t3.hostname = e4.hostname, t3.port || (t3.port = e4.port);
                }
                return t3.objectMode === void 0 && (t3.objectMode = !(t3.binary === true || t3.binary === void 0)), t3;
              }(t2).browserBufferSize || 524288, c2 = t2.browserBufferTimeout || 1e3, u2 = !t2.objectMode;
              let h = function(e3, t3) {
                const r4 = t3.protocolId === "MQIsdp" && t3.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
                let n2 = l(t3, e3), i3 = new WebSocket(n2, [r4]);
                return i3.binaryType = "arraybuffer", i3;
              }(e2, t2), p = function(e3, t3, r4) {
                let n2 = new a({objectModeMode: e3.objectMode});
                return n2._write = t3, n2._flush = r4, n2;
              }(t2, function e3(t3, r4, o2) {
                h.bufferedAmount > i2 && setTimeout(e3, c2, t3, r4, o2), u2 && typeof t3 == "string" && (t3 = n.from(t3, "utf8"));
                try {
                  h.send(t3);
                } catch (e4) {
                  return o2(e4);
                }
                o2();
              }, function(e3) {
                h.close(), e3();
              });
              t2.objectMode || (p._writev = _), p.on("close", () => {
                h.close();
              });
              const d = h.addEventListener !== void 0;
              function g() {
                r3.setReadable(p), r3.setWritable(p), r3.emit("connect");
              }
              function b() {
                r3.end(), r3.destroy();
              }
              function m(e3) {
                r3.destroy(e3);
              }
              function y(e3) {
                let t3 = e3.data;
                t3 = t3 instanceof ArrayBuffer ? n.from(t3) : n.from(t3, "utf8"), p.push(t3);
              }
              function _(e3, t3) {
                const r4 = new Array(e3.length);
                for (let t4 = 0; t4 < e3.length; t4++)
                  typeof e3[t4].chunk == "string" ? r4[t4] = n.from(e3[t4], "utf8") : r4[t4] = e3[t4].chunk;
                this._write(n.concat(r4), "binary", t3);
              }
              return h.readyState === h.OPEN ? r3 = p : (r3 = r3 = s(void 0, void 0, t2), t2.objectMode || (r3._writev = _), d ? h.addEventListener("open", g) : h.onopen = g), r3.socket = h, d ? (h.addEventListener("close", b), h.addEventListener("error", m), h.addEventListener("message", y)) : (h.onclose = b, h.onerror = m, h.onmessage = y), r3;
            } : function(e2, t2) {
              o("streamBuilder");
              let r3 = f(t2);
              const n2 = l(r3, e2);
              let s2 = function(e3, t3, r4) {
                o("createWebSocket"), o("protocol: " + r4.protocolId + " " + r4.protocolVersion);
                const n3 = r4.protocolId === "MQIsdp" && r4.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
                return o("creating new Websocket for url: " + t3 + " and protocol: " + n3), new i(t3, [n3], r4.wsOptions);
              }(0, n2, r3), a2 = i.createWebSocketStream(s2, r3.wsOptions);
              return a2.url = n2, s2.on("close", () => {
                a2.destroy();
              }), a2;
            };
          }).call(this);
        }).call(this, e("_process"), e("buffer").Buffer);
      }, {_process: 32, buffer: 14, debug: 15, duplexify: 17, "readable-stream": 51, ws: 60}], 6: [function(e, t, r) {
        (function(r2) {
          (function() {
            "use strict";
            var n, i, o, s = e("readable-stream").Transform, a = e("duplexify");
            t.exports = function(e2, t2) {
              if (t2.hostname = t2.hostname || t2.host, !t2.hostname)
                throw new Error("Could not determine host. Specify host manually.");
              var c = t2.protocolId === "MQIsdp" && t2.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
              !function(e3) {
                e3.hostname || (e3.hostname = "localhost"), e3.path || (e3.path = "/"), e3.wsOptions || (e3.wsOptions = {});
              }(t2);
              var u = function(e3, t3) {
                var r3 = e3.protocol === "wxs" ? "wss" : "ws", n2 = r3 + "://" + e3.hostname + e3.path;
                return e3.port && e3.port !== 80 && e3.port !== 443 && (n2 = r3 + "://" + e3.hostname + ":" + e3.port + e3.path), typeof e3.transformWsUrl == "function" && (n2 = e3.transformWsUrl(n2, e3, t3)), n2;
              }(t2, e2);
              n = wx.connectSocket({url: u, protocols: [c]}), i = function() {
                var e3 = new s();
                return e3._write = function(e4, t3, r3) {
                  n.send({data: e4.buffer, success: function() {
                    r3();
                  }, fail: function(e5) {
                    r3(new Error(e5));
                  }});
                }, e3._flush = function(e4) {
                  n.close({success: function() {
                    e4();
                  }});
                }, e3;
              }(), (o = a.obj())._destroy = function(e3, t3) {
                n.close({success: function() {
                  t3 && t3(e3);
                }});
              };
              var l = o.destroy;
              return o.destroy = function() {
                o.destroy = l;
                var e3 = this;
                setTimeout(function() {
                  n.close({fail: function() {
                    e3._destroy(new Error());
                  }});
                }, 0);
              }.bind(o), n.onOpen(function() {
                o.setReadable(i), o.setWritable(i), o.emit("connect");
              }), n.onMessage(function(e3) {
                var t3 = e3.data;
                t3 = t3 instanceof ArrayBuffer ? r2.from(t3) : r2.from(t3, "utf8"), i.push(t3);
              }), n.onClose(function() {
                o.end(), o.destroy();
              }), n.onError(function(e3) {
                o.destroy(new Error(e3.errMsg));
              }), o;
            };
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {buffer: 14, duplexify: 17, "readable-stream": 51}], 7: [function(e, t, r) {
        "use strict";
        var n = e("xtend"), i = e("readable-stream").Readable, o = {objectMode: true}, s = {clean: true};
        function a(e2) {
          if (!(this instanceof a))
            return new a(e2);
          this.options = e2 || {}, this.options = n(s, e2), this._inflights = new Map();
        }
        a.prototype.put = function(e2, t2) {
          return this._inflights.set(e2.messageId, e2), t2 && t2(), this;
        }, a.prototype.createStream = function() {
          var e2 = new i(o), t2 = false, r2 = [], n2 = 0;
          return this._inflights.forEach(function(e3, t3) {
            r2.push(e3);
          }), e2._read = function() {
            !t2 && n2 < r2.length ? this.push(r2[n2++]) : this.push(null);
          }, e2.destroy = function() {
            if (!t2) {
              var e3 = this;
              t2 = true, setTimeout(function() {
                e3.emit("close");
              }, 0);
            }
          }, e2;
        }, a.prototype.del = function(e2, t2) {
          return (e2 = this._inflights.get(e2.messageId)) ? (this._inflights.delete(e2.messageId), t2(null, e2)) : t2 && t2(new Error("missing packet")), this;
        }, a.prototype.get = function(e2, t2) {
          return (e2 = this._inflights.get(e2.messageId)) ? t2(null, e2) : t2 && t2(new Error("missing packet")), this;
        }, a.prototype.close = function(e2) {
          this.options.clean && (this._inflights = null), e2 && e2();
        }, t.exports = a;
      }, {"readable-stream": 51, xtend: 61}], 8: [function(e, t, r) {
        "use strict";
        function n(e2) {
          for (var t2 = e2.split("/"), r2 = 0; r2 < t2.length; r2++)
            if (t2[r2] !== "+") {
              if (t2[r2] === "#")
                return r2 === t2.length - 1;
              if (t2[r2].indexOf("+") !== -1 || t2[r2].indexOf("#") !== -1)
                return false;
            }
          return true;
        }
        t.exports = {validateTopics: function(e2) {
          if (e2.length === 0)
            return "empty_topic_list";
          for (var t2 = 0; t2 < e2.length; t2++)
            if (!n(e2[t2]))
              return e2[t2];
          return null;
        }};
      }, {}], 9: [function(e, t, r) {
        (function(r2) {
          (function() {
            "use strict";
            var n = e("../client"), i = e("../store"), o = e("url"), s = e("xtend"), a = e("debug")("mqttjs"), c = {};
            function u(e2, t2) {
              if (a("connecting to an MQTT broker..."), typeof e2 != "object" || t2 || (t2 = e2, e2 = null), t2 = t2 || {}, e2) {
                var r3 = o.parse(e2, true);
                if (r3.port != null && (r3.port = Number(r3.port)), (t2 = s(r3, t2)).protocol === null)
                  throw new Error("Missing protocol");
                t2.protocol = t2.protocol.replace(/:$/, "");
              }
              if (function(e3) {
                var t3;
                e3.auth && ((t3 = e3.auth.match(/^(.+):(.+)$/)) ? (e3.username = t3[1], e3.password = t3[2]) : e3.username = e3.auth);
              }(t2), t2.query && typeof t2.query.clientId == "string" && (t2.clientId = t2.query.clientId), t2.cert && t2.key) {
                if (!t2.protocol)
                  throw new Error("Missing secure protocol key");
                if (["mqtts", "wss", "wxs", "alis"].indexOf(t2.protocol) === -1)
                  switch (t2.protocol) {
                    case "mqtt":
                      t2.protocol = "mqtts";
                      break;
                    case "ws":
                      t2.protocol = "wss";
                      break;
                    case "wx":
                      t2.protocol = "wxs";
                      break;
                    case "ali":
                      t2.protocol = "alis";
                      break;
                    default:
                      throw new Error('Unknown protocol for secure connection: "' + t2.protocol + '"!');
                  }
              }
              if (!c[t2.protocol]) {
                var i2 = ["mqtts", "wss"].indexOf(t2.protocol) !== -1;
                t2.protocol = ["mqtt", "mqtts", "ws", "wss", "wx", "wxs", "ali", "alis"].filter(function(e3, t3) {
                  return (!i2 || t3 % 2 != 0) && typeof c[e3] == "function";
                })[0];
              }
              if (t2.clean === false && !t2.clientId)
                throw new Error("Missing clientId for unclean clients");
              t2.protocol && (t2.defaultProtocol = t2.protocol);
              var u2 = new n(function(e3) {
                return t2.servers && (e3._reconnectCount && e3._reconnectCount !== t2.servers.length || (e3._reconnectCount = 0), t2.host = t2.servers[e3._reconnectCount].host, t2.port = t2.servers[e3._reconnectCount].port, t2.protocol = t2.servers[e3._reconnectCount].protocol ? t2.servers[e3._reconnectCount].protocol : t2.defaultProtocol, t2.hostname = t2.host, e3._reconnectCount++), a("calling streambuilder for", t2.protocol), c[t2.protocol](e3, t2);
              }, t2);
              return u2.on("error", function() {
              }), u2;
            }
            r2 !== void 0 && r2.title !== "browser" || typeof __webpack_require__ != "function" ? (c.mqtt = e("./tcp"), c.tcp = e("./tcp"), c.ssl = e("./tls"), c.tls = e("./tls"), c.mqtts = e("./tls")) : (c.wx = e("./wx"), c.wxs = e("./wx"), c.ali = e("./ali"), c.alis = e("./ali")), c.ws = e("./ws"), c.wss = e("./ws"), t.exports = u, t.exports.connect = u, t.exports.MqttClient = n, t.exports.Store = i;
          }).call(this);
        }).call(this, e("_process"));
      }, {"../client": 1, "../store": 7, "./ali": 2, "./tcp": 3, "./tls": 4, "./ws": 5, "./wx": 6, _process: 32, debug: 15, url: 56, xtend: 61}], 10: [function(e, t, r) {
        "use strict";
        r.byteLength = function(e2) {
          var t2 = u(e2), r2 = t2[0], n2 = t2[1];
          return 3 * (r2 + n2) / 4 - n2;
        }, r.toByteArray = function(e2) {
          var t2, r2, n2 = u(e2), s2 = n2[0], a2 = n2[1], c2 = new o(function(e3, t3, r3) {
            return 3 * (t3 + r3) / 4 - r3;
          }(0, s2, a2)), l2 = 0, f = a2 > 0 ? s2 - 4 : s2;
          for (r2 = 0; r2 < f; r2 += 4)
            t2 = i[e2.charCodeAt(r2)] << 18 | i[e2.charCodeAt(r2 + 1)] << 12 | i[e2.charCodeAt(r2 + 2)] << 6 | i[e2.charCodeAt(r2 + 3)], c2[l2++] = t2 >> 16 & 255, c2[l2++] = t2 >> 8 & 255, c2[l2++] = 255 & t2;
          a2 === 2 && (t2 = i[e2.charCodeAt(r2)] << 2 | i[e2.charCodeAt(r2 + 1)] >> 4, c2[l2++] = 255 & t2);
          a2 === 1 && (t2 = i[e2.charCodeAt(r2)] << 10 | i[e2.charCodeAt(r2 + 1)] << 4 | i[e2.charCodeAt(r2 + 2)] >> 2, c2[l2++] = t2 >> 8 & 255, c2[l2++] = 255 & t2);
          return c2;
        }, r.fromByteArray = function(e2) {
          for (var t2, r2 = e2.length, i2 = r2 % 3, o2 = [], s2 = 0, a2 = r2 - i2; s2 < a2; s2 += 16383)
            o2.push(l(e2, s2, s2 + 16383 > a2 ? a2 : s2 + 16383));
          i2 === 1 ? (t2 = e2[r2 - 1], o2.push(n[t2 >> 2] + n[t2 << 4 & 63] + "==")) : i2 === 2 && (t2 = (e2[r2 - 2] << 8) + e2[r2 - 1], o2.push(n[t2 >> 10] + n[t2 >> 4 & 63] + n[t2 << 2 & 63] + "="));
          return o2.join("");
        };
        for (var n = [], i = [], o = typeof Uint8Array != "undefined" ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, c = s.length; a < c; ++a)
          n[a] = s[a], i[s.charCodeAt(a)] = a;
        function u(e2) {
          var t2 = e2.length;
          if (t2 % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
          var r2 = e2.indexOf("=");
          return r2 === -1 && (r2 = t2), [r2, r2 === t2 ? 0 : 4 - r2 % 4];
        }
        function l(e2, t2, r2) {
          for (var i2, o2, s2 = [], a2 = t2; a2 < r2; a2 += 3)
            i2 = (e2[a2] << 16 & 16711680) + (e2[a2 + 1] << 8 & 65280) + (255 & e2[a2 + 2]), s2.push(n[(o2 = i2) >> 18 & 63] + n[o2 >> 12 & 63] + n[o2 >> 6 & 63] + n[63 & o2]);
          return s2.join("");
        }
        i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
      }, {}], 11: [function(e, t, r) {
        "use strict";
        const {Buffer: n} = e("buffer"), i = Symbol.for("BufferList");
        function o(e2) {
          if (!(this instanceof o))
            return new o(e2);
          o._init.call(this, e2);
        }
        o._init = function(e2) {
          Object.defineProperty(this, i, {value: true}), this._bufs = [], this.length = 0, e2 && this.append(e2);
        }, o.prototype._new = function(e2) {
          return new o(e2);
        }, o.prototype._offset = function(e2) {
          if (e2 === 0)
            return [0, 0];
          let t2 = 0;
          for (let r2 = 0; r2 < this._bufs.length; r2++) {
            const n2 = t2 + this._bufs[r2].length;
            if (e2 < n2 || r2 === this._bufs.length - 1)
              return [r2, e2 - t2];
            t2 = n2;
          }
        }, o.prototype._reverseOffset = function(e2) {
          const t2 = e2[0];
          let r2 = e2[1];
          for (let e3 = 0; e3 < t2; e3++)
            r2 += this._bufs[e3].length;
          return r2;
        }, o.prototype.get = function(e2) {
          if (e2 > this.length || e2 < 0)
            return;
          const t2 = this._offset(e2);
          return this._bufs[t2[0]][t2[1]];
        }, o.prototype.slice = function(e2, t2) {
          return typeof e2 == "number" && e2 < 0 && (e2 += this.length), typeof t2 == "number" && t2 < 0 && (t2 += this.length), this.copy(null, 0, e2, t2);
        }, o.prototype.copy = function(e2, t2, r2, i2) {
          if ((typeof r2 != "number" || r2 < 0) && (r2 = 0), (typeof i2 != "number" || i2 > this.length) && (i2 = this.length), r2 >= this.length)
            return e2 || n.alloc(0);
          if (i2 <= 0)
            return e2 || n.alloc(0);
          const o2 = !!e2, s = this._offset(r2), a = i2 - r2;
          let c = a, u = o2 && t2 || 0, l = s[1];
          if (r2 === 0 && i2 === this.length) {
            if (!o2)
              return this._bufs.length === 1 ? this._bufs[0] : n.concat(this._bufs, this.length);
            for (let t3 = 0; t3 < this._bufs.length; t3++)
              this._bufs[t3].copy(e2, u), u += this._bufs[t3].length;
            return e2;
          }
          if (c <= this._bufs[s[0]].length - l)
            return o2 ? this._bufs[s[0]].copy(e2, t2, l, l + c) : this._bufs[s[0]].slice(l, l + c);
          o2 || (e2 = n.allocUnsafe(a));
          for (let t3 = s[0]; t3 < this._bufs.length; t3++) {
            const r3 = this._bufs[t3].length - l;
            if (!(c > r3)) {
              this._bufs[t3].copy(e2, u, l, l + c), u += r3;
              break;
            }
            this._bufs[t3].copy(e2, u, l), u += r3, c -= r3, l && (l = 0);
          }
          return e2.length > u ? e2.slice(0, u) : e2;
        }, o.prototype.shallowSlice = function(e2, t2) {
          if (e2 = e2 || 0, t2 = typeof t2 != "number" ? this.length : t2, e2 < 0 && (e2 += this.length), t2 < 0 && (t2 += this.length), e2 === t2)
            return this._new();
          const r2 = this._offset(e2), n2 = this._offset(t2), i2 = this._bufs.slice(r2[0], n2[0] + 1);
          return n2[1] === 0 ? i2.pop() : i2[i2.length - 1] = i2[i2.length - 1].slice(0, n2[1]), r2[1] !== 0 && (i2[0] = i2[0].slice(r2[1])), this._new(i2);
        }, o.prototype.toString = function(e2, t2, r2) {
          return this.slice(t2, r2).toString(e2);
        }, o.prototype.consume = function(e2) {
          if (e2 = Math.trunc(e2), Number.isNaN(e2) || e2 <= 0)
            return this;
          for (; this._bufs.length; ) {
            if (!(e2 >= this._bufs[0].length)) {
              this._bufs[0] = this._bufs[0].slice(e2), this.length -= e2;
              break;
            }
            e2 -= this._bufs[0].length, this.length -= this._bufs[0].length, this._bufs.shift();
          }
          return this;
        }, o.prototype.duplicate = function() {
          const e2 = this._new();
          for (let t2 = 0; t2 < this._bufs.length; t2++)
            e2.append(this._bufs[t2]);
          return e2;
        }, o.prototype.append = function(e2) {
          if (e2 == null)
            return this;
          if (e2.buffer)
            this._appendBuffer(n.from(e2.buffer, e2.byteOffset, e2.byteLength));
          else if (Array.isArray(e2))
            for (let t2 = 0; t2 < e2.length; t2++)
              this.append(e2[t2]);
          else if (this._isBufferList(e2))
            for (let t2 = 0; t2 < e2._bufs.length; t2++)
              this.append(e2._bufs[t2]);
          else
            typeof e2 == "number" && (e2 = e2.toString()), this._appendBuffer(n.from(e2));
          return this;
        }, o.prototype._appendBuffer = function(e2) {
          this._bufs.push(e2), this.length += e2.length;
        }, o.prototype.indexOf = function(e2, t2, r2) {
          if (r2 === void 0 && typeof t2 == "string" && (r2 = t2, t2 = void 0), typeof e2 == "function" || Array.isArray(e2))
            throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
          if (typeof e2 == "number" ? e2 = n.from([e2]) : typeof e2 == "string" ? e2 = n.from(e2, r2) : this._isBufferList(e2) ? e2 = e2.slice() : Array.isArray(e2.buffer) ? e2 = n.from(e2.buffer, e2.byteOffset, e2.byteLength) : n.isBuffer(e2) || (e2 = n.from(e2)), t2 = Number(t2 || 0), isNaN(t2) && (t2 = 0), t2 < 0 && (t2 = this.length + t2), t2 < 0 && (t2 = 0), e2.length === 0)
            return t2 > this.length ? this.length : t2;
          const i2 = this._offset(t2);
          let o2 = i2[0], s = i2[1];
          for (; o2 < this._bufs.length; o2++) {
            const t3 = this._bufs[o2];
            for (; s < t3.length; ) {
              if (t3.length - s >= e2.length) {
                const r3 = t3.indexOf(e2, s);
                if (r3 !== -1)
                  return this._reverseOffset([o2, r3]);
                s = t3.length - e2.length + 1;
              } else {
                const t4 = this._reverseOffset([o2, s]);
                if (this._match(t4, e2))
                  return t4;
                s++;
              }
            }
            s = 0;
          }
          return -1;
        }, o.prototype._match = function(e2, t2) {
          if (this.length - e2 < t2.length)
            return false;
          for (let r2 = 0; r2 < t2.length; r2++)
            if (this.get(e2 + r2) !== t2[r2])
              return false;
          return true;
        }, function() {
          const e2 = {readDoubleBE: 8, readDoubleLE: 8, readFloatBE: 4, readFloatLE: 4, readInt32BE: 4, readInt32LE: 4, readUInt32BE: 4, readUInt32LE: 4, readInt16BE: 2, readInt16LE: 2, readUInt16BE: 2, readUInt16LE: 2, readInt8: 1, readUInt8: 1, readIntBE: null, readIntLE: null, readUIntBE: null, readUIntLE: null};
          for (const t2 in e2)
            !function(t3) {
              o.prototype[t3] = e2[t3] === null ? function(e3, r2) {
                return this.slice(e3, e3 + r2)[t3](0, r2);
              } : function(r2 = 0) {
                return this.slice(r2, r2 + e2[t3])[t3](0);
              };
            }(t2);
        }(), o.prototype._isBufferList = function(e2) {
          return e2 instanceof o || o.isBufferList(e2);
        }, o.isBufferList = function(e2) {
          return e2 != null && e2[i];
        }, t.exports = o;
      }, {buffer: 14}], 12: [function(e, t, r) {
        "use strict";
        const n = e("readable-stream").Duplex, i = e("inherits"), o = e("./BufferList");
        function s(e2) {
          if (!(this instanceof s))
            return new s(e2);
          if (typeof e2 == "function") {
            this._callback = e2;
            const t2 = function(e3) {
              this._callback && (this._callback(e3), this._callback = null);
            }.bind(this);
            this.on("pipe", function(e3) {
              e3.on("error", t2);
            }), this.on("unpipe", function(e3) {
              e3.removeListener("error", t2);
            }), e2 = null;
          }
          o._init.call(this, e2), n.call(this);
        }
        i(s, n), Object.assign(s.prototype, o.prototype), s.prototype._new = function(e2) {
          return new s(e2);
        }, s.prototype._write = function(e2, t2, r2) {
          this._appendBuffer(e2), typeof r2 == "function" && r2();
        }, s.prototype._read = function(e2) {
          if (!this.length)
            return this.push(null);
          e2 = Math.min(e2, this.length), this.push(this.slice(0, e2)), this.consume(e2);
        }, s.prototype.end = function(e2) {
          n.prototype.end.call(this, e2), this._callback && (this._callback(null, this.slice()), this._callback = null);
        }, s.prototype._destroy = function(e2, t2) {
          this._bufs.length = 0, this.length = 0, t2(e2);
        }, s.prototype._isBufferList = function(e2) {
          return e2 instanceof s || e2 instanceof o || s.isBufferList(e2);
        }, s.isBufferList = o.isBufferList, t.exports = s, t.exports.BufferListStream = s, t.exports.BufferList = o;
      }, {"./BufferList": 11, inherits: 21, "readable-stream": 51}], 13: [function(e, t, r) {
      }, {}], 14: [function(e, t, r) {
        (function(t2) {
          (function() {
            "use strict";
            var t3 = e("base64-js"), n = e("ieee754");
            r.Buffer = s, r.SlowBuffer = function(e2) {
              +e2 != e2 && (e2 = 0);
              return s.alloc(+e2);
            }, r.INSPECT_MAX_BYTES = 50;
            var i = 2147483647;
            function o(e2) {
              if (e2 > i)
                throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
              var t4 = new Uint8Array(e2);
              return t4.__proto__ = s.prototype, t4;
            }
            function s(e2, t4, r2) {
              if (typeof e2 == "number") {
                if (typeof t4 == "string")
                  throw new TypeError('The "string" argument must be of type string. Received type number');
                return u(e2);
              }
              return a(e2, t4, r2);
            }
            function a(e2, t4, r2) {
              if (typeof e2 == "string")
                return function(e3, t5) {
                  typeof t5 == "string" && t5 !== "" || (t5 = "utf8");
                  if (!s.isEncoding(t5))
                    throw new TypeError("Unknown encoding: " + t5);
                  var r3 = 0 | h(e3, t5), n3 = o(r3), i3 = n3.write(e3, t5);
                  i3 !== r3 && (n3 = n3.slice(0, i3));
                  return n3;
                }(e2, t4);
              if (ArrayBuffer.isView(e2))
                return l(e2);
              if (e2 == null)
                throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
              if (q(e2, ArrayBuffer) || e2 && q(e2.buffer, ArrayBuffer))
                return function(e3, t5, r3) {
                  if (t5 < 0 || e3.byteLength < t5)
                    throw new RangeError('"offset" is outside of buffer bounds');
                  if (e3.byteLength < t5 + (r3 || 0))
                    throw new RangeError('"length" is outside of buffer bounds');
                  var n3;
                  n3 = t5 === void 0 && r3 === void 0 ? new Uint8Array(e3) : r3 === void 0 ? new Uint8Array(e3, t5) : new Uint8Array(e3, t5, r3);
                  return n3.__proto__ = s.prototype, n3;
                }(e2, t4, r2);
              if (typeof e2 == "number")
                throw new TypeError('The "value" argument must not be of type number. Received type number');
              var n2 = e2.valueOf && e2.valueOf();
              if (n2 != null && n2 !== e2)
                return s.from(n2, t4, r2);
              var i2 = function(e3) {
                if (s.isBuffer(e3)) {
                  var t5 = 0 | f(e3.length), r3 = o(t5);
                  return r3.length === 0 ? r3 : (e3.copy(r3, 0, 0, t5), r3);
                }
                if (e3.length !== void 0)
                  return typeof e3.length != "number" || D(e3.length) ? o(0) : l(e3);
                if (e3.type === "Buffer" && Array.isArray(e3.data))
                  return l(e3.data);
              }(e2);
              if (i2)
                return i2;
              if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof e2[Symbol.toPrimitive] == "function")
                return s.from(e2[Symbol.toPrimitive]("string"), t4, r2);
              throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
            }
            function c(e2) {
              if (typeof e2 != "number")
                throw new TypeError('"size" argument must be of type number');
              if (e2 < 0)
                throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
            }
            function u(e2) {
              return c(e2), o(e2 < 0 ? 0 : 0 | f(e2));
            }
            function l(e2) {
              for (var t4 = e2.length < 0 ? 0 : 0 | f(e2.length), r2 = o(t4), n2 = 0; n2 < t4; n2 += 1)
                r2[n2] = 255 & e2[n2];
              return r2;
            }
            function f(e2) {
              if (e2 >= i)
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
              return 0 | e2;
            }
            function h(e2, t4) {
              if (s.isBuffer(e2))
                return e2.length;
              if (ArrayBuffer.isView(e2) || q(e2, ArrayBuffer))
                return e2.byteLength;
              if (typeof e2 != "string")
                throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e2);
              var r2 = e2.length, n2 = arguments.length > 2 && arguments[2] === true;
              if (!n2 && r2 === 0)
                return 0;
              for (var i2 = false; ; )
                switch (t4) {
                  case "ascii":
                  case "latin1":
                  case "binary":
                    return r2;
                  case "utf8":
                  case "utf-8":
                    return N(e2).length;
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return 2 * r2;
                  case "hex":
                    return r2 >>> 1;
                  case "base64":
                    return U(e2).length;
                  default:
                    if (i2)
                      return n2 ? -1 : N(e2).length;
                    t4 = ("" + t4).toLowerCase(), i2 = true;
                }
            }
            function p(e2, t4, r2) {
              var n2 = e2[t4];
              e2[t4] = e2[r2], e2[r2] = n2;
            }
            function d(e2, t4, r2, n2, i2) {
              if (e2.length === 0)
                return -1;
              if (typeof r2 == "string" ? (n2 = r2, r2 = 0) : r2 > 2147483647 ? r2 = 2147483647 : r2 < -2147483648 && (r2 = -2147483648), D(r2 = +r2) && (r2 = i2 ? 0 : e2.length - 1), r2 < 0 && (r2 = e2.length + r2), r2 >= e2.length) {
                if (i2)
                  return -1;
                r2 = e2.length - 1;
              } else if (r2 < 0) {
                if (!i2)
                  return -1;
                r2 = 0;
              }
              if (typeof t4 == "string" && (t4 = s.from(t4, n2)), s.isBuffer(t4))
                return t4.length === 0 ? -1 : g(e2, t4, r2, n2, i2);
              if (typeof t4 == "number")
                return t4 &= 255, typeof Uint8Array.prototype.indexOf == "function" ? i2 ? Uint8Array.prototype.indexOf.call(e2, t4, r2) : Uint8Array.prototype.lastIndexOf.call(e2, t4, r2) : g(e2, [t4], r2, n2, i2);
              throw new TypeError("val must be string, number or Buffer");
            }
            function g(e2, t4, r2, n2, i2) {
              var o2, s2 = 1, a2 = e2.length, c2 = t4.length;
              if (n2 !== void 0 && ((n2 = String(n2).toLowerCase()) === "ucs2" || n2 === "ucs-2" || n2 === "utf16le" || n2 === "utf-16le")) {
                if (e2.length < 2 || t4.length < 2)
                  return -1;
                s2 = 2, a2 /= 2, c2 /= 2, r2 /= 2;
              }
              function u2(e3, t5) {
                return s2 === 1 ? e3[t5] : e3.readUInt16BE(t5 * s2);
              }
              if (i2) {
                var l2 = -1;
                for (o2 = r2; o2 < a2; o2++)
                  if (u2(e2, o2) === u2(t4, l2 === -1 ? 0 : o2 - l2)) {
                    if (l2 === -1 && (l2 = o2), o2 - l2 + 1 === c2)
                      return l2 * s2;
                  } else
                    l2 !== -1 && (o2 -= o2 - l2), l2 = -1;
              } else
                for (r2 + c2 > a2 && (r2 = a2 - c2), o2 = r2; o2 >= 0; o2--) {
                  for (var f2 = true, h2 = 0; h2 < c2; h2++)
                    if (u2(e2, o2 + h2) !== u2(t4, h2)) {
                      f2 = false;
                      break;
                    }
                  if (f2)
                    return o2;
                }
              return -1;
            }
            function b(e2, t4, r2, n2) {
              r2 = Number(r2) || 0;
              var i2 = e2.length - r2;
              n2 ? (n2 = Number(n2)) > i2 && (n2 = i2) : n2 = i2;
              var o2 = t4.length;
              n2 > o2 / 2 && (n2 = o2 / 2);
              for (var s2 = 0; s2 < n2; ++s2) {
                var a2 = parseInt(t4.substr(2 * s2, 2), 16);
                if (D(a2))
                  return s2;
                e2[r2 + s2] = a2;
              }
              return s2;
            }
            function m(e2, t4, r2, n2) {
              return j(N(t4, e2.length - r2), e2, r2, n2);
            }
            function y(e2, t4, r2, n2) {
              return j(function(e3) {
                for (var t5 = [], r3 = 0; r3 < e3.length; ++r3)
                  t5.push(255 & e3.charCodeAt(r3));
                return t5;
              }(t4), e2, r2, n2);
            }
            function _(e2, t4, r2, n2) {
              return y(e2, t4, r2, n2);
            }
            function w(e2, t4, r2, n2) {
              return j(U(t4), e2, r2, n2);
            }
            function v(e2, t4, r2, n2) {
              return j(function(e3, t5) {
                for (var r3, n3, i2, o2 = [], s2 = 0; s2 < e3.length && !((t5 -= 2) < 0); ++s2)
                  r3 = e3.charCodeAt(s2), n3 = r3 >> 8, i2 = r3 % 256, o2.push(i2), o2.push(n3);
                return o2;
              }(t4, e2.length - r2), e2, r2, n2);
            }
            function S(e2, r2, n2) {
              return r2 === 0 && n2 === e2.length ? t3.fromByteArray(e2) : t3.fromByteArray(e2.slice(r2, n2));
            }
            function E(e2, t4, r2) {
              r2 = Math.min(e2.length, r2);
              for (var n2 = [], i2 = t4; i2 < r2; ) {
                var o2, s2, a2, c2, u2 = e2[i2], l2 = null, f2 = u2 > 239 ? 4 : u2 > 223 ? 3 : u2 > 191 ? 2 : 1;
                if (i2 + f2 <= r2)
                  switch (f2) {
                    case 1:
                      u2 < 128 && (l2 = u2);
                      break;
                    case 2:
                      (192 & (o2 = e2[i2 + 1])) == 128 && (c2 = (31 & u2) << 6 | 63 & o2) > 127 && (l2 = c2);
                      break;
                    case 3:
                      o2 = e2[i2 + 1], s2 = e2[i2 + 2], (192 & o2) == 128 && (192 & s2) == 128 && (c2 = (15 & u2) << 12 | (63 & o2) << 6 | 63 & s2) > 2047 && (c2 < 55296 || c2 > 57343) && (l2 = c2);
                      break;
                    case 4:
                      o2 = e2[i2 + 1], s2 = e2[i2 + 2], a2 = e2[i2 + 3], (192 & o2) == 128 && (192 & s2) == 128 && (192 & a2) == 128 && (c2 = (15 & u2) << 18 | (63 & o2) << 12 | (63 & s2) << 6 | 63 & a2) > 65535 && c2 < 1114112 && (l2 = c2);
                  }
                l2 === null ? (l2 = 65533, f2 = 1) : l2 > 65535 && (l2 -= 65536, n2.push(l2 >>> 10 & 1023 | 55296), l2 = 56320 | 1023 & l2), n2.push(l2), i2 += f2;
              }
              return function(e3) {
                var t5 = e3.length;
                if (t5 <= k)
                  return String.fromCharCode.apply(String, e3);
                var r3 = "", n3 = 0;
                for (; n3 < t5; )
                  r3 += String.fromCharCode.apply(String, e3.slice(n3, n3 += k));
                return r3;
              }(n2);
            }
            r.kMaxLength = i, s.TYPED_ARRAY_SUPPORT = function() {
              try {
                var e2 = new Uint8Array(1);
                return e2.__proto__ = {__proto__: Uint8Array.prototype, foo: function() {
                  return 42;
                }}, e2.foo() === 42;
              } catch (e3) {
                return false;
              }
            }(), s.TYPED_ARRAY_SUPPORT || typeof console == "undefined" || typeof console.error != "function" || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(s.prototype, "parent", {enumerable: true, get: function() {
              if (s.isBuffer(this))
                return this.buffer;
            }}), Object.defineProperty(s.prototype, "offset", {enumerable: true, get: function() {
              if (s.isBuffer(this))
                return this.byteOffset;
            }}), typeof Symbol != "undefined" && Symbol.species != null && s[Symbol.species] === s && Object.defineProperty(s, Symbol.species, {value: null, configurable: true, enumerable: false, writable: false}), s.poolSize = 8192, s.from = function(e2, t4, r2) {
              return a(e2, t4, r2);
            }, s.prototype.__proto__ = Uint8Array.prototype, s.__proto__ = Uint8Array, s.alloc = function(e2, t4, r2) {
              return function(e3, t5, r3) {
                return c(e3), e3 <= 0 ? o(e3) : t5 !== void 0 ? typeof r3 == "string" ? o(e3).fill(t5, r3) : o(e3).fill(t5) : o(e3);
              }(e2, t4, r2);
            }, s.allocUnsafe = function(e2) {
              return u(e2);
            }, s.allocUnsafeSlow = function(e2) {
              return u(e2);
            }, s.isBuffer = function(e2) {
              return e2 != null && e2._isBuffer === true && e2 !== s.prototype;
            }, s.compare = function(e2, t4) {
              if (q(e2, Uint8Array) && (e2 = s.from(e2, e2.offset, e2.byteLength)), q(t4, Uint8Array) && (t4 = s.from(t4, t4.offset, t4.byteLength)), !s.isBuffer(e2) || !s.isBuffer(t4))
                throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
              if (e2 === t4)
                return 0;
              for (var r2 = e2.length, n2 = t4.length, i2 = 0, o2 = Math.min(r2, n2); i2 < o2; ++i2)
                if (e2[i2] !== t4[i2]) {
                  r2 = e2[i2], n2 = t4[i2];
                  break;
                }
              return r2 < n2 ? -1 : n2 < r2 ? 1 : 0;
            }, s.isEncoding = function(e2) {
              switch (String(e2).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return true;
                default:
                  return false;
              }
            }, s.concat = function(e2, t4) {
              if (!Array.isArray(e2))
                throw new TypeError('"list" argument must be an Array of Buffers');
              if (e2.length === 0)
                return s.alloc(0);
              var r2;
              if (t4 === void 0)
                for (t4 = 0, r2 = 0; r2 < e2.length; ++r2)
                  t4 += e2[r2].length;
              var n2 = s.allocUnsafe(t4), i2 = 0;
              for (r2 = 0; r2 < e2.length; ++r2) {
                var o2 = e2[r2];
                if (q(o2, Uint8Array) && (o2 = s.from(o2)), !s.isBuffer(o2))
                  throw new TypeError('"list" argument must be an Array of Buffers');
                o2.copy(n2, i2), i2 += o2.length;
              }
              return n2;
            }, s.byteLength = h, s.prototype._isBuffer = true, s.prototype.swap16 = function() {
              var e2 = this.length;
              if (e2 % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits");
              for (var t4 = 0; t4 < e2; t4 += 2)
                p(this, t4, t4 + 1);
              return this;
            }, s.prototype.swap32 = function() {
              var e2 = this.length;
              if (e2 % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits");
              for (var t4 = 0; t4 < e2; t4 += 4)
                p(this, t4, t4 + 3), p(this, t4 + 1, t4 + 2);
              return this;
            }, s.prototype.swap64 = function() {
              var e2 = this.length;
              if (e2 % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits");
              for (var t4 = 0; t4 < e2; t4 += 8)
                p(this, t4, t4 + 7), p(this, t4 + 1, t4 + 6), p(this, t4 + 2, t4 + 5), p(this, t4 + 3, t4 + 4);
              return this;
            }, s.prototype.toString = function() {
              var e2 = this.length;
              return e2 === 0 ? "" : arguments.length === 0 ? E(this, 0, e2) : function(e3, t4, r2) {
                var n2 = false;
                if ((t4 === void 0 || t4 < 0) && (t4 = 0), t4 > this.length)
                  return "";
                if ((r2 === void 0 || r2 > this.length) && (r2 = this.length), r2 <= 0)
                  return "";
                if ((r2 >>>= 0) <= (t4 >>>= 0))
                  return "";
                for (e3 || (e3 = "utf8"); ; )
                  switch (e3) {
                    case "hex":
                      return T(this, t4, r2);
                    case "utf8":
                    case "utf-8":
                      return E(this, t4, r2);
                    case "ascii":
                      return I(this, t4, r2);
                    case "latin1":
                    case "binary":
                      return C(this, t4, r2);
                    case "base64":
                      return S(this, t4, r2);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return A(this, t4, r2);
                    default:
                      if (n2)
                        throw new TypeError("Unknown encoding: " + e3);
                      e3 = (e3 + "").toLowerCase(), n2 = true;
                  }
              }.apply(this, arguments);
            }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(e2) {
              if (!s.isBuffer(e2))
                throw new TypeError("Argument must be a Buffer");
              return this === e2 || s.compare(this, e2) === 0;
            }, s.prototype.inspect = function() {
              var e2 = "", t4 = r.INSPECT_MAX_BYTES;
              return e2 = this.toString("hex", 0, t4).replace(/(.{2})/g, "$1 ").trim(), this.length > t4 && (e2 += " ... "), "<Buffer " + e2 + ">";
            }, s.prototype.compare = function(e2, t4, r2, n2, i2) {
              if (q(e2, Uint8Array) && (e2 = s.from(e2, e2.offset, e2.byteLength)), !s.isBuffer(e2))
                throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e2);
              if (t4 === void 0 && (t4 = 0), r2 === void 0 && (r2 = e2 ? e2.length : 0), n2 === void 0 && (n2 = 0), i2 === void 0 && (i2 = this.length), t4 < 0 || r2 > e2.length || n2 < 0 || i2 > this.length)
                throw new RangeError("out of range index");
              if (n2 >= i2 && t4 >= r2)
                return 0;
              if (n2 >= i2)
                return -1;
              if (t4 >= r2)
                return 1;
              if (t4 >>>= 0, r2 >>>= 0, n2 >>>= 0, i2 >>>= 0, this === e2)
                return 0;
              for (var o2 = i2 - n2, a2 = r2 - t4, c2 = Math.min(o2, a2), u2 = this.slice(n2, i2), l2 = e2.slice(t4, r2), f2 = 0; f2 < c2; ++f2)
                if (u2[f2] !== l2[f2]) {
                  o2 = u2[f2], a2 = l2[f2];
                  break;
                }
              return o2 < a2 ? -1 : a2 < o2 ? 1 : 0;
            }, s.prototype.includes = function(e2, t4, r2) {
              return this.indexOf(e2, t4, r2) !== -1;
            }, s.prototype.indexOf = function(e2, t4, r2) {
              return d(this, e2, t4, r2, true);
            }, s.prototype.lastIndexOf = function(e2, t4, r2) {
              return d(this, e2, t4, r2, false);
            }, s.prototype.write = function(e2, t4, r2, n2) {
              if (t4 === void 0)
                n2 = "utf8", r2 = this.length, t4 = 0;
              else if (r2 === void 0 && typeof t4 == "string")
                n2 = t4, r2 = this.length, t4 = 0;
              else {
                if (!isFinite(t4))
                  throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t4 >>>= 0, isFinite(r2) ? (r2 >>>= 0, n2 === void 0 && (n2 = "utf8")) : (n2 = r2, r2 = void 0);
              }
              var i2 = this.length - t4;
              if ((r2 === void 0 || r2 > i2) && (r2 = i2), e2.length > 0 && (r2 < 0 || t4 < 0) || t4 > this.length)
                throw new RangeError("Attempt to write outside buffer bounds");
              n2 || (n2 = "utf8");
              for (var o2 = false; ; )
                switch (n2) {
                  case "hex":
                    return b(this, e2, t4, r2);
                  case "utf8":
                  case "utf-8":
                    return m(this, e2, t4, r2);
                  case "ascii":
                    return y(this, e2, t4, r2);
                  case "latin1":
                  case "binary":
                    return _(this, e2, t4, r2);
                  case "base64":
                    return w(this, e2, t4, r2);
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return v(this, e2, t4, r2);
                  default:
                    if (o2)
                      throw new TypeError("Unknown encoding: " + n2);
                    n2 = ("" + n2).toLowerCase(), o2 = true;
                }
            }, s.prototype.toJSON = function() {
              return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)};
            };
            var k = 4096;
            function I(e2, t4, r2) {
              var n2 = "";
              r2 = Math.min(e2.length, r2);
              for (var i2 = t4; i2 < r2; ++i2)
                n2 += String.fromCharCode(127 & e2[i2]);
              return n2;
            }
            function C(e2, t4, r2) {
              var n2 = "";
              r2 = Math.min(e2.length, r2);
              for (var i2 = t4; i2 < r2; ++i2)
                n2 += String.fromCharCode(e2[i2]);
              return n2;
            }
            function T(e2, t4, r2) {
              var n2 = e2.length;
              (!t4 || t4 < 0) && (t4 = 0), (!r2 || r2 < 0 || r2 > n2) && (r2 = n2);
              for (var i2 = "", o2 = t4; o2 < r2; ++o2)
                i2 += B(e2[o2]);
              return i2;
            }
            function A(e2, t4, r2) {
              for (var n2 = e2.slice(t4, r2), i2 = "", o2 = 0; o2 < n2.length; o2 += 2)
                i2 += String.fromCharCode(n2[o2] + 256 * n2[o2 + 1]);
              return i2;
            }
            function R(e2, t4, r2) {
              if (e2 % 1 != 0 || e2 < 0)
                throw new RangeError("offset is not uint");
              if (e2 + t4 > r2)
                throw new RangeError("Trying to access beyond buffer length");
            }
            function O(e2, t4, r2, n2, i2, o2) {
              if (!s.isBuffer(e2))
                throw new TypeError('"buffer" argument must be a Buffer instance');
              if (t4 > i2 || t4 < o2)
                throw new RangeError('"value" argument is out of bounds');
              if (r2 + n2 > e2.length)
                throw new RangeError("Index out of range");
            }
            function x(e2, t4, r2, n2, i2, o2) {
              if (r2 + n2 > e2.length)
                throw new RangeError("Index out of range");
              if (r2 < 0)
                throw new RangeError("Index out of range");
            }
            function P(e2, t4, r2, i2, o2) {
              return t4 = +t4, r2 >>>= 0, o2 || x(e2, 0, r2, 4), n.write(e2, t4, r2, i2, 23, 4), r2 + 4;
            }
            function M(e2, t4, r2, i2, o2) {
              return t4 = +t4, r2 >>>= 0, o2 || x(e2, 0, r2, 8), n.write(e2, t4, r2, i2, 52, 8), r2 + 8;
            }
            s.prototype.slice = function(e2, t4) {
              var r2 = this.length;
              e2 = ~~e2, t4 = t4 === void 0 ? r2 : ~~t4, e2 < 0 ? (e2 += r2) < 0 && (e2 = 0) : e2 > r2 && (e2 = r2), t4 < 0 ? (t4 += r2) < 0 && (t4 = 0) : t4 > r2 && (t4 = r2), t4 < e2 && (t4 = e2);
              var n2 = this.subarray(e2, t4);
              return n2.__proto__ = s.prototype, n2;
            }, s.prototype.readUIntLE = function(e2, t4, r2) {
              e2 >>>= 0, t4 >>>= 0, r2 || R(e2, t4, this.length);
              for (var n2 = this[e2], i2 = 1, o2 = 0; ++o2 < t4 && (i2 *= 256); )
                n2 += this[e2 + o2] * i2;
              return n2;
            }, s.prototype.readUIntBE = function(e2, t4, r2) {
              e2 >>>= 0, t4 >>>= 0, r2 || R(e2, t4, this.length);
              for (var n2 = this[e2 + --t4], i2 = 1; t4 > 0 && (i2 *= 256); )
                n2 += this[e2 + --t4] * i2;
              return n2;
            }, s.prototype.readUInt8 = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 1, this.length), this[e2];
            }, s.prototype.readUInt16LE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
            }, s.prototype.readUInt16BE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
            }, s.prototype.readUInt32LE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
            }, s.prototype.readUInt32BE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
            }, s.prototype.readIntLE = function(e2, t4, r2) {
              e2 >>>= 0, t4 >>>= 0, r2 || R(e2, t4, this.length);
              for (var n2 = this[e2], i2 = 1, o2 = 0; ++o2 < t4 && (i2 *= 256); )
                n2 += this[e2 + o2] * i2;
              return n2 >= (i2 *= 128) && (n2 -= Math.pow(2, 8 * t4)), n2;
            }, s.prototype.readIntBE = function(e2, t4, r2) {
              e2 >>>= 0, t4 >>>= 0, r2 || R(e2, t4, this.length);
              for (var n2 = t4, i2 = 1, o2 = this[e2 + --n2]; n2 > 0 && (i2 *= 256); )
                o2 += this[e2 + --n2] * i2;
              return o2 >= (i2 *= 128) && (o2 -= Math.pow(2, 8 * t4)), o2;
            }, s.prototype.readInt8 = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
            }, s.prototype.readInt16LE = function(e2, t4) {
              e2 >>>= 0, t4 || R(e2, 2, this.length);
              var r2 = this[e2] | this[e2 + 1] << 8;
              return 32768 & r2 ? 4294901760 | r2 : r2;
            }, s.prototype.readInt16BE = function(e2, t4) {
              e2 >>>= 0, t4 || R(e2, 2, this.length);
              var r2 = this[e2 + 1] | this[e2] << 8;
              return 32768 & r2 ? 4294901760 | r2 : r2;
            }, s.prototype.readInt32LE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
            }, s.prototype.readInt32BE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
            }, s.prototype.readFloatLE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 4, this.length), n.read(this, e2, true, 23, 4);
            }, s.prototype.readFloatBE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 4, this.length), n.read(this, e2, false, 23, 4);
            }, s.prototype.readDoubleLE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 8, this.length), n.read(this, e2, true, 52, 8);
            }, s.prototype.readDoubleBE = function(e2, t4) {
              return e2 >>>= 0, t4 || R(e2, 8, this.length), n.read(this, e2, false, 52, 8);
            }, s.prototype.writeUIntLE = function(e2, t4, r2, n2) {
              (e2 = +e2, t4 >>>= 0, r2 >>>= 0, n2) || O(this, e2, t4, r2, Math.pow(2, 8 * r2) - 1, 0);
              var i2 = 1, o2 = 0;
              for (this[t4] = 255 & e2; ++o2 < r2 && (i2 *= 256); )
                this[t4 + o2] = e2 / i2 & 255;
              return t4 + r2;
            }, s.prototype.writeUIntBE = function(e2, t4, r2, n2) {
              (e2 = +e2, t4 >>>= 0, r2 >>>= 0, n2) || O(this, e2, t4, r2, Math.pow(2, 8 * r2) - 1, 0);
              var i2 = r2 - 1, o2 = 1;
              for (this[t4 + i2] = 255 & e2; --i2 >= 0 && (o2 *= 256); )
                this[t4 + i2] = e2 / o2 & 255;
              return t4 + r2;
            }, s.prototype.writeUInt8 = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 1, 255, 0), this[t4] = 255 & e2, t4 + 1;
            }, s.prototype.writeUInt16LE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 2, 65535, 0), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, t4 + 2;
            }, s.prototype.writeUInt16BE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 2, 65535, 0), this[t4] = e2 >>> 8, this[t4 + 1] = 255 & e2, t4 + 2;
            }, s.prototype.writeUInt32LE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 4, 4294967295, 0), this[t4 + 3] = e2 >>> 24, this[t4 + 2] = e2 >>> 16, this[t4 + 1] = e2 >>> 8, this[t4] = 255 & e2, t4 + 4;
            }, s.prototype.writeUInt32BE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 4, 4294967295, 0), this[t4] = e2 >>> 24, this[t4 + 1] = e2 >>> 16, this[t4 + 2] = e2 >>> 8, this[t4 + 3] = 255 & e2, t4 + 4;
            }, s.prototype.writeIntLE = function(e2, t4, r2, n2) {
              if (e2 = +e2, t4 >>>= 0, !n2) {
                var i2 = Math.pow(2, 8 * r2 - 1);
                O(this, e2, t4, r2, i2 - 1, -i2);
              }
              var o2 = 0, s2 = 1, a2 = 0;
              for (this[t4] = 255 & e2; ++o2 < r2 && (s2 *= 256); )
                e2 < 0 && a2 === 0 && this[t4 + o2 - 1] !== 0 && (a2 = 1), this[t4 + o2] = (e2 / s2 >> 0) - a2 & 255;
              return t4 + r2;
            }, s.prototype.writeIntBE = function(e2, t4, r2, n2) {
              if (e2 = +e2, t4 >>>= 0, !n2) {
                var i2 = Math.pow(2, 8 * r2 - 1);
                O(this, e2, t4, r2, i2 - 1, -i2);
              }
              var o2 = r2 - 1, s2 = 1, a2 = 0;
              for (this[t4 + o2] = 255 & e2; --o2 >= 0 && (s2 *= 256); )
                e2 < 0 && a2 === 0 && this[t4 + o2 + 1] !== 0 && (a2 = 1), this[t4 + o2] = (e2 / s2 >> 0) - a2 & 255;
              return t4 + r2;
            }, s.prototype.writeInt8 = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 1, 127, -128), e2 < 0 && (e2 = 255 + e2 + 1), this[t4] = 255 & e2, t4 + 1;
            }, s.prototype.writeInt16LE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 2, 32767, -32768), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, t4 + 2;
            }, s.prototype.writeInt16BE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 2, 32767, -32768), this[t4] = e2 >>> 8, this[t4 + 1] = 255 & e2, t4 + 2;
            }, s.prototype.writeInt32LE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 4, 2147483647, -2147483648), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, this[t4 + 2] = e2 >>> 16, this[t4 + 3] = e2 >>> 24, t4 + 4;
            }, s.prototype.writeInt32BE = function(e2, t4, r2) {
              return e2 = +e2, t4 >>>= 0, r2 || O(this, e2, t4, 4, 2147483647, -2147483648), e2 < 0 && (e2 = 4294967295 + e2 + 1), this[t4] = e2 >>> 24, this[t4 + 1] = e2 >>> 16, this[t4 + 2] = e2 >>> 8, this[t4 + 3] = 255 & e2, t4 + 4;
            }, s.prototype.writeFloatLE = function(e2, t4, r2) {
              return P(this, e2, t4, true, r2);
            }, s.prototype.writeFloatBE = function(e2, t4, r2) {
              return P(this, e2, t4, false, r2);
            }, s.prototype.writeDoubleLE = function(e2, t4, r2) {
              return M(this, e2, t4, true, r2);
            }, s.prototype.writeDoubleBE = function(e2, t4, r2) {
              return M(this, e2, t4, false, r2);
            }, s.prototype.copy = function(e2, t4, r2, n2) {
              if (!s.isBuffer(e2))
                throw new TypeError("argument should be a Buffer");
              if (r2 || (r2 = 0), n2 || n2 === 0 || (n2 = this.length), t4 >= e2.length && (t4 = e2.length), t4 || (t4 = 0), n2 > 0 && n2 < r2 && (n2 = r2), n2 === r2)
                return 0;
              if (e2.length === 0 || this.length === 0)
                return 0;
              if (t4 < 0)
                throw new RangeError("targetStart out of bounds");
              if (r2 < 0 || r2 >= this.length)
                throw new RangeError("Index out of range");
              if (n2 < 0)
                throw new RangeError("sourceEnd out of bounds");
              n2 > this.length && (n2 = this.length), e2.length - t4 < n2 - r2 && (n2 = e2.length - t4 + r2);
              var i2 = n2 - r2;
              if (this === e2 && typeof Uint8Array.prototype.copyWithin == "function")
                this.copyWithin(t4, r2, n2);
              else if (this === e2 && r2 < t4 && t4 < n2)
                for (var o2 = i2 - 1; o2 >= 0; --o2)
                  e2[o2 + t4] = this[o2 + r2];
              else
                Uint8Array.prototype.set.call(e2, this.subarray(r2, n2), t4);
              return i2;
            }, s.prototype.fill = function(e2, t4, r2, n2) {
              if (typeof e2 == "string") {
                if (typeof t4 == "string" ? (n2 = t4, t4 = 0, r2 = this.length) : typeof r2 == "string" && (n2 = r2, r2 = this.length), n2 !== void 0 && typeof n2 != "string")
                  throw new TypeError("encoding must be a string");
                if (typeof n2 == "string" && !s.isEncoding(n2))
                  throw new TypeError("Unknown encoding: " + n2);
                if (e2.length === 1) {
                  var i2 = e2.charCodeAt(0);
                  (n2 === "utf8" && i2 < 128 || n2 === "latin1") && (e2 = i2);
                }
              } else
                typeof e2 == "number" && (e2 &= 255);
              if (t4 < 0 || this.length < t4 || this.length < r2)
                throw new RangeError("Out of range index");
              if (r2 <= t4)
                return this;
              var o2;
              if (t4 >>>= 0, r2 = r2 === void 0 ? this.length : r2 >>> 0, e2 || (e2 = 0), typeof e2 == "number")
                for (o2 = t4; o2 < r2; ++o2)
                  this[o2] = e2;
              else {
                var a2 = s.isBuffer(e2) ? e2 : s.from(e2, n2), c2 = a2.length;
                if (c2 === 0)
                  throw new TypeError('The value "' + e2 + '" is invalid for argument "value"');
                for (o2 = 0; o2 < r2 - t4; ++o2)
                  this[o2 + t4] = a2[o2 % c2];
              }
              return this;
            };
            var L = /[^+/0-9A-Za-z-_]/g;
            function B(e2) {
              return e2 < 16 ? "0" + e2.toString(16) : e2.toString(16);
            }
            function N(e2, t4) {
              var r2;
              t4 = t4 || 1 / 0;
              for (var n2 = e2.length, i2 = null, o2 = [], s2 = 0; s2 < n2; ++s2) {
                if ((r2 = e2.charCodeAt(s2)) > 55295 && r2 < 57344) {
                  if (!i2) {
                    if (r2 > 56319) {
                      (t4 -= 3) > -1 && o2.push(239, 191, 189);
                      continue;
                    }
                    if (s2 + 1 === n2) {
                      (t4 -= 3) > -1 && o2.push(239, 191, 189);
                      continue;
                    }
                    i2 = r2;
                    continue;
                  }
                  if (r2 < 56320) {
                    (t4 -= 3) > -1 && o2.push(239, 191, 189), i2 = r2;
                    continue;
                  }
                  r2 = 65536 + (i2 - 55296 << 10 | r2 - 56320);
                } else
                  i2 && (t4 -= 3) > -1 && o2.push(239, 191, 189);
                if (i2 = null, r2 < 128) {
                  if ((t4 -= 1) < 0)
                    break;
                  o2.push(r2);
                } else if (r2 < 2048) {
                  if ((t4 -= 2) < 0)
                    break;
                  o2.push(r2 >> 6 | 192, 63 & r2 | 128);
                } else if (r2 < 65536) {
                  if ((t4 -= 3) < 0)
                    break;
                  o2.push(r2 >> 12 | 224, r2 >> 6 & 63 | 128, 63 & r2 | 128);
                } else {
                  if (!(r2 < 1114112))
                    throw new Error("Invalid code point");
                  if ((t4 -= 4) < 0)
                    break;
                  o2.push(r2 >> 18 | 240, r2 >> 12 & 63 | 128, r2 >> 6 & 63 | 128, 63 & r2 | 128);
                }
              }
              return o2;
            }
            function U(e2) {
              return t3.toByteArray(function(e3) {
                if ((e3 = (e3 = e3.split("=")[0]).trim().replace(L, "")).length < 2)
                  return "";
                for (; e3.length % 4 != 0; )
                  e3 += "=";
                return e3;
              }(e2));
            }
            function j(e2, t4, r2, n2) {
              for (var i2 = 0; i2 < n2 && !(i2 + r2 >= t4.length || i2 >= e2.length); ++i2)
                t4[i2 + r2] = e2[i2];
              return i2;
            }
            function q(e2, t4) {
              return e2 instanceof t4 || e2 != null && e2.constructor != null && e2.constructor.name != null && e2.constructor.name === t4.name;
            }
            function D(e2) {
              return e2 != e2;
            }
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {"base64-js": 10, buffer: 14, ieee754: 20}], 15: [function(e, t, r) {
        (function(n) {
          (function() {
            r.formatArgs = function(e2) {
              if (e2[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e2[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors)
                return;
              const r2 = "color: " + this.color;
              e2.splice(1, 0, r2, "color: inherit");
              let n2 = 0, i2 = 0;
              e2[0].replace(/%[a-zA-Z%]/g, (e3) => {
                e3 !== "%%" && e3 === "%c" && (i2 = ++n2);
              }), e2.splice(i2, 0, r2);
            }, r.save = function(e2) {
              try {
                e2 ? r.storage.setItem("debug", e2) : r.storage.removeItem("debug");
              } catch (e3) {
              }
            }, r.load = function() {
              let e2;
              try {
                e2 = r.storage.getItem("debug");
              } catch (e3) {
              }
              !e2 && n !== void 0 && "env" in n && (e2 = n.env.DEBUG);
              return e2;
            }, r.useColors = function() {
              if (typeof window != "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
                return true;
              if (typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
                return false;
              return typeof document != "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window != "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
            }, r.storage = function() {
              try {
                return localStorage;
              } catch (e2) {
              }
            }(), r.destroy = (() => {
              let e2 = false;
              return () => {
                e2 || (e2 = true, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
              };
            })(), r.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], r.log = console.debug || console.log || (() => {
            }), t.exports = e("./common")(r);
            const {formatters: i} = t.exports;
            i.j = function(e2) {
              try {
                return JSON.stringify(e2);
              } catch (e3) {
                return "[UnexpectedJSONParseError]: " + e3.message;
              }
            };
          }).call(this);
        }).call(this, e("_process"));
      }, {"./common": 16, _process: 32}], 16: [function(e, t, r) {
        t.exports = function(t2) {
          function r2(e2) {
            let t3, i2 = null;
            function o(...e3) {
              if (!o.enabled)
                return;
              const n2 = o, i3 = Number(new Date()), s = i3 - (t3 || i3);
              n2.diff = s, n2.prev = t3, n2.curr = i3, t3 = i3, e3[0] = r2.coerce(e3[0]), typeof e3[0] != "string" && e3.unshift("%O");
              let a = 0;
              e3[0] = e3[0].replace(/%([a-zA-Z%])/g, (t4, i4) => {
                if (t4 === "%%")
                  return "%";
                a++;
                const o2 = r2.formatters[i4];
                if (typeof o2 == "function") {
                  const r3 = e3[a];
                  t4 = o2.call(n2, r3), e3.splice(a, 1), a--;
                }
                return t4;
              }), r2.formatArgs.call(n2, e3), (n2.log || r2.log).apply(n2, e3);
            }
            return o.namespace = e2, o.useColors = r2.useColors(), o.color = r2.selectColor(e2), o.extend = n, o.destroy = r2.destroy, Object.defineProperty(o, "enabled", {enumerable: true, configurable: false, get: () => i2 === null ? r2.enabled(e2) : i2, set: (e3) => {
              i2 = e3;
            }}), typeof r2.init == "function" && r2.init(o), o;
          }
          function n(e2, t3) {
            const n2 = r2(this.namespace + (t3 === void 0 ? ":" : t3) + e2);
            return n2.log = this.log, n2;
          }
          function i(e2) {
            return e2.toString().substring(2, e2.toString().length - 2).replace(/\.\*\?$/, "*");
          }
          return r2.debug = r2, r2.default = r2, r2.coerce = function(e2) {
            return e2 instanceof Error ? e2.stack || e2.message : e2;
          }, r2.disable = function() {
            const e2 = [...r2.names.map(i), ...r2.skips.map(i).map((e3) => "-" + e3)].join(",");
            return r2.enable(""), e2;
          }, r2.enable = function(e2) {
            let t3;
            r2.save(e2), r2.names = [], r2.skips = [];
            const n2 = (typeof e2 == "string" ? e2 : "").split(/[\s,]+/), i2 = n2.length;
            for (t3 = 0; t3 < i2; t3++)
              n2[t3] && ((e2 = n2[t3].replace(/\*/g, ".*?"))[0] === "-" ? r2.skips.push(new RegExp("^" + e2.substr(1) + "$")) : r2.names.push(new RegExp("^" + e2 + "$")));
          }, r2.enabled = function(e2) {
            if (e2[e2.length - 1] === "*")
              return true;
            let t3, n2;
            for (t3 = 0, n2 = r2.skips.length; t3 < n2; t3++)
              if (r2.skips[t3].test(e2))
                return false;
            for (t3 = 0, n2 = r2.names.length; t3 < n2; t3++)
              if (r2.names[t3].test(e2))
                return true;
            return false;
          }, r2.humanize = e("ms"), r2.destroy = function() {
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
          }, Object.keys(t2).forEach((e2) => {
            r2[e2] = t2[e2];
          }), r2.names = [], r2.skips = [], r2.formatters = {}, r2.selectColor = function(e2) {
            let t3 = 0;
            for (let r3 = 0; r3 < e2.length; r3++)
              t3 = (t3 << 5) - t3 + e2.charCodeAt(r3), t3 |= 0;
            return r2.colors[Math.abs(t3) % r2.colors.length];
          }, r2.enable(r2.load()), r2;
        };
      }, {ms: 29}], 17: [function(e, t, r) {
        (function(r2, n) {
          (function() {
            var i = e("readable-stream"), o = e("end-of-stream"), s = e("inherits"), a = e("stream-shift"), c = n.from && n.from !== Uint8Array.from ? n.from([0]) : new n([0]), u = function(e2, t2) {
              e2._corked ? e2.once("uncork", t2) : t2();
            }, l = function(e2, t2) {
              return function(r3) {
                r3 ? function(e3, t3) {
                  e3._autoDestroy && e3.destroy(t3);
                }(e2, r3.message === "premature close" ? null : r3) : t2 && !e2._ended && e2.end();
              };
            }, f = function() {
            }, h = function(e2, t2, r3) {
              if (!(this instanceof h))
                return new h(e2, t2, r3);
              i.Duplex.call(this, r3), this._writable = null, this._readable = null, this._readable2 = null, this._autoDestroy = !r3 || r3.autoDestroy !== false, this._forwardDestroy = !r3 || r3.destroy !== false, this._forwardEnd = !r3 || r3.end !== false, this._corked = 1, this._ondrain = null, this._drained = false, this._forwarding = false, this._unwrite = null, this._unread = null, this._ended = false, this.destroyed = false, e2 && this.setWritable(e2), t2 && this.setReadable(t2);
            };
            s(h, i.Duplex), h.obj = function(e2, t2, r3) {
              return r3 || (r3 = {}), r3.objectMode = true, r3.highWaterMark = 16, new h(e2, t2, r3);
            }, h.prototype.cork = function() {
              ++this._corked == 1 && this.emit("cork");
            }, h.prototype.uncork = function() {
              this._corked && --this._corked == 0 && this.emit("uncork");
            }, h.prototype.setWritable = function(e2) {
              if (this._unwrite && this._unwrite(), this.destroyed)
                e2 && e2.destroy && e2.destroy();
              else if (e2 !== null && e2 !== false) {
                var t2 = this, n2 = o(e2, {writable: true, readable: false}, l(this, this._forwardEnd)), i2 = function() {
                  var e3 = t2._ondrain;
                  t2._ondrain = null, e3 && e3();
                };
                this._unwrite && r2.nextTick(i2), this._writable = e2, this._writable.on("drain", i2), this._unwrite = function() {
                  t2._writable.removeListener("drain", i2), n2();
                }, this.uncork();
              } else
                this.end();
            }, h.prototype.setReadable = function(e2) {
              if (this._unread && this._unread(), this.destroyed)
                e2 && e2.destroy && e2.destroy();
              else {
                if (e2 === null || e2 === false)
                  return this.push(null), void this.resume();
                var t2, r3 = this, n2 = o(e2, {writable: false, readable: true}, l(this)), s2 = function() {
                  r3._forward();
                }, a2 = function() {
                  r3.push(null);
                };
                this._drained = true, this._readable = e2, this._readable2 = e2._readableState ? e2 : (t2 = e2, new i.Readable({objectMode: true, highWaterMark: 16}).wrap(t2)), this._readable2.on("readable", s2), this._readable2.on("end", a2), this._unread = function() {
                  r3._readable2.removeListener("readable", s2), r3._readable2.removeListener("end", a2), n2();
                }, this._forward();
              }
            }, h.prototype._read = function() {
              this._drained = true, this._forward();
            }, h.prototype._forward = function() {
              if (!this._forwarding && this._readable2 && this._drained) {
                var e2;
                for (this._forwarding = true; this._drained && (e2 = a(this._readable2)) !== null; )
                  this.destroyed || (this._drained = this.push(e2));
                this._forwarding = false;
              }
            }, h.prototype.destroy = function(e2, t2) {
              if (t2 || (t2 = f), this.destroyed)
                return t2(null);
              this.destroyed = true;
              var n2 = this;
              r2.nextTick(function() {
                n2._destroy(e2), t2(null);
              });
            }, h.prototype._destroy = function(e2) {
              if (e2) {
                var t2 = this._ondrain;
                this._ondrain = null, t2 ? t2(e2) : this.emit("error", e2);
              }
              this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), this._writable && this._writable.destroy && this._writable.destroy()), this.emit("close");
            }, h.prototype._write = function(e2, t2, r3) {
              if (!this.destroyed)
                return this._corked ? u(this, this._write.bind(this, e2, t2, r3)) : e2 === c ? this._finish(r3) : this._writable ? void (this._writable.write(e2) === false ? this._ondrain = r3 : this.destroyed || r3()) : r3();
            }, h.prototype._finish = function(e2) {
              var t2 = this;
              this.emit("preend"), u(this, function() {
                var r3, n2;
                r3 = t2._forwardEnd && t2._writable, n2 = function() {
                  t2._writableState.prefinished === false && (t2._writableState.prefinished = true), t2.emit("prefinish"), u(t2, e2);
                }, r3 ? r3._writableState && r3._writableState.finished ? n2() : r3._writableState ? r3.end(n2) : (r3.end(), n2()) : n2();
              });
            }, h.prototype.end = function(e2, t2, r3) {
              return typeof e2 == "function" ? this.end(null, null, e2) : typeof t2 == "function" ? this.end(e2, null, t2) : (this._ended = true, e2 && this.write(e2), this._writableState.ending || this.write(c), i.Writable.prototype.end.call(this, r3));
            }, t.exports = h;
          }).call(this);
        }).call(this, e("_process"), e("buffer").Buffer);
      }, {_process: 32, buffer: 14, "end-of-stream": 18, inherits: 21, "readable-stream": 51, "stream-shift": 54}], 18: [function(e, t, r) {
        (function(r2) {
          (function() {
            var n = e("once"), i = function() {
            }, o = function(e2, t2, s) {
              if (typeof t2 == "function")
                return o(e2, null, t2);
              t2 || (t2 = {}), s = n(s || i);
              var a = e2._writableState, c = e2._readableState, u = t2.readable || t2.readable !== false && e2.readable, l = t2.writable || t2.writable !== false && e2.writable, f = false, h = function() {
                e2.writable || p();
              }, p = function() {
                l = false, u || s.call(e2);
              }, d = function() {
                u = false, l || s.call(e2);
              }, g = function(t3) {
                s.call(e2, t3 ? new Error("exited with error code: " + t3) : null);
              }, b = function(t3) {
                s.call(e2, t3);
              }, m = function() {
                r2.nextTick(y);
              }, y = function() {
                if (!f)
                  return (!u || c && c.ended && !c.destroyed) && (!l || a && a.ended && !a.destroyed) ? void 0 : s.call(e2, new Error("premature close"));
              }, _ = function() {
                e2.req.on("finish", p);
              };
              return !function(e3) {
                return e3.setHeader && typeof e3.abort == "function";
              }(e2) ? l && !a && (e2.on("end", h), e2.on("close", h)) : (e2.on("complete", p), e2.on("abort", m), e2.req ? _() : e2.on("request", _)), function(e3) {
                return e3.stdio && Array.isArray(e3.stdio) && e3.stdio.length === 3;
              }(e2) && e2.on("exit", g), e2.on("end", d), e2.on("finish", p), t2.error !== false && e2.on("error", b), e2.on("close", m), function() {
                f = true, e2.removeListener("complete", p), e2.removeListener("abort", m), e2.removeListener("request", _), e2.req && e2.req.removeListener("finish", p), e2.removeListener("end", h), e2.removeListener("close", h), e2.removeListener("finish", p), e2.removeListener("exit", g), e2.removeListener("end", d), e2.removeListener("error", b), e2.removeListener("close", m);
              };
            };
            t.exports = o;
          }).call(this);
        }).call(this, e("_process"));
      }, {_process: 32, once: 30}], 19: [function(e, t, r) {
        var n = Object.create || function(e2) {
          var t2 = function() {
          };
          return t2.prototype = e2, new t2();
        }, i = Object.keys || function(e2) {
          var t2 = [];
          for (var r2 in e2)
            Object.prototype.hasOwnProperty.call(e2, r2) && t2.push(r2);
          return r2;
        }, o = Function.prototype.bind || function(e2) {
          var t2 = this;
          return function() {
            return t2.apply(e2, arguments);
          };
        };
        function s() {
          this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = n(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
        }
        t.exports = s, s.EventEmitter = s, s.prototype._events = void 0, s.prototype._maxListeners = void 0;
        var a, c = 10;
        try {
          var u = {};
          Object.defineProperty && Object.defineProperty(u, "x", {value: 0}), a = u.x === 0;
        } catch (e2) {
          a = false;
        }
        function l(e2) {
          return e2._maxListeners === void 0 ? s.defaultMaxListeners : e2._maxListeners;
        }
        function f(e2, t2, r2, i2) {
          var o2, s2, a2;
          if (typeof r2 != "function")
            throw new TypeError('"listener" argument must be a function');
          if ((s2 = e2._events) ? (s2.newListener && (e2.emit("newListener", t2, r2.listener ? r2.listener : r2), s2 = e2._events), a2 = s2[t2]) : (s2 = e2._events = n(null), e2._eventsCount = 0), a2) {
            if (typeof a2 == "function" ? a2 = s2[t2] = i2 ? [r2, a2] : [a2, r2] : i2 ? a2.unshift(r2) : a2.push(r2), !a2.warned && (o2 = l(e2)) && o2 > 0 && a2.length > o2) {
              a2.warned = true;
              var c2 = new Error("Possible EventEmitter memory leak detected. " + a2.length + ' "' + String(t2) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
              c2.name = "MaxListenersExceededWarning", c2.emitter = e2, c2.type = t2, c2.count = a2.length, typeof console == "object" && console.warn && console.warn("%s: %s", c2.name, c2.message);
            }
          } else
            a2 = s2[t2] = r2, ++e2._eventsCount;
          return e2;
        }
        function h() {
          if (!this.fired)
            switch (this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length) {
              case 0:
                return this.listener.call(this.target);
              case 1:
                return this.listener.call(this.target, arguments[0]);
              case 2:
                return this.listener.call(this.target, arguments[0], arguments[1]);
              case 3:
                return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
              default:
                for (var e2 = new Array(arguments.length), t2 = 0; t2 < e2.length; ++t2)
                  e2[t2] = arguments[t2];
                this.listener.apply(this.target, e2);
            }
        }
        function p(e2, t2, r2) {
          var n2 = {fired: false, wrapFn: void 0, target: e2, type: t2, listener: r2}, i2 = o.call(h, n2);
          return i2.listener = r2, n2.wrapFn = i2, i2;
        }
        function d(e2, t2, r2) {
          var n2 = e2._events;
          if (!n2)
            return [];
          var i2 = n2[t2];
          return i2 ? typeof i2 == "function" ? r2 ? [i2.listener || i2] : [i2] : r2 ? function(e3) {
            for (var t3 = new Array(e3.length), r3 = 0; r3 < t3.length; ++r3)
              t3[r3] = e3[r3].listener || e3[r3];
            return t3;
          }(i2) : b(i2, i2.length) : [];
        }
        function g(e2) {
          var t2 = this._events;
          if (t2) {
            var r2 = t2[e2];
            if (typeof r2 == "function")
              return 1;
            if (r2)
              return r2.length;
          }
          return 0;
        }
        function b(e2, t2) {
          for (var r2 = new Array(t2), n2 = 0; n2 < t2; ++n2)
            r2[n2] = e2[n2];
          return r2;
        }
        a ? Object.defineProperty(s, "defaultMaxListeners", {enumerable: true, get: function() {
          return c;
        }, set: function(e2) {
          if (typeof e2 != "number" || e2 < 0 || e2 != e2)
            throw new TypeError('"defaultMaxListeners" must be a positive number');
          c = e2;
        }}) : s.defaultMaxListeners = c, s.prototype.setMaxListeners = function(e2) {
          if (typeof e2 != "number" || e2 < 0 || isNaN(e2))
            throw new TypeError('"n" argument must be a positive number');
          return this._maxListeners = e2, this;
        }, s.prototype.getMaxListeners = function() {
          return l(this);
        }, s.prototype.emit = function(e2) {
          var t2, r2, n2, i2, o2, s2, a2 = e2 === "error";
          if (s2 = this._events)
            a2 = a2 && s2.error == null;
          else if (!a2)
            return false;
          if (a2) {
            if (arguments.length > 1 && (t2 = arguments[1]), t2 instanceof Error)
              throw t2;
            var c2 = new Error('Unhandled "error" event. (' + t2 + ")");
            throw c2.context = t2, c2;
          }
          if (!(r2 = s2[e2]))
            return false;
          var u2 = typeof r2 == "function";
          switch (n2 = arguments.length) {
            case 1:
              !function(e3, t3, r3) {
                if (t3)
                  e3.call(r3);
                else
                  for (var n3 = e3.length, i3 = b(e3, n3), o3 = 0; o3 < n3; ++o3)
                    i3[o3].call(r3);
              }(r2, u2, this);
              break;
            case 2:
              !function(e3, t3, r3, n3) {
                if (t3)
                  e3.call(r3, n3);
                else
                  for (var i3 = e3.length, o3 = b(e3, i3), s3 = 0; s3 < i3; ++s3)
                    o3[s3].call(r3, n3);
              }(r2, u2, this, arguments[1]);
              break;
            case 3:
              !function(e3, t3, r3, n3, i3) {
                if (t3)
                  e3.call(r3, n3, i3);
                else
                  for (var o3 = e3.length, s3 = b(e3, o3), a3 = 0; a3 < o3; ++a3)
                    s3[a3].call(r3, n3, i3);
              }(r2, u2, this, arguments[1], arguments[2]);
              break;
            case 4:
              !function(e3, t3, r3, n3, i3, o3) {
                if (t3)
                  e3.call(r3, n3, i3, o3);
                else
                  for (var s3 = e3.length, a3 = b(e3, s3), c3 = 0; c3 < s3; ++c3)
                    a3[c3].call(r3, n3, i3, o3);
              }(r2, u2, this, arguments[1], arguments[2], arguments[3]);
              break;
            default:
              for (i2 = new Array(n2 - 1), o2 = 1; o2 < n2; o2++)
                i2[o2 - 1] = arguments[o2];
              !function(e3, t3, r3, n3) {
                if (t3)
                  e3.apply(r3, n3);
                else
                  for (var i3 = e3.length, o3 = b(e3, i3), s3 = 0; s3 < i3; ++s3)
                    o3[s3].apply(r3, n3);
              }(r2, u2, this, i2);
          }
          return true;
        }, s.prototype.addListener = function(e2, t2) {
          return f(this, e2, t2, false);
        }, s.prototype.on = s.prototype.addListener, s.prototype.prependListener = function(e2, t2) {
          return f(this, e2, t2, true);
        }, s.prototype.once = function(e2, t2) {
          if (typeof t2 != "function")
            throw new TypeError('"listener" argument must be a function');
          return this.on(e2, p(this, e2, t2)), this;
        }, s.prototype.prependOnceListener = function(e2, t2) {
          if (typeof t2 != "function")
            throw new TypeError('"listener" argument must be a function');
          return this.prependListener(e2, p(this, e2, t2)), this;
        }, s.prototype.removeListener = function(e2, t2) {
          var r2, i2, o2, s2, a2;
          if (typeof t2 != "function")
            throw new TypeError('"listener" argument must be a function');
          if (!(i2 = this._events))
            return this;
          if (!(r2 = i2[e2]))
            return this;
          if (r2 === t2 || r2.listener === t2)
            --this._eventsCount == 0 ? this._events = n(null) : (delete i2[e2], i2.removeListener && this.emit("removeListener", e2, r2.listener || t2));
          else if (typeof r2 != "function") {
            for (o2 = -1, s2 = r2.length - 1; s2 >= 0; s2--)
              if (r2[s2] === t2 || r2[s2].listener === t2) {
                a2 = r2[s2].listener, o2 = s2;
                break;
              }
            if (o2 < 0)
              return this;
            o2 === 0 ? r2.shift() : function(e3, t3) {
              for (var r3 = t3, n2 = r3 + 1, i3 = e3.length; n2 < i3; r3 += 1, n2 += 1)
                e3[r3] = e3[n2];
              e3.pop();
            }(r2, o2), r2.length === 1 && (i2[e2] = r2[0]), i2.removeListener && this.emit("removeListener", e2, a2 || t2);
          }
          return this;
        }, s.prototype.removeAllListeners = function(e2) {
          var t2, r2, o2;
          if (!(r2 = this._events))
            return this;
          if (!r2.removeListener)
            return arguments.length === 0 ? (this._events = n(null), this._eventsCount = 0) : r2[e2] && (--this._eventsCount == 0 ? this._events = n(null) : delete r2[e2]), this;
          if (arguments.length === 0) {
            var s2, a2 = i(r2);
            for (o2 = 0; o2 < a2.length; ++o2)
              (s2 = a2[o2]) !== "removeListener" && this.removeAllListeners(s2);
            return this.removeAllListeners("removeListener"), this._events = n(null), this._eventsCount = 0, this;
          }
          if (typeof (t2 = r2[e2]) == "function")
            this.removeListener(e2, t2);
          else if (t2)
            for (o2 = t2.length - 1; o2 >= 0; o2--)
              this.removeListener(e2, t2[o2]);
          return this;
        }, s.prototype.listeners = function(e2) {
          return d(this, e2, true);
        }, s.prototype.rawListeners = function(e2) {
          return d(this, e2, false);
        }, s.listenerCount = function(e2, t2) {
          return typeof e2.listenerCount == "function" ? e2.listenerCount(t2) : g.call(e2, t2);
        }, s.prototype.listenerCount = g, s.prototype.eventNames = function() {
          return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
        };
      }, {}], 20: [function(e, t, r) {
        r.read = function(e2, t2, r2, n, i) {
          var o, s, a = 8 * i - n - 1, c = (1 << a) - 1, u = c >> 1, l = -7, f = r2 ? i - 1 : 0, h = r2 ? -1 : 1, p = e2[t2 + f];
          for (f += h, o = p & (1 << -l) - 1, p >>= -l, l += a; l > 0; o = 256 * o + e2[t2 + f], f += h, l -= 8)
            ;
          for (s = o & (1 << -l) - 1, o >>= -l, l += n; l > 0; s = 256 * s + e2[t2 + f], f += h, l -= 8)
            ;
          if (o === 0)
            o = 1 - u;
          else {
            if (o === c)
              return s ? NaN : 1 / 0 * (p ? -1 : 1);
            s += Math.pow(2, n), o -= u;
          }
          return (p ? -1 : 1) * s * Math.pow(2, o - n);
        }, r.write = function(e2, t2, r2, n, i, o) {
          var s, a, c, u = 8 * o - i - 1, l = (1 << u) - 1, f = l >> 1, h = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : o - 1, d = n ? 1 : -1, g = t2 < 0 || t2 === 0 && 1 / t2 < 0 ? 1 : 0;
          for (t2 = Math.abs(t2), isNaN(t2) || t2 === 1 / 0 ? (a = isNaN(t2) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t2) / Math.LN2), t2 * (c = Math.pow(2, -s)) < 1 && (s--, c *= 2), (t2 += s + f >= 1 ? h / c : h * Math.pow(2, 1 - f)) * c >= 2 && (s++, c /= 2), s + f >= l ? (a = 0, s = l) : s + f >= 1 ? (a = (t2 * c - 1) * Math.pow(2, i), s += f) : (a = t2 * Math.pow(2, f - 1) * Math.pow(2, i), s = 0)); i >= 8; e2[r2 + p] = 255 & a, p += d, a /= 256, i -= 8)
            ;
          for (s = s << i | a, u += i; u > 0; e2[r2 + p] = 255 & s, p += d, s /= 256, u -= 8)
            ;
          e2[r2 + p - d] |= 128 * g;
        };
      }, {}], 21: [function(e, t, r) {
        typeof Object.create == "function" ? t.exports = function(e2, t2) {
          t2 && (e2.super_ = t2, e2.prototype = Object.create(t2.prototype, {constructor: {value: e2, enumerable: false, writable: true, configurable: true}}));
        } : t.exports = function(e2, t2) {
          if (t2) {
            e2.super_ = t2;
            var r2 = function() {
            };
            r2.prototype = t2.prototype, e2.prototype = new r2(), e2.prototype.constructor = e2;
          }
        };
      }, {}], 22: [function(e, t, r) {
        (function(e2) {
          (function() {
            const r2 = t.exports;
            r2.types = {0: "reserved", 1: "connect", 2: "connack", 3: "publish", 4: "puback", 5: "pubrec", 6: "pubrel", 7: "pubcomp", 8: "subscribe", 9: "suback", 10: "unsubscribe", 11: "unsuback", 12: "pingreq", 13: "pingresp", 14: "disconnect", 15: "auth"}, r2.codes = {};
            for (const e3 in r2.types) {
              const t2 = r2.types[e3];
              r2.codes[t2] = e3;
            }
            r2.CMD_SHIFT = 4, r2.CMD_MASK = 240, r2.DUP_MASK = 8, r2.QOS_MASK = 3, r2.QOS_SHIFT = 1, r2.RETAIN_MASK = 1, r2.VARBYTEINT_MASK = 127, r2.VARBYTEINT_FIN_MASK = 128, r2.VARBYTEINT_MAX = 268435455, r2.SESSIONPRESENT_MASK = 1, r2.SESSIONPRESENT_HEADER = e2.from([r2.SESSIONPRESENT_MASK]), r2.CONNACK_HEADER = e2.from([r2.codes.connack << r2.CMD_SHIFT]), r2.USERNAME_MASK = 128, r2.PASSWORD_MASK = 64, r2.WILL_RETAIN_MASK = 32, r2.WILL_QOS_MASK = 24, r2.WILL_QOS_SHIFT = 3, r2.WILL_FLAG_MASK = 4, r2.CLEAN_SESSION_MASK = 2, r2.CONNECT_HEADER = e2.from([r2.codes.connect << r2.CMD_SHIFT]), r2.properties = {sessionExpiryInterval: 17, willDelayInterval: 24, receiveMaximum: 33, maximumPacketSize: 39, topicAliasMaximum: 34, requestResponseInformation: 25, requestProblemInformation: 23, userProperties: 38, authenticationMethod: 21, authenticationData: 22, payloadFormatIndicator: 1, messageExpiryInterval: 2, contentType: 3, responseTopic: 8, correlationData: 9, maximumQoS: 36, retainAvailable: 37, assignedClientIdentifier: 18, reasonString: 31, wildcardSubscriptionAvailable: 40, subscriptionIdentifiersAvailable: 41, sharedSubscriptionAvailable: 42, serverKeepAlive: 19, responseInformation: 26, serverReference: 28, topicAlias: 35, subscriptionIdentifier: 11}, r2.propertiesCodes = {};
            for (const e3 in r2.properties) {
              const t2 = r2.properties[e3];
              r2.propertiesCodes[t2] = e3;
            }
            function n(t2) {
              return [0, 1, 2].map((n2) => [0, 1].map((i) => [0, 1].map((o) => {
                const s = e2.alloc(1);
                return s.writeUInt8(r2.codes[t2] << r2.CMD_SHIFT | (i ? r2.DUP_MASK : 0) | n2 << r2.QOS_SHIFT | o, 0, true), s;
              })));
            }
            r2.propertiesTypes = {sessionExpiryInterval: "int32", willDelayInterval: "int32", receiveMaximum: "int16", maximumPacketSize: "int32", topicAliasMaximum: "int16", requestResponseInformation: "byte", requestProblemInformation: "byte", userProperties: "pair", authenticationMethod: "string", authenticationData: "binary", payloadFormatIndicator: "byte", messageExpiryInterval: "int32", contentType: "string", responseTopic: "string", correlationData: "binary", maximumQoS: "int8", retainAvailable: "byte", assignedClientIdentifier: "string", reasonString: "string", wildcardSubscriptionAvailable: "byte", subscriptionIdentifiersAvailable: "byte", sharedSubscriptionAvailable: "byte", serverKeepAlive: "int16", responseInformation: "string", serverReference: "string", topicAlias: "int16", subscriptionIdentifier: "var"}, r2.PUBLISH_HEADER = n("publish"), r2.SUBSCRIBE_HEADER = n("subscribe"), r2.SUBSCRIBE_OPTIONS_QOS_MASK = 3, r2.SUBSCRIBE_OPTIONS_NL_MASK = 1, r2.SUBSCRIBE_OPTIONS_NL_SHIFT = 2, r2.SUBSCRIBE_OPTIONS_RAP_MASK = 1, r2.SUBSCRIBE_OPTIONS_RAP_SHIFT = 3, r2.SUBSCRIBE_OPTIONS_RH_MASK = 3, r2.SUBSCRIBE_OPTIONS_RH_SHIFT = 4, r2.SUBSCRIBE_OPTIONS_RH = [0, 16, 32], r2.SUBSCRIBE_OPTIONS_NL = 4, r2.SUBSCRIBE_OPTIONS_RAP = 8, r2.SUBSCRIBE_OPTIONS_QOS = [0, 1, 2], r2.UNSUBSCRIBE_HEADER = n("unsubscribe"), r2.ACKS = {unsuback: n("unsuback"), puback: n("puback"), pubcomp: n("pubcomp"), pubrel: n("pubrel"), pubrec: n("pubrec")}, r2.SUBACK_HEADER = e2.from([r2.codes.suback << r2.CMD_SHIFT]), r2.VERSION3 = e2.from([3]), r2.VERSION4 = e2.from([4]), r2.VERSION5 = e2.from([5]), r2.VERSION131 = e2.from([131]), r2.VERSION132 = e2.from([132]), r2.QOS = [0, 1, 2].map((t2) => e2.from([t2])), r2.EMPTY = {pingreq: e2.from([r2.codes.pingreq << 4, 0]), pingresp: e2.from([r2.codes.pingresp << 4, 0]), disconnect: e2.from([r2.codes.disconnect << 4, 0])};
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {buffer: 14}], 23: [function(e, t, r) {
        (function(r2) {
          (function() {
            const n = e("./writeToStream"), i = e("events");
            class o extends i {
              constructor() {
                super(), this._array = new Array(20), this._i = 0;
              }
              write(e2) {
                return this._array[this._i++] = e2, true;
              }
              concat() {
                let e2 = 0;
                const t2 = new Array(this._array.length), n2 = this._array;
                let i2, o2 = 0;
                for (i2 = 0; i2 < n2.length && n2[i2] !== void 0; i2++)
                  typeof n2[i2] != "string" ? t2[i2] = n2[i2].length : t2[i2] = r2.byteLength(n2[i2]), e2 += t2[i2];
                const s = r2.allocUnsafe(e2);
                for (i2 = 0; i2 < n2.length && n2[i2] !== void 0; i2++)
                  typeof n2[i2] != "string" ? (n2[i2].copy(s, o2), o2 += t2[i2]) : (s.write(n2[i2], o2), o2 += t2[i2]);
                return s;
              }
            }
            t.exports = function(e2, t2) {
              const r3 = new o();
              return n(e2, r3, t2), r3.concat();
            };
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {"./writeToStream": 28, buffer: 14, events: 19}], 24: [function(e, t, r) {
        r.parser = e("./parser").parser, r.generate = e("./generate"), r.writeToStream = e("./writeToStream");
      }, {"./generate": 23, "./parser": 27, "./writeToStream": 28}], 25: [function(e, t, r) {
        (function(e2) {
          (function() {
            const r2 = 65536, n = {}, i = e2.isBuffer(e2.from([1, 2]).subarray(0, 1));
            function o(t2) {
              const r3 = e2.allocUnsafe(2);
              return r3.writeUInt8(t2 >> 8, 0), r3.writeUInt8(255 & t2, 1), r3;
            }
            t.exports = {cache: n, generateCache: function() {
              for (let e3 = 0; e3 < r2; e3++)
                n[e3] = o(e3);
            }, generateNumber: o, genBufVariableByteInt: function(t2) {
              let r3 = 0, n2 = 0;
              const o2 = e2.allocUnsafe(4);
              do {
                r3 = t2 % 128 | 0, (t2 = t2 / 128 | 0) > 0 && (r3 |= 128), o2.writeUInt8(r3, n2++);
              } while (t2 > 0 && n2 < 4);
              return t2 > 0 && (n2 = 0), i ? o2.subarray(0, n2) : o2.slice(0, n2);
            }, generate4ByteBuffer: function(t2) {
              const r3 = e2.allocUnsafe(4);
              return r3.writeUInt32BE(t2, 0), r3;
            }};
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {buffer: 14}], 26: [function(e, t, r) {
        t.exports = class {
          constructor() {
            this.cmd = null, this.retain = false, this.qos = 0, this.dup = false, this.length = -1, this.topic = null, this.payload = null;
          }
        };
      }, {}], 27: [function(e, t, r) {
        const n = e("bl"), i = e("events"), o = e("./packet"), s = e("./constants"), a = e("debug")("mqtt-packet:parser");
        class c extends i {
          constructor() {
            super(), this.parser = this.constructor.parser;
          }
          static parser(e2) {
            return this instanceof c ? (this.settings = e2 || {}, this._states = ["_parseHeader", "_parseLength", "_parsePayload", "_newPacket"], this._resetState(), this) : new c().parser(e2);
          }
          _resetState() {
            a("_resetState: resetting packet, error, _list, and _stateCounter"), this.packet = new o(), this.error = null, this._list = n(), this._stateCounter = 0;
          }
          parse(e2) {
            for (this.error && this._resetState(), this._list.append(e2), a("parse: current state: %s", this._states[this._stateCounter]); (this.packet.length !== -1 || this._list.length > 0) && this[this._states[this._stateCounter]]() && !this.error; )
              this._stateCounter++, a("parse: state complete. _stateCounter is now: %d", this._stateCounter), a("parse: packet.length: %d, buffer list length: %d", this.packet.length, this._list.length), this._stateCounter >= this._states.length && (this._stateCounter = 0);
            return a("parse: exited while loop. packet: %d, buffer list length: %d", this.packet.length, this._list.length), this._list.length;
          }
          _parseHeader() {
            const e2 = this._list.readUInt8(0);
            return this.packet.cmd = s.types[e2 >> s.CMD_SHIFT], this.packet.retain = (e2 & s.RETAIN_MASK) != 0, this.packet.qos = e2 >> s.QOS_SHIFT & s.QOS_MASK, this.packet.dup = (e2 & s.DUP_MASK) != 0, a("_parseHeader: packet: %o", this.packet), this._list.consume(1), true;
          }
          _parseLength() {
            const e2 = this._parseVarByteNum(true);
            return e2 && (this.packet.length = e2.value, this._list.consume(e2.bytes)), a("_parseLength %d", e2.value), !!e2;
          }
          _parsePayload() {
            a("_parsePayload: payload %O", this._list);
            let e2 = false;
            if (this.packet.length === 0 || this._list.length >= this.packet.length) {
              switch (this._pos = 0, this.packet.cmd) {
                case "connect":
                  this._parseConnect();
                  break;
                case "connack":
                  this._parseConnack();
                  break;
                case "publish":
                  this._parsePublish();
                  break;
                case "puback":
                case "pubrec":
                case "pubrel":
                case "pubcomp":
                  this._parseConfirmation();
                  break;
                case "subscribe":
                  this._parseSubscribe();
                  break;
                case "suback":
                  this._parseSuback();
                  break;
                case "unsubscribe":
                  this._parseUnsubscribe();
                  break;
                case "unsuback":
                  this._parseUnsuback();
                  break;
                case "pingreq":
                case "pingresp":
                  break;
                case "disconnect":
                  this._parseDisconnect();
                  break;
                case "auth":
                  this._parseAuth();
                  break;
                default:
                  this._emitError(new Error("Not supported"));
              }
              e2 = true;
            }
            return a("_parsePayload complete result: %s", e2), e2;
          }
          _parseConnect() {
            let e2, t2, r2, n2;
            a("_parseConnect");
            const i2 = {}, o2 = this.packet, c2 = this._parseString();
            if (c2 === null)
              return this._emitError(new Error("Cannot parse protocolId"));
            if (c2 !== "MQTT" && c2 !== "MQIsdp")
              return this._emitError(new Error("Invalid protocolId"));
            if (o2.protocolId = c2, this._pos >= this._list.length)
              return this._emitError(new Error("Packet too short"));
            if (o2.protocolVersion = this._list.readUInt8(this._pos), o2.protocolVersion >= 128 && (o2.bridgeMode = true, o2.protocolVersion = o2.protocolVersion - 128), o2.protocolVersion !== 3 && o2.protocolVersion !== 4 && o2.protocolVersion !== 5)
              return this._emitError(new Error("Invalid protocol version"));
            if (this._pos++, this._pos >= this._list.length)
              return this._emitError(new Error("Packet too short"));
            if (i2.username = this._list.readUInt8(this._pos) & s.USERNAME_MASK, i2.password = this._list.readUInt8(this._pos) & s.PASSWORD_MASK, i2.will = this._list.readUInt8(this._pos) & s.WILL_FLAG_MASK, i2.will && (o2.will = {}, o2.will.retain = (this._list.readUInt8(this._pos) & s.WILL_RETAIN_MASK) != 0, o2.will.qos = (this._list.readUInt8(this._pos) & s.WILL_QOS_MASK) >> s.WILL_QOS_SHIFT), o2.clean = (this._list.readUInt8(this._pos) & s.CLEAN_SESSION_MASK) != 0, this._pos++, o2.keepalive = this._parseNum(), o2.keepalive === -1)
              return this._emitError(new Error("Packet too short"));
            if (o2.protocolVersion === 5) {
              const e3 = this._parseProperties();
              Object.getOwnPropertyNames(e3).length && (o2.properties = e3);
            }
            const u = this._parseString();
            if (u === null)
              return this._emitError(new Error("Packet too short"));
            if (o2.clientId = u, a("_parseConnect: packet.clientId: %s", o2.clientId), i2.will) {
              if (o2.protocolVersion === 5) {
                const e3 = this._parseProperties();
                Object.getOwnPropertyNames(e3).length && (o2.will.properties = e3);
              }
              if ((e2 = this._parseString()) === null)
                return this._emitError(new Error("Cannot parse will topic"));
              if (o2.will.topic = e2, a("_parseConnect: packet.will.topic: %s", o2.will.topic), (t2 = this._parseBuffer()) === null)
                return this._emitError(new Error("Cannot parse will payload"));
              o2.will.payload = t2, a("_parseConnect: packet.will.paylaod: %s", o2.will.payload);
            }
            if (i2.username) {
              if ((n2 = this._parseString()) === null)
                return this._emitError(new Error("Cannot parse username"));
              o2.username = n2, a("_parseConnect: packet.username: %s", o2.username);
            }
            if (i2.password) {
              if ((r2 = this._parseBuffer()) === null)
                return this._emitError(new Error("Cannot parse password"));
              o2.password = r2;
            }
            return this.settings = o2, a("_parseConnect: complete"), o2;
          }
          _parseConnack() {
            a("_parseConnack");
            const e2 = this.packet;
            if (this._list.length < 1)
              return null;
            if (e2.sessionPresent = !!(this._list.readUInt8(this._pos++) & s.SESSIONPRESENT_MASK), this.settings.protocolVersion === 5)
              this._list.length >= 2 ? e2.reasonCode = this._list.readUInt8(this._pos++) : e2.reasonCode = 0;
            else {
              if (this._list.length < 2)
                return null;
              e2.returnCode = this._list.readUInt8(this._pos++);
            }
            if (e2.returnCode === -1 || e2.reasonCode === -1)
              return this._emitError(new Error("Cannot parse return code"));
            if (this.settings.protocolVersion === 5) {
              const t2 = this._parseProperties();
              Object.getOwnPropertyNames(t2).length && (e2.properties = t2);
            }
            a("_parseConnack: complete");
          }
          _parsePublish() {
            a("_parsePublish");
            const e2 = this.packet;
            if (e2.topic = this._parseString(), e2.topic === null)
              return this._emitError(new Error("Cannot parse topic"));
            if (!(e2.qos > 0) || this._parseMessageId()) {
              if (this.settings.protocolVersion === 5) {
                const t2 = this._parseProperties();
                Object.getOwnPropertyNames(t2).length && (e2.properties = t2);
              }
              e2.payload = this._list.slice(this._pos, e2.length), a("_parsePublish: payload from buffer list: %o", e2.payload);
            }
          }
          _parseSubscribe() {
            a("_parseSubscribe");
            const e2 = this.packet;
            let t2, r2, n2, i2, o2, c2, u;
            if (e2.qos !== 1)
              return this._emitError(new Error("Wrong subscribe header"));
            if (e2.subscriptions = [], this._parseMessageId()) {
              if (this.settings.protocolVersion === 5) {
                const t3 = this._parseProperties();
                Object.getOwnPropertyNames(t3).length && (e2.properties = t3);
              }
              for (; this._pos < e2.length; ) {
                if ((t2 = this._parseString()) === null)
                  return this._emitError(new Error("Cannot parse topic"));
                if (this._pos >= e2.length)
                  return this._emitError(new Error("Malformed Subscribe Payload"));
                n2 = (r2 = this._parseByte()) & s.SUBSCRIBE_OPTIONS_QOS_MASK, c2 = (r2 >> s.SUBSCRIBE_OPTIONS_NL_SHIFT & s.SUBSCRIBE_OPTIONS_NL_MASK) != 0, o2 = (r2 >> s.SUBSCRIBE_OPTIONS_RAP_SHIFT & s.SUBSCRIBE_OPTIONS_RAP_MASK) != 0, i2 = r2 >> s.SUBSCRIBE_OPTIONS_RH_SHIFT & s.SUBSCRIBE_OPTIONS_RH_MASK, u = {topic: t2, qos: n2}, this.settings.protocolVersion === 5 ? (u.nl = c2, u.rap = o2, u.rh = i2) : this.settings.bridgeMode && (u.rh = 0, u.rap = true, u.nl = true), a("_parseSubscribe: push subscription `%s` to subscription", u), e2.subscriptions.push(u);
              }
            }
          }
          _parseSuback() {
            a("_parseSuback");
            const e2 = this.packet;
            if (this.packet.granted = [], this._parseMessageId()) {
              if (this.settings.protocolVersion === 5) {
                const t2 = this._parseProperties();
                Object.getOwnPropertyNames(t2).length && (e2.properties = t2);
              }
              for (; this._pos < this.packet.length; )
                this.packet.granted.push(this._list.readUInt8(this._pos++));
            }
          }
          _parseUnsubscribe() {
            a("_parseUnsubscribe");
            const e2 = this.packet;
            if (e2.unsubscriptions = [], this._parseMessageId()) {
              if (this.settings.protocolVersion === 5) {
                const t2 = this._parseProperties();
                Object.getOwnPropertyNames(t2).length && (e2.properties = t2);
              }
              for (; this._pos < e2.length; ) {
                const t2 = this._parseString();
                if (t2 === null)
                  return this._emitError(new Error("Cannot parse topic"));
                a("_parseUnsubscribe: push topic `%s` to unsubscriptions", t2), e2.unsubscriptions.push(t2);
              }
            }
          }
          _parseUnsuback() {
            a("_parseUnsuback");
            const e2 = this.packet;
            if (!this._parseMessageId())
              return this._emitError(new Error("Cannot parse messageId"));
            if (this.settings.protocolVersion === 5) {
              const t2 = this._parseProperties();
              for (Object.getOwnPropertyNames(t2).length && (e2.properties = t2), e2.granted = []; this._pos < this.packet.length; )
                this.packet.granted.push(this._list.readUInt8(this._pos++));
            }
          }
          _parseConfirmation() {
            a("_parseConfirmation: packet.cmd: `%s`", this.packet.cmd);
            const e2 = this.packet;
            if (this._parseMessageId(), this.settings.protocolVersion === 5 && (e2.length > 2 ? (e2.reasonCode = this._parseByte(), a("_parseConfirmation: packet.reasonCode `%d`", e2.reasonCode)) : e2.reasonCode = 0, e2.length > 3)) {
              const t2 = this._parseProperties();
              Object.getOwnPropertyNames(t2).length && (e2.properties = t2);
            }
            return true;
          }
          _parseDisconnect() {
            const e2 = this.packet;
            if (a("_parseDisconnect"), this.settings.protocolVersion === 5) {
              this._list.length > 0 ? e2.reasonCode = this._parseByte() : e2.reasonCode = 0;
              const t2 = this._parseProperties();
              Object.getOwnPropertyNames(t2).length && (e2.properties = t2);
            }
            return a("_parseDisconnect result: true"), true;
          }
          _parseAuth() {
            a("_parseAuth");
            const e2 = this.packet;
            if (this.settings.protocolVersion !== 5)
              return this._emitError(new Error("Not supported auth packet for this version MQTT"));
            e2.reasonCode = this._parseByte();
            const t2 = this._parseProperties();
            return Object.getOwnPropertyNames(t2).length && (e2.properties = t2), a("_parseAuth: result: true"), true;
          }
          _parseMessageId() {
            const e2 = this.packet;
            return e2.messageId = this._parseNum(), e2.messageId === null ? (this._emitError(new Error("Cannot parse messageId")), false) : (a("_parseMessageId: packet.messageId %d", e2.messageId), true);
          }
          _parseString(e2) {
            const t2 = this._parseNum(), r2 = t2 + this._pos;
            if (t2 === -1 || r2 > this._list.length || r2 > this.packet.length)
              return null;
            const n2 = this._list.toString("utf8", this._pos, r2);
            return this._pos += t2, a("_parseString: result: %s", n2), n2;
          }
          _parseStringPair() {
            return a("_parseStringPair"), {name: this._parseString(), value: this._parseString()};
          }
          _parseBuffer() {
            const e2 = this._parseNum(), t2 = e2 + this._pos;
            if (e2 === -1 || t2 > this._list.length || t2 > this.packet.length)
              return null;
            const r2 = this._list.slice(this._pos, t2);
            return this._pos += e2, a("_parseBuffer: result: %o", r2), r2;
          }
          _parseNum() {
            if (this._list.length - this._pos < 2)
              return -1;
            const e2 = this._list.readUInt16BE(this._pos);
            return this._pos += 2, a("_parseNum: result: %s", e2), e2;
          }
          _parse4ByteNum() {
            if (this._list.length - this._pos < 4)
              return -1;
            const e2 = this._list.readUInt32BE(this._pos);
            return this._pos += 4, a("_parse4ByteNum: result: %s", e2), e2;
          }
          _parseVarByteNum(e2) {
            a("_parseVarByteNum");
            let t2, r2 = 0, n2 = 1, i2 = 0, o2 = false;
            const c2 = this._pos ? this._pos : 0;
            for (; r2 < 4 && c2 + r2 < this._list.length; ) {
              if (i2 += n2 * ((t2 = this._list.readUInt8(c2 + r2++)) & s.VARBYTEINT_MASK), n2 *= 128, (t2 & s.VARBYTEINT_FIN_MASK) == 0) {
                o2 = true;
                break;
              }
              if (this._list.length <= r2)
                break;
            }
            return !o2 && r2 === 4 && this._list.length >= r2 && this._emitError(new Error("Invalid variable byte integer")), c2 && (this._pos += r2), a("_parseVarByteNum: result: %o", o2 = !!o2 && (e2 ? {bytes: r2, value: i2} : i2)), o2;
          }
          _parseByte() {
            let e2;
            return this._pos < this._list.length && (e2 = this._list.readUInt8(this._pos), this._pos++), a("_parseByte: result: %o", e2), e2;
          }
          _parseByType(e2) {
            switch (a("_parseByType: type: %s", e2), e2) {
              case "byte":
                return this._parseByte() !== 0;
              case "int8":
                return this._parseByte();
              case "int16":
                return this._parseNum();
              case "int32":
                return this._parse4ByteNum();
              case "var":
                return this._parseVarByteNum();
              case "string":
                return this._parseString();
              case "pair":
                return this._parseStringPair();
              case "binary":
                return this._parseBuffer();
            }
          }
          _parseProperties() {
            a("_parseProperties");
            const e2 = this._parseVarByteNum(), t2 = this._pos + e2, r2 = {};
            for (; this._pos < t2; ) {
              const e3 = this._parseByte();
              if (!e3)
                return this._emitError(new Error("Cannot parse property code type")), false;
              const t3 = s.propertiesCodes[e3];
              if (!t3)
                return this._emitError(new Error("Unknown property")), false;
              if (t3 !== "userProperties")
                r2[t3] ? Array.isArray(r2[t3]) ? r2[t3].push(this._parseByType(s.propertiesTypes[t3])) : (r2[t3] = [r2[t3]], r2[t3].push(this._parseByType(s.propertiesTypes[t3]))) : r2[t3] = this._parseByType(s.propertiesTypes[t3]);
              else {
                r2[t3] || (r2[t3] = Object.create(null));
                const e4 = this._parseByType(s.propertiesTypes[t3]);
                if (r2[t3][e4.name])
                  if (Array.isArray(r2[t3][e4.name]))
                    r2[t3][e4.name].push(e4.value);
                  else {
                    const n2 = r2[t3][e4.name];
                    r2[t3][e4.name] = [n2], r2[t3][e4.name].push(e4.value);
                  }
                else
                  r2[t3][e4.name] = e4.value;
              }
            }
            return r2;
          }
          _newPacket() {
            return a("_newPacket"), this.packet && (this._list.consume(this.packet.length), a("_newPacket: parser emit packet: packet.cmd: %s, packet.payload: %s, packet.length: %d", this.packet.cmd, this.packet.payload, this.packet.length), this.emit("packet", this.packet)), a("_newPacket: new packet"), this.packet = new o(), this._pos = 0, true;
          }
          _emitError(e2) {
            a("_emitError"), this.error = e2, this.emit("error", e2);
          }
        }
        t.exports = c;
      }, {"./constants": 22, "./packet": 26, bl: 12, debug: 15, events: 19}], 28: [function(e, t, r) {
        (function(r2) {
          (function() {
            const n = e("./constants"), i = r2.allocUnsafe(0), o = r2.from([0]), s = e("./numbers"), a = e("process-nextick-args").nextTick, c = e("debug")("mqtt-packet:writeToStream"), u = s.cache, l = s.generateNumber, f = s.generateCache, h = s.genBufVariableByteInt, p = s.generate4ByteBuffer;
            let d = S, g = true;
            function b(e2, t2, s2) {
              switch (c("generate called"), t2.cork && (t2.cork(), a(m, t2)), g && (g = false, f()), c("generate: packet.cmd: %s", e2.cmd), e2.cmd) {
                case "connect":
                  return function(e3, t3, i2) {
                    const o2 = e3 || {}, s3 = o2.protocolId || "MQTT";
                    let a2 = o2.protocolVersion || 4;
                    const c2 = o2.will;
                    let u2 = o2.clean;
                    const l2 = o2.keepalive || 0, f2 = o2.clientId || "", h2 = o2.username, p2 = o2.password, g2 = o2.properties;
                    u2 === void 0 && (u2 = true);
                    let b2 = 0;
                    if (!s3 || typeof s3 != "string" && !r2.isBuffer(s3))
                      return t3.emit("error", new Error("Invalid protocolId")), false;
                    b2 += s3.length + 2;
                    if (a2 !== 3 && a2 !== 4 && a2 !== 5)
                      return t3.emit("error", new Error("Invalid protocol version")), false;
                    b2 += 1;
                    if ((typeof f2 == "string" || r2.isBuffer(f2)) && (f2 || a2 >= 4) && (f2 || u2))
                      b2 += r2.byteLength(f2) + 2;
                    else {
                      if (a2 < 4)
                        return t3.emit("error", new Error("clientId must be supplied before 3.1.1")), false;
                      if (1 * u2 == 0)
                        return t3.emit("error", new Error("clientId must be given if cleanSession set to 0")), false;
                    }
                    if (typeof l2 != "number" || l2 < 0 || l2 > 65535 || l2 % 1 != 0)
                      return t3.emit("error", new Error("Invalid keepalive")), false;
                    b2 += 2;
                    if (b2 += 1, a2 === 5) {
                      var m2 = I(t3, g2);
                      if (!m2)
                        return false;
                      b2 += m2.length;
                    }
                    if (c2) {
                      if (typeof c2 != "object")
                        return t3.emit("error", new Error("Invalid will")), false;
                      if (!c2.topic || typeof c2.topic != "string")
                        return t3.emit("error", new Error("Invalid will topic")), false;
                      if (b2 += r2.byteLength(c2.topic) + 2, b2 += 2, c2.payload) {
                        if (!(c2.payload.length >= 0))
                          return t3.emit("error", new Error("Invalid will payload")), false;
                        typeof c2.payload == "string" ? b2 += r2.byteLength(c2.payload) : b2 += c2.payload.length;
                      }
                      var y2 = {};
                      if (a2 === 5) {
                        if (!(y2 = I(t3, c2.properties)))
                          return false;
                        b2 += y2.length;
                      }
                    }
                    let v2 = false;
                    if (h2 != null) {
                      if (!O(h2))
                        return t3.emit("error", new Error("Invalid username")), false;
                      v2 = true, b2 += r2.byteLength(h2) + 2;
                    }
                    if (p2 != null) {
                      if (!v2)
                        return t3.emit("error", new Error("Username is required to use password")), false;
                      if (!O(p2))
                        return t3.emit("error", new Error("Invalid password")), false;
                      b2 += R(p2) + 2;
                    }
                    t3.write(n.CONNECT_HEADER), _(t3, b2), k(t3, s3), o2.bridgeMode && (a2 += 128);
                    t3.write(a2 === 131 ? n.VERSION131 : a2 === 132 ? n.VERSION132 : a2 === 4 ? n.VERSION4 : a2 === 5 ? n.VERSION5 : n.VERSION3);
                    let S2 = 0;
                    S2 |= h2 != null ? n.USERNAME_MASK : 0, S2 |= p2 != null ? n.PASSWORD_MASK : 0, S2 |= c2 && c2.retain ? n.WILL_RETAIN_MASK : 0, S2 |= c2 && c2.qos ? c2.qos << n.WILL_QOS_SHIFT : 0, S2 |= c2 ? n.WILL_FLAG_MASK : 0, S2 |= u2 ? n.CLEAN_SESSION_MASK : 0, t3.write(r2.from([S2])), d(t3, l2), a2 === 5 && m2.write();
                    k(t3, f2), c2 && (a2 === 5 && y2.write(), w(t3, c2.topic), k(t3, c2.payload));
                    h2 != null && k(t3, h2);
                    p2 != null && k(t3, p2);
                    return true;
                  }(e2, t2);
                case "connack":
                  return function(e3, t3, i2) {
                    const s3 = i2 ? i2.protocolVersion : 4, a2 = e3 || {}, c2 = s3 === 5 ? a2.reasonCode : a2.returnCode, u2 = a2.properties;
                    let l2 = 2;
                    if (typeof c2 != "number")
                      return t3.emit("error", new Error("Invalid return code")), false;
                    let f2 = null;
                    if (s3 === 5) {
                      if (!(f2 = I(t3, u2)))
                        return false;
                      l2 += f2.length;
                    }
                    t3.write(n.CONNACK_HEADER), _(t3, l2), t3.write(a2.sessionPresent ? n.SESSIONPRESENT_HEADER : o), t3.write(r2.from([c2])), f2 != null && f2.write();
                    return true;
                  }(e2, t2, s2);
                case "publish":
                  return function(e3, t3, o2) {
                    c("publish: packet: %o", e3);
                    const s3 = o2 ? o2.protocolVersion : 4, a2 = e3 || {}, u2 = a2.qos || 0, l2 = a2.retain ? n.RETAIN_MASK : 0, f2 = a2.topic, h2 = a2.payload || i, p2 = a2.messageId, g2 = a2.properties;
                    let b2 = 0;
                    if (typeof f2 == "string")
                      b2 += r2.byteLength(f2) + 2;
                    else {
                      if (!r2.isBuffer(f2))
                        return t3.emit("error", new Error("Invalid topic")), false;
                      b2 += f2.length + 2;
                    }
                    r2.isBuffer(h2) ? b2 += h2.length : b2 += r2.byteLength(h2);
                    if (u2 && typeof p2 != "number")
                      return t3.emit("error", new Error("Invalid messageId")), false;
                    u2 && (b2 += 2);
                    let m2 = null;
                    if (s3 === 5) {
                      if (!(m2 = I(t3, g2)))
                        return false;
                      b2 += m2.length;
                    }
                    t3.write(n.PUBLISH_HEADER[u2][a2.dup ? 1 : 0][l2 ? 1 : 0]), _(t3, b2), d(t3, R(f2)), t3.write(f2), u2 > 0 && d(t3, p2);
                    m2 != null && m2.write();
                    return c("publish: payload: %o", h2), t3.write(h2);
                  }(e2, t2, s2);
                case "puback":
                case "pubrec":
                case "pubrel":
                case "pubcomp":
                  return function(e3, t3, i2) {
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.cmd || "puback", c2 = s3.messageId, u2 = s3.dup && a2 === "pubrel" ? n.DUP_MASK : 0;
                    let l2 = 0;
                    const f2 = s3.reasonCode, h2 = s3.properties;
                    let p2 = o2 === 5 ? 3 : 2;
                    a2 === "pubrel" && (l2 = 1);
                    if (typeof c2 != "number")
                      return t3.emit("error", new Error("Invalid messageId")), false;
                    let g2 = null;
                    if (o2 === 5 && typeof h2 == "object") {
                      if (!(g2 = C(t3, h2, i2, p2)))
                        return false;
                      p2 += g2.length;
                    }
                    t3.write(n.ACKS[a2][l2][u2][0]), _(t3, p2), d(t3, c2), o2 === 5 && t3.write(r2.from([f2]));
                    g2 !== null && g2.write();
                    return true;
                  }(e2, t2, s2);
                case "subscribe":
                  return function(e3, t3, i2) {
                    c("subscribe: packet: ");
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.dup ? n.DUP_MASK : 0, u2 = s3.messageId, l2 = s3.subscriptions, f2 = s3.properties;
                    let h2 = 0;
                    if (typeof u2 != "number")
                      return t3.emit("error", new Error("Invalid messageId")), false;
                    h2 += 2;
                    let p2 = null;
                    if (o2 === 5) {
                      if (!(p2 = I(t3, f2)))
                        return false;
                      h2 += p2.length;
                    }
                    if (typeof l2 != "object" || !l2.length)
                      return t3.emit("error", new Error("Invalid subscriptions")), false;
                    for (let e4 = 0; e4 < l2.length; e4 += 1) {
                      const n2 = l2[e4].topic, i3 = l2[e4].qos;
                      if (typeof n2 != "string")
                        return t3.emit("error", new Error("Invalid subscriptions - invalid topic")), false;
                      if (typeof i3 != "number")
                        return t3.emit("error", new Error("Invalid subscriptions - invalid qos")), false;
                      if (o2 === 5) {
                        const r3 = l2[e4].nl || false;
                        if (typeof r3 != "boolean")
                          return t3.emit("error", new Error("Invalid subscriptions - invalid No Local")), false;
                        const n3 = l2[e4].rap || false;
                        if (typeof n3 != "boolean")
                          return t3.emit("error", new Error("Invalid subscriptions - invalid Retain as Published")), false;
                        const i4 = l2[e4].rh || 0;
                        if (typeof i4 != "number" || i4 > 2)
                          return t3.emit("error", new Error("Invalid subscriptions - invalid Retain Handling")), false;
                      }
                      h2 += r2.byteLength(n2) + 2 + 1;
                    }
                    c("subscribe: writing to stream: %o", n.SUBSCRIBE_HEADER), t3.write(n.SUBSCRIBE_HEADER[1][a2 ? 1 : 0][0]), _(t3, h2), d(t3, u2), p2 !== null && p2.write();
                    let g2 = true;
                    for (const e4 of l2) {
                      const i3 = e4.topic, s4 = e4.qos, a3 = +e4.nl, c2 = +e4.rap, u3 = e4.rh;
                      let l3;
                      w(t3, i3), l3 = n.SUBSCRIBE_OPTIONS_QOS[s4], o2 === 5 && (l3 |= a3 ? n.SUBSCRIBE_OPTIONS_NL : 0, l3 |= c2 ? n.SUBSCRIBE_OPTIONS_RAP : 0, l3 |= u3 ? n.SUBSCRIBE_OPTIONS_RH[u3] : 0), g2 = t3.write(r2.from([l3]));
                    }
                    return g2;
                  }(e2, t2, s2);
                case "suback":
                  return function(e3, t3, i2) {
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.messageId, c2 = s3.granted, u2 = s3.properties;
                    let l2 = 0;
                    if (typeof a2 != "number")
                      return t3.emit("error", new Error("Invalid messageId")), false;
                    l2 += 2;
                    if (typeof c2 != "object" || !c2.length)
                      return t3.emit("error", new Error("Invalid qos vector")), false;
                    for (let e4 = 0; e4 < c2.length; e4 += 1) {
                      if (typeof c2[e4] != "number")
                        return t3.emit("error", new Error("Invalid qos vector")), false;
                      l2 += 1;
                    }
                    let f2 = null;
                    if (o2 === 5) {
                      if (!(f2 = C(t3, u2, i2, l2)))
                        return false;
                      l2 += f2.length;
                    }
                    t3.write(n.SUBACK_HEADER), _(t3, l2), d(t3, a2), f2 !== null && f2.write();
                    return t3.write(r2.from(c2));
                  }(e2, t2, s2);
                case "unsubscribe":
                  return function(e3, t3, i2) {
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.messageId, c2 = s3.dup ? n.DUP_MASK : 0, u2 = s3.unsubscriptions, l2 = s3.properties;
                    let f2 = 0;
                    if (typeof a2 != "number")
                      return t3.emit("error", new Error("Invalid messageId")), false;
                    f2 += 2;
                    if (typeof u2 != "object" || !u2.length)
                      return t3.emit("error", new Error("Invalid unsubscriptions")), false;
                    for (let e4 = 0; e4 < u2.length; e4 += 1) {
                      if (typeof u2[e4] != "string")
                        return t3.emit("error", new Error("Invalid unsubscriptions")), false;
                      f2 += r2.byteLength(u2[e4]) + 2;
                    }
                    let h2 = null;
                    if (o2 === 5) {
                      if (!(h2 = I(t3, l2)))
                        return false;
                      f2 += h2.length;
                    }
                    t3.write(n.UNSUBSCRIBE_HEADER[1][c2 ? 1 : 0][0]), _(t3, f2), d(t3, a2), h2 !== null && h2.write();
                    let p2 = true;
                    for (let e4 = 0; e4 < u2.length; e4++)
                      p2 = w(t3, u2[e4]);
                    return p2;
                  }(e2, t2, s2);
                case "unsuback":
                  return function(e3, t3, i2) {
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.messageId, c2 = s3.dup ? n.DUP_MASK : 0, u2 = s3.granted, l2 = s3.properties, f2 = s3.cmd;
                    let h2 = 2;
                    if (typeof a2 != "number")
                      return t3.emit("error", new Error("Invalid messageId")), false;
                    if (o2 === 5) {
                      if (typeof u2 != "object" || !u2.length)
                        return t3.emit("error", new Error("Invalid qos vector")), false;
                      for (let e4 = 0; e4 < u2.length; e4 += 1) {
                        if (typeof u2[e4] != "number")
                          return t3.emit("error", new Error("Invalid qos vector")), false;
                        h2 += 1;
                      }
                    }
                    let p2 = null;
                    if (o2 === 5) {
                      if (!(p2 = C(t3, l2, i2, h2)))
                        return false;
                      h2 += p2.length;
                    }
                    t3.write(n.ACKS[f2][0][c2][0]), _(t3, h2), d(t3, a2), p2 !== null && p2.write();
                    o2 === 5 && t3.write(r2.from(u2));
                    return true;
                  }(e2, t2, s2);
                case "pingreq":
                case "pingresp":
                  return function(e3, t3, r3) {
                    return t3.write(n.EMPTY[e3.cmd]);
                  }(e2, t2);
                case "disconnect":
                  return function(e3, t3, i2) {
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.reasonCode, c2 = s3.properties;
                    let u2 = o2 === 5 ? 1 : 0, l2 = null;
                    if (o2 === 5) {
                      if (!(l2 = C(t3, c2, i2, u2)))
                        return false;
                      u2 += l2.length;
                    }
                    t3.write(r2.from([n.codes.disconnect << 4])), _(t3, u2), o2 === 5 && t3.write(r2.from([a2]));
                    l2 !== null && l2.write();
                    return true;
                  }(e2, t2, s2);
                case "auth":
                  return function(e3, t3, i2) {
                    const o2 = i2 ? i2.protocolVersion : 4, s3 = e3 || {}, a2 = s3.reasonCode, c2 = s3.properties;
                    let u2 = o2 === 5 ? 1 : 0;
                    o2 !== 5 && t3.emit("error", new Error("Invalid mqtt version for auth packet"));
                    const l2 = C(t3, c2, i2, u2);
                    if (!l2)
                      return false;
                    u2 += l2.length, t3.write(r2.from([n.codes.auth << 4])), _(t3, u2), t3.write(r2.from([a2])), l2 !== null && l2.write();
                    return true;
                  }(e2, t2, s2);
                default:
                  return t2.emit("error", new Error("Unknown command")), false;
              }
            }
            function m(e2) {
              e2.uncork();
            }
            Object.defineProperty(b, "cacheNumbers", {get: () => d === S, set(e2) {
              e2 ? (u && Object.keys(u).length !== 0 || (g = true), d = S) : (g = false, d = E);
            }});
            const y = {};
            function _(e2, t2) {
              if (t2 > n.VARBYTEINT_MAX)
                return e2.emit("error", new Error(`Invalid variable byte integer: ${t2}`)), false;
              let r3 = y[t2];
              return r3 || (r3 = h(t2), t2 < 16384 && (y[t2] = r3)), c("writeVarByteInt: writing to stream: %o", r3), e2.write(r3);
            }
            function w(e2, t2) {
              const n2 = r2.byteLength(t2);
              return d(e2, n2), c("writeString: %s", t2), e2.write(t2, "utf8");
            }
            function v(e2, t2, r3) {
              w(e2, t2), w(e2, r3);
            }
            function S(e2, t2) {
              return c("writeNumberCached: number: %d", t2), c("writeNumberCached: %o", u[t2]), e2.write(u[t2]);
            }
            function E(e2, t2) {
              const r3 = l(t2);
              return c("writeNumberGenerated: %o", r3), e2.write(r3);
            }
            function k(e2, t2) {
              typeof t2 == "string" ? w(e2, t2) : t2 ? (d(e2, t2.length), e2.write(t2)) : d(e2, 0);
            }
            function I(e2, t2) {
              if (typeof t2 != "object" || t2.length != null)
                return {length: 1, write() {
                  A(e2, {}, 0);
                }};
              let i2 = 0;
              function o2(t3, i3) {
                let o3 = 0;
                switch (n.propertiesTypes[t3]) {
                  case "byte":
                    if (typeof i3 != "boolean")
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 2;
                    break;
                  case "int8":
                    if (typeof i3 != "number" || i3 < 0 || i3 > 255)
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 2;
                    break;
                  case "binary":
                    if (i3 && i3 === null)
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 1 + r2.byteLength(i3) + 2;
                    break;
                  case "int16":
                    if (typeof i3 != "number" || i3 < 0 || i3 > 65535)
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 3;
                    break;
                  case "int32":
                    if (typeof i3 != "number" || i3 < 0 || i3 > 4294967295)
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 5;
                    break;
                  case "var":
                    if (typeof i3 != "number" || i3 < 0 || i3 > 268435455)
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 1 + r2.byteLength(h(i3));
                    break;
                  case "string":
                    if (typeof i3 != "string")
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += 3 + r2.byteLength(i3.toString());
                    break;
                  case "pair":
                    if (typeof i3 != "object")
                      return e2.emit("error", new Error(`Invalid ${t3}: ${i3}`)), false;
                    o3 += Object.getOwnPropertyNames(i3).reduce((e3, t4) => {
                      const n2 = i3[t4];
                      return Array.isArray(n2) ? e3 += n2.reduce((e4, n3) => e4 += 3 + r2.byteLength(t4.toString()) + 2 + r2.byteLength(n3.toString()), 0) : e3 += 3 + r2.byteLength(t4.toString()) + 2 + r2.byteLength(i3[t4].toString()), e3;
                    }, 0);
                    break;
                  default:
                    return e2.emit("error", new Error(`Invalid property ${t3}: ${i3}`)), false;
                }
                return o3;
              }
              if (t2)
                for (const e3 in t2) {
                  let r3 = 0, n2 = 0;
                  const s2 = t2[e3];
                  if (Array.isArray(s2))
                    for (let t3 = 0; t3 < s2.length; t3++) {
                      if (!(n2 = o2(e3, s2[t3])))
                        return false;
                      r3 += n2;
                    }
                  else {
                    if (!(n2 = o2(e3, s2)))
                      return false;
                    r3 = n2;
                  }
                  if (!r3)
                    return false;
                  i2 += r3;
                }
              return {length: r2.byteLength(h(i2)) + i2, write() {
                A(e2, t2, i2);
              }};
            }
            function C(e2, t2, r3, n2) {
              const i2 = ["reasonString", "userProperties"], o2 = r3 && r3.properties && r3.properties.maximumPacketSize ? r3.properties.maximumPacketSize : 0;
              let s2 = I(e2, t2);
              if (o2)
                for (; n2 + s2.length > o2; ) {
                  const r4 = i2.shift();
                  if (!r4 || !t2[r4])
                    return false;
                  delete t2[r4], s2 = I(e2, t2);
                }
              return s2;
            }
            function T(e2, t2, i2) {
              switch (n.propertiesTypes[t2]) {
                case "byte":
                  e2.write(r2.from([n.properties[t2]])), e2.write(r2.from([+i2]));
                  break;
                case "int8":
                  e2.write(r2.from([n.properties[t2]])), e2.write(r2.from([i2]));
                  break;
                case "binary":
                  e2.write(r2.from([n.properties[t2]])), k(e2, i2);
                  break;
                case "int16":
                  e2.write(r2.from([n.properties[t2]])), d(e2, i2);
                  break;
                case "int32":
                  e2.write(r2.from([n.properties[t2]])), function(e3, t3) {
                    const r3 = p(t3);
                    c("write4ByteNumber: %o", r3), e3.write(r3);
                  }(e2, i2);
                  break;
                case "var":
                  e2.write(r2.from([n.properties[t2]])), _(e2, i2);
                  break;
                case "string":
                  e2.write(r2.from([n.properties[t2]])), w(e2, i2);
                  break;
                case "pair":
                  Object.getOwnPropertyNames(i2).forEach((o2) => {
                    const s2 = i2[o2];
                    Array.isArray(s2) ? s2.forEach((i3) => {
                      e2.write(r2.from([n.properties[t2]])), v(e2, o2.toString(), i3.toString());
                    }) : (e2.write(r2.from([n.properties[t2]])), v(e2, o2.toString(), s2.toString()));
                  });
                  break;
                default:
                  return e2.emit("error", new Error(`Invalid property ${t2} value: ${i2}`)), false;
              }
            }
            function A(e2, t2, r3) {
              _(e2, r3);
              for (const r4 in t2)
                if (Object.prototype.hasOwnProperty.call(t2, r4) && t2[r4] !== null) {
                  const n2 = t2[r4];
                  if (Array.isArray(n2))
                    for (let t3 = 0; t3 < n2.length; t3++)
                      T(e2, r4, n2[t3]);
                  else
                    T(e2, r4, n2);
                }
            }
            function R(e2) {
              return e2 ? e2 instanceof r2 ? e2.length : r2.byteLength(e2) : 0;
            }
            function O(e2) {
              return typeof e2 == "string" || e2 instanceof r2;
            }
            t.exports = b;
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, {"./constants": 22, "./numbers": 25, buffer: 14, debug: 15, "process-nextick-args": 31}], 29: [function(e, t, r) {
        var n = 1e3, i = 60 * n, o = 60 * i, s = 24 * o, a = 7 * s, c = 365.25 * s;
        function u(e2, t2, r2, n2) {
          var i2 = t2 >= 1.5 * r2;
          return Math.round(e2 / r2) + " " + n2 + (i2 ? "s" : "");
        }
        t.exports = function(e2, t2) {
          t2 = t2 || {};
          var r2 = typeof e2;
          if (r2 === "string" && e2.length > 0)
            return function(e3) {
              if ((e3 = String(e3)).length > 100)
                return;
              var t3 = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e3);
              if (!t3)
                return;
              var r3 = parseFloat(t3[1]);
              switch ((t3[2] || "ms").toLowerCase()) {
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                  return r3 * c;
                case "weeks":
                case "week":
                case "w":
                  return r3 * a;
                case "days":
                case "day":
                case "d":
                  return r3 * s;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                  return r3 * o;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                  return r3 * i;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                  return r3 * n;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                  return r3;
                default:
                  return;
              }
            }(e2);
          if (r2 === "number" && isFinite(e2))
            return t2.long ? function(e3) {
              var t3 = Math.abs(e3);
              if (t3 >= s)
                return u(e3, t3, s, "day");
              if (t3 >= o)
                return u(e3, t3, o, "hour");
              if (t3 >= i)
                return u(e3, t3, i, "minute");
              if (t3 >= n)
                return u(e3, t3, n, "second");
              return e3 + " ms";
            }(e2) : function(e3) {
              var t3 = Math.abs(e3);
              if (t3 >= s)
                return Math.round(e3 / s) + "d";
              if (t3 >= o)
                return Math.round(e3 / o) + "h";
              if (t3 >= i)
                return Math.round(e3 / i) + "m";
              if (t3 >= n)
                return Math.round(e3 / n) + "s";
              return e3 + "ms";
            }(e2);
          throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e2));
        };
      }, {}], 30: [function(e, t, r) {
        var n = e("wrappy");
        function i(e2) {
          var t2 = function() {
            return t2.called ? t2.value : (t2.called = true, t2.value = e2.apply(this, arguments));
          };
          return t2.called = false, t2;
        }
        function o(e2) {
          var t2 = function() {
            if (t2.called)
              throw new Error(t2.onceError);
            return t2.called = true, t2.value = e2.apply(this, arguments);
          }, r2 = e2.name || "Function wrapped with `once`";
          return t2.onceError = r2 + " shouldn't be called more than once", t2.called = false, t2;
        }
        t.exports = n(i), t.exports.strict = n(o), i.proto = i(function() {
          Object.defineProperty(Function.prototype, "once", {value: function() {
            return i(this);
          }, configurable: true}), Object.defineProperty(Function.prototype, "onceStrict", {value: function() {
            return o(this);
          }, configurable: true});
        });
      }, {wrappy: 59}], 31: [function(e, t, r) {
        (function(e2) {
          (function() {
            "use strict";
            e2 === void 0 || !e2.version || e2.version.indexOf("v0.") === 0 || e2.version.indexOf("v1.") === 0 && e2.version.indexOf("v1.8.") !== 0 ? t.exports = {nextTick: function(t2, r2, n, i) {
              if (typeof t2 != "function")
                throw new TypeError('"callback" argument must be a function');
              var o, s, a = arguments.length;
              switch (a) {
                case 0:
                case 1:
                  return e2.nextTick(t2);
                case 2:
                  return e2.nextTick(function() {
                    t2.call(null, r2);
                  });
                case 3:
                  return e2.nextTick(function() {
                    t2.call(null, r2, n);
                  });
                case 4:
                  return e2.nextTick(function() {
                    t2.call(null, r2, n, i);
                  });
                default:
                  for (o = new Array(a - 1), s = 0; s < o.length; )
                    o[s++] = arguments[s];
                  return e2.nextTick(function() {
                    t2.apply(null, o);
                  });
              }
            }} : t.exports = e2;
          }).call(this);
        }).call(this, e("_process"));
      }, {_process: 32}], 32: [function(e, t, r) {
        var n, i, o = t.exports = {};
        function s() {
          throw new Error("setTimeout has not been defined");
        }
        function a() {
          throw new Error("clearTimeout has not been defined");
        }
        function c(e2) {
          if (n === setTimeout)
            return setTimeout(e2, 0);
          if ((n === s || !n) && setTimeout)
            return n = setTimeout, setTimeout(e2, 0);
          try {
            return n(e2, 0);
          } catch (t2) {
            try {
              return n.call(null, e2, 0);
            } catch (t3) {
              return n.call(this, e2, 0);
            }
          }
        }
        !function() {
          try {
            n = typeof setTimeout == "function" ? setTimeout : s;
          } catch (e2) {
            n = s;
          }
          try {
            i = typeof clearTimeout == "function" ? clearTimeout : a;
          } catch (e2) {
            i = a;
          }
        }();
        var u, l = [], f = false, h = -1;
        function p() {
          f && u && (f = false, u.length ? l = u.concat(l) : h = -1, l.length && d());
        }
        function d() {
          if (!f) {
            var e2 = c(p);
            f = true;
            for (var t2 = l.length; t2; ) {
              for (u = l, l = []; ++h < t2; )
                u && u[h].run();
              h = -1, t2 = l.length;
            }
            u = null, f = false, function(e3) {
              if (i === clearTimeout)
                return clearTimeout(e3);
              if ((i === a || !i) && clearTimeout)
                return i = clearTimeout, clearTimeout(e3);
              try {
                i(e3);
              } catch (t3) {
                try {
                  return i.call(null, e3);
                } catch (t4) {
                  return i.call(this, e3);
                }
              }
            }(e2);
          }
        }
        function g(e2, t2) {
          this.fun = e2, this.array = t2;
        }
        function b() {
        }
        o.nextTick = function(e2) {
          var t2 = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var r2 = 1; r2 < arguments.length; r2++)
              t2[r2 - 1] = arguments[r2];
          l.push(new g(e2, t2)), l.length !== 1 || f || c(d);
        }, g.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, o.title = "browser", o.browser = true, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = b, o.addListener = b, o.once = b, o.off = b, o.removeListener = b, o.removeAllListeners = b, o.emit = b, o.prependListener = b, o.prependOnceListener = b, o.listeners = function(e2) {
          return [];
        }, o.binding = function(e2) {
          throw new Error("process.binding is not supported");
        }, o.cwd = function() {
          return "/";
        }, o.chdir = function(e2) {
          throw new Error("process.chdir is not supported");
        }, o.umask = function() {
          return 0;
        };
      }, {}], 33: [function(e, t, r) {
        (function(e2) {
          (function() {
            !function(n) {
              var i = typeof r == "object" && r && !r.nodeType && r, o = typeof t == "object" && t && !t.nodeType && t, s = typeof e2 == "object" && e2;
              s.global !== s && s.window !== s && s.self !== s || (n = s);
              var a, c, u = 2147483647, l = 36, f = 1, h = 26, p = 38, d = 700, g = 72, b = 128, m = "-", y = /^xn--/, _ = /[^\x20-\x7E]/, w = /[\x2E\u3002\uFF0E\uFF61]/g, v = {overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input"}, S = l - f, E = Math.floor, k = String.fromCharCode;
              function I(e3) {
                throw new RangeError(v[e3]);
              }
              function C(e3, t2) {
                for (var r2 = e3.length, n2 = []; r2--; )
                  n2[r2] = t2(e3[r2]);
                return n2;
              }
              function T(e3, t2) {
                var r2 = e3.split("@"), n2 = "";
                return r2.length > 1 && (n2 = r2[0] + "@", e3 = r2[1]), n2 + C((e3 = e3.replace(w, ".")).split("."), t2).join(".");
              }
              function A(e3) {
                for (var t2, r2, n2 = [], i2 = 0, o2 = e3.length; i2 < o2; )
                  (t2 = e3.charCodeAt(i2++)) >= 55296 && t2 <= 56319 && i2 < o2 ? (64512 & (r2 = e3.charCodeAt(i2++))) == 56320 ? n2.push(((1023 & t2) << 10) + (1023 & r2) + 65536) : (n2.push(t2), i2--) : n2.push(t2);
                return n2;
              }
              function R(e3) {
                return C(e3, function(e4) {
                  var t2 = "";
                  return e4 > 65535 && (t2 += k((e4 -= 65536) >>> 10 & 1023 | 55296), e4 = 56320 | 1023 & e4), t2 += k(e4);
                }).join("");
              }
              function O(e3, t2) {
                return e3 + 22 + 75 * (e3 < 26) - ((t2 != 0) << 5);
              }
              function x(e3, t2, r2) {
                var n2 = 0;
                for (e3 = r2 ? E(e3 / d) : e3 >> 1, e3 += E(e3 / t2); e3 > S * h >> 1; n2 += l)
                  e3 = E(e3 / S);
                return E(n2 + (S + 1) * e3 / (e3 + p));
              }
              function P(e3) {
                var t2, r2, n2, i2, o2, s2, a2, c2, p2, d2, y2, _2 = [], w2 = e3.length, v2 = 0, S2 = b, k2 = g;
                for ((r2 = e3.lastIndexOf(m)) < 0 && (r2 = 0), n2 = 0; n2 < r2; ++n2)
                  e3.charCodeAt(n2) >= 128 && I("not-basic"), _2.push(e3.charCodeAt(n2));
                for (i2 = r2 > 0 ? r2 + 1 : 0; i2 < w2; ) {
                  for (o2 = v2, s2 = 1, a2 = l; i2 >= w2 && I("invalid-input"), ((c2 = (y2 = e3.charCodeAt(i2++)) - 48 < 10 ? y2 - 22 : y2 - 65 < 26 ? y2 - 65 : y2 - 97 < 26 ? y2 - 97 : l) >= l || c2 > E((u - v2) / s2)) && I("overflow"), v2 += c2 * s2, !(c2 < (p2 = a2 <= k2 ? f : a2 >= k2 + h ? h : a2 - k2)); a2 += l)
                    s2 > E(u / (d2 = l - p2)) && I("overflow"), s2 *= d2;
                  k2 = x(v2 - o2, t2 = _2.length + 1, o2 == 0), E(v2 / t2) > u - S2 && I("overflow"), S2 += E(v2 / t2), v2 %= t2, _2.splice(v2++, 0, S2);
                }
                return R(_2);
              }
              function M(e3) {
                var t2, r2, n2, i2, o2, s2, a2, c2, p2, d2, y2, _2, w2, v2, S2, C2 = [];
                for (_2 = (e3 = A(e3)).length, t2 = b, r2 = 0, o2 = g, s2 = 0; s2 < _2; ++s2)
                  (y2 = e3[s2]) < 128 && C2.push(k(y2));
                for (n2 = i2 = C2.length, i2 && C2.push(m); n2 < _2; ) {
                  for (a2 = u, s2 = 0; s2 < _2; ++s2)
                    (y2 = e3[s2]) >= t2 && y2 < a2 && (a2 = y2);
                  for (a2 - t2 > E((u - r2) / (w2 = n2 + 1)) && I("overflow"), r2 += (a2 - t2) * w2, t2 = a2, s2 = 0; s2 < _2; ++s2)
                    if ((y2 = e3[s2]) < t2 && ++r2 > u && I("overflow"), y2 == t2) {
                      for (c2 = r2, p2 = l; !(c2 < (d2 = p2 <= o2 ? f : p2 >= o2 + h ? h : p2 - o2)); p2 += l)
                        S2 = c2 - d2, v2 = l - d2, C2.push(k(O(d2 + S2 % v2, 0))), c2 = E(S2 / v2);
                      C2.push(k(O(c2, 0))), o2 = x(r2, w2, n2 == i2), r2 = 0, ++n2;
                    }
                  ++r2, ++t2;
                }
                return C2.join("");
              }
              if (a = {version: "1.4.1", ucs2: {decode: A, encode: R}, decode: P, encode: M, toASCII: function(e3) {
                return T(e3, function(e4) {
                  return _.test(e4) ? "xn--" + M(e4) : e4;
                });
              }, toUnicode: function(e3) {
                return T(e3, function(e4) {
                  return y.test(e4) ? P(e4.slice(4).toLowerCase()) : e4;
                });
              }}, i && o)
                if (t.exports == i)
                  o.exports = a;
                else
                  for (c in a)
                    a.hasOwnProperty(c) && (i[c] = a[c]);
              else
                n.punycode = a;
            }(this);
          }).call(this);
        }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
      }, {}], 34: [function(e, t, r) {
        "use strict";
        function n(e2, t2) {
          return Object.prototype.hasOwnProperty.call(e2, t2);
        }
        t.exports = function(e2, t2, r2, o) {
          t2 = t2 || "&", r2 = r2 || "=";
          var s = {};
          if (typeof e2 != "string" || e2.length === 0)
            return s;
          var a = /\+/g;
          e2 = e2.split(t2);
          var c = 1e3;
          o && typeof o.maxKeys == "number" && (c = o.maxKeys);
          var u = e2.length;
          c > 0 && u > c && (u = c);
          for (var l = 0; l < u; ++l) {
            var f, h, p, d, g = e2[l].replace(a, "%20"), b = g.indexOf(r2);
            b >= 0 ? (f = g.substr(0, b), h = g.substr(b + 1)) : (f = g, h = ""), p = decodeURIComponent(f), d = decodeURIComponent(h), n(s, p) ? i(s[p]) ? s[p].push(d) : s[p] = [s[p], d] : s[p] = d;
          }
          return s;
        };
        var i = Array.isArray || function(e2) {
          return Object.prototype.toString.call(e2) === "[object Array]";
        };
      }, {}], 35: [function(e, t, r) {
        "use strict";
        var n = function(e2) {
          switch (typeof e2) {
            case "string":
              return e2;
            case "boolean":
              return e2 ? "true" : "false";
            case "number":
              return isFinite(e2) ? e2 : "";
            default:
              return "";
          }
        };
        t.exports = function(e2, t2, r2, a) {
          return t2 = t2 || "&", r2 = r2 || "=", e2 === null && (e2 = void 0), typeof e2 == "object" ? o(s(e2), function(s2) {
            var a2 = encodeURIComponent(n(s2)) + r2;
            return i(e2[s2]) ? o(e2[s2], function(e3) {
              return a2 + encodeURIComponent(n(e3));
            }).join(t2) : a2 + encodeURIComponent(n(e2[s2]));
          }).join(t2) : a ? encodeURIComponent(n(a)) + r2 + encodeURIComponent(n(e2)) : "";
        };
        var i = Array.isArray || function(e2) {
          return Object.prototype.toString.call(e2) === "[object Array]";
        };
        function o(e2, t2) {
          if (e2.map)
            return e2.map(t2);
          for (var r2 = [], n2 = 0; n2 < e2.length; n2++)
            r2.push(t2(e2[n2], n2));
          return r2;
        }
        var s = Object.keys || function(e2) {
          var t2 = [];
          for (var r2 in e2)
            Object.prototype.hasOwnProperty.call(e2, r2) && t2.push(r2);
          return t2;
        };
      }, {}], 36: [function(e, t, r) {
        "use strict";
        r.decode = r.parse = e("./decode"), r.encode = r.stringify = e("./encode");
      }, {"./decode": 34, "./encode": 35}], 37: [function(e, t, r) {
        "use strict";
        var n = {};
        function i(e2, t2, r2) {
          r2 || (r2 = Error);
          var i2 = function(e3) {
            var r3, n2;
            function i3(r4, n3, i4) {
              return e3.call(this, function(e4, r5, n4) {
                return typeof t2 == "string" ? t2 : t2(e4, r5, n4);
              }(r4, n3, i4)) || this;
            }
            return n2 = e3, (r3 = i3).prototype = Object.create(n2.prototype), r3.prototype.constructor = r3, r3.__proto__ = n2, i3;
          }(r2);
          i2.prototype.name = r2.name, i2.prototype.code = e2, n[e2] = i2;
        }
        function o(e2, t2) {
          if (Array.isArray(e2)) {
            var r2 = e2.length;
            return e2 = e2.map(function(e3) {
              return String(e3);
            }), r2 > 2 ? "one of ".concat(t2, " ").concat(e2.slice(0, r2 - 1).join(", "), ", or ") + e2[r2 - 1] : r2 === 2 ? "one of ".concat(t2, " ").concat(e2[0], " or ").concat(e2[1]) : "of ".concat(t2, " ").concat(e2[0]);
          }
          return "of ".concat(t2, " ").concat(String(e2));
        }
        i("ERR_INVALID_OPT_VALUE", function(e2, t2) {
          return 'The value "' + t2 + '" is invalid for option "' + e2 + '"';
        }, TypeError), i("ERR_INVALID_ARG_TYPE", function(e2, t2, r2) {
          var n2, i2, s, a;
          if (typeof t2 == "string" && (i2 = "not ", t2.substr(!s || s < 0 ? 0 : +s, i2.length) === i2) ? (n2 = "must not be", t2 = t2.replace(/^not /, "")) : n2 = "must be", function(e3, t3, r3) {
            return (r3 === void 0 || r3 > e3.length) && (r3 = e3.length), e3.substring(r3 - t3.length, r3) === t3;
          }(e2, " argument"))
            a = "The ".concat(e2, " ").concat(n2, " ").concat(o(t2, "type"));
          else {
            var c = function(e3, t3, r3) {
              return typeof r3 != "number" && (r3 = 0), !(r3 + t3.length > e3.length) && e3.indexOf(t3, r3) !== -1;
            }(e2, ".") ? "property" : "argument";
            a = 'The "'.concat(e2, '" ').concat(c, " ").concat(n2, " ").concat(o(t2, "type"));
          }
          return a += ". Received type ".concat(typeof r2);
        }, TypeError), i("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), i("ERR_METHOD_NOT_IMPLEMENTED", function(e2) {
          return "The " + e2 + " method is not implemented";
        }), i("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), i("ERR_STREAM_DESTROYED", function(e2) {
          return "Cannot call " + e2 + " after a stream was destroyed";
        }), i("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), i("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), i("ERR_STREAM_WRITE_AFTER_END", "write after end"), i("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), i("ERR_UNKNOWN_ENCODING", function(e2) {
          return "Unknown encoding: " + e2;
        }, TypeError), i("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t.exports.codes = n;
      }, {}], 38: [function(e, t, r) {
        (function(r2) {
          (function() {
            "use strict";
            var n = Object.keys || function(e2) {
              var t2 = [];
              for (var r3 in e2)
                t2.push(r3);
              return t2;
            };
            t.exports = u;
            var i = e("./_stream_readable"), o = e("./_stream_writable");
            e("inherits")(u, i);
            for (var s = n(o.prototype), a = 0; a < s.length; a++) {
              var c = s[a];
              u.prototype[c] || (u.prototype[c] = o.prototype[c]);
            }
            function u(e2) {
              if (!(this instanceof u))
                return new u(e2);
              i.call(this, e2), o.call(this, e2), this.allowHalfOpen = true, e2 && (e2.readable === false && (this.readable = false), e2.writable === false && (this.writable = false), e2.allowHalfOpen === false && (this.allowHalfOpen = false, this.once("end", l)));
            }
            function l() {
              this._writableState.ended || r2.nextTick(f, this);
            }
            function f(e2) {
              e2.end();
            }
            Object.defineProperty(u.prototype, "writableHighWaterMark", {enumerable: false, get: function() {
              return this._writableState.highWaterMark;
            }}), Object.defineProperty(u.prototype, "writableBuffer", {enumerable: false, get: function() {
              return this._writableState && this._writableState.getBuffer();
            }}), Object.defineProperty(u.prototype, "writableLength", {enumerable: false, get: function() {
              return this._writableState.length;
            }}), Object.defineProperty(u.prototype, "destroyed", {enumerable: false, get: function() {
              return this._readableState !== void 0 && this._writableState !== void 0 && (this._readableState.destroyed && this._writableState.destroyed);
            }, set: function(e2) {
              this._readableState !== void 0 && this._writableState !== void 0 && (this._readableState.destroyed = e2, this._writableState.destroyed = e2);
            }});
          }).call(this);
        }).call(this, e("_process"));
      }, {"./_stream_readable": 40, "./_stream_writable": 42, _process: 32, inherits: 21}], 39: [function(e, t, r) {
        "use strict";
        t.exports = i;
        var n = e("./_stream_transform");
        function i(e2) {
          if (!(this instanceof i))
            return new i(e2);
          n.call(this, e2);
        }
        e("inherits")(i, n), i.prototype._transform = function(e2, t2, r2) {
          r2(null, e2);
        };
      }, {"./_stream_transform": 41, inherits: 21}], 40: [function(e, t, r) {
        (function(r2, n) {
          (function() {
            "use strict";
            var i;
            t.exports = I, I.ReadableState = k;
            e("events").EventEmitter;
            var o = function(e2, t2) {
              return e2.listeners(t2).length;
            }, s = e("./internal/streams/stream"), a = e("buffer").Buffer, c = n.Uint8Array || function() {
            };
            var u, l = e("util");
            u = l && l.debuglog ? l.debuglog("stream") : function() {
            };
            var f, h, p, d = e("./internal/streams/buffer_list"), g = e("./internal/streams/destroy"), b = e("./internal/streams/state").getHighWaterMark, m = e("../errors").codes, y = m.ERR_INVALID_ARG_TYPE, _ = m.ERR_STREAM_PUSH_AFTER_EOF, w = m.ERR_METHOD_NOT_IMPLEMENTED, v = m.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
            e("inherits")(I, s);
            var S = g.errorOrDestroy, E = ["error", "close", "destroy", "pause", "resume"];
            function k(t2, r3, n2) {
              i = i || e("./_stream_duplex"), t2 = t2 || {}, typeof n2 != "boolean" && (n2 = r3 instanceof i), this.objectMode = !!t2.objectMode, n2 && (this.objectMode = this.objectMode || !!t2.readableObjectMode), this.highWaterMark = b(this, t2, "readableHighWaterMark", n2), this.buffer = new d(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = false, this.endEmitted = false, this.reading = false, this.sync = true, this.needReadable = false, this.emittedReadable = false, this.readableListening = false, this.resumeScheduled = false, this.paused = true, this.emitClose = t2.emitClose !== false, this.autoDestroy = !!t2.autoDestroy, this.destroyed = false, this.defaultEncoding = t2.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = false, this.decoder = null, this.encoding = null, t2.encoding && (f || (f = e("string_decoder/").StringDecoder), this.decoder = new f(t2.encoding), this.encoding = t2.encoding);
            }
            function I(t2) {
              if (i = i || e("./_stream_duplex"), !(this instanceof I))
                return new I(t2);
              var r3 = this instanceof i;
              this._readableState = new k(t2, this, r3), this.readable = true, t2 && (typeof t2.read == "function" && (this._read = t2.read), typeof t2.destroy == "function" && (this._destroy = t2.destroy)), s.call(this);
            }
            function C(e2, t2, r3, n2, i2) {
              u("readableAddChunk", t2);
              var o2, s2 = e2._readableState;
              if (t2 === null)
                s2.reading = false, function(e3, t3) {
                  if (u("onEofChunk"), t3.ended)
                    return;
                  if (t3.decoder) {
                    var r4 = t3.decoder.end();
                    r4 && r4.length && (t3.buffer.push(r4), t3.length += t3.objectMode ? 1 : r4.length);
                  }
                  t3.ended = true, t3.sync ? O(e3) : (t3.needReadable = false, t3.emittedReadable || (t3.emittedReadable = true, x(e3)));
                }(e2, s2);
              else if (i2 || (o2 = function(e3, t3) {
                var r4;
                n3 = t3, a.isBuffer(n3) || n3 instanceof c || typeof t3 == "string" || t3 === void 0 || e3.objectMode || (r4 = new y("chunk", ["string", "Buffer", "Uint8Array"], t3));
                var n3;
                return r4;
              }(s2, t2)), o2)
                S(e2, o2);
              else if (s2.objectMode || t2 && t2.length > 0)
                if (typeof t2 == "string" || s2.objectMode || Object.getPrototypeOf(t2) === a.prototype || (t2 = function(e3) {
                  return a.from(e3);
                }(t2)), n2)
                  s2.endEmitted ? S(e2, new v()) : T(e2, s2, t2, true);
                else if (s2.ended)
                  S(e2, new _());
                else {
                  if (s2.destroyed)
                    return false;
                  s2.reading = false, s2.decoder && !r3 ? (t2 = s2.decoder.write(t2), s2.objectMode || t2.length !== 0 ? T(e2, s2, t2, false) : P(e2, s2)) : T(e2, s2, t2, false);
                }
              else
                n2 || (s2.reading = false, P(e2, s2));
              return !s2.ended && (s2.length < s2.highWaterMark || s2.length === 0);
            }
            function T(e2, t2, r3, n2) {
              t2.flowing && t2.length === 0 && !t2.sync ? (t2.awaitDrain = 0, e2.emit("data", r3)) : (t2.length += t2.objectMode ? 1 : r3.length, n2 ? t2.buffer.unshift(r3) : t2.buffer.push(r3), t2.needReadable && O(e2)), P(e2, t2);
            }
            Object.defineProperty(I.prototype, "destroyed", {enumerable: false, get: function() {
              return this._readableState !== void 0 && this._readableState.destroyed;
            }, set: function(e2) {
              this._readableState && (this._readableState.destroyed = e2);
            }}), I.prototype.destroy = g.destroy, I.prototype._undestroy = g.undestroy, I.prototype._destroy = function(e2, t2) {
              t2(e2);
            }, I.prototype.push = function(e2, t2) {
              var r3, n2 = this._readableState;
              return n2.objectMode ? r3 = true : typeof e2 == "string" && ((t2 = t2 || n2.defaultEncoding) !== n2.encoding && (e2 = a.from(e2, t2), t2 = ""), r3 = true), C(this, e2, t2, false, r3);
            }, I.prototype.unshift = function(e2) {
              return C(this, e2, null, true, false);
            }, I.prototype.isPaused = function() {
              return this._readableState.flowing === false;
            }, I.prototype.setEncoding = function(t2) {
              f || (f = e("string_decoder/").StringDecoder);
              var r3 = new f(t2);
              this._readableState.decoder = r3, this._readableState.encoding = this._readableState.decoder.encoding;
              for (var n2 = this._readableState.buffer.head, i2 = ""; n2 !== null; )
                i2 += r3.write(n2.data), n2 = n2.next;
              return this._readableState.buffer.clear(), i2 !== "" && this._readableState.buffer.push(i2), this._readableState.length = i2.length, this;
            };
            var A = 1073741824;
            function R(e2, t2) {
              return e2 <= 0 || t2.length === 0 && t2.ended ? 0 : t2.objectMode ? 1 : e2 != e2 ? t2.flowing && t2.length ? t2.buffer.head.data.length : t2.length : (e2 > t2.highWaterMark && (t2.highWaterMark = function(e3) {
                return e3 >= A ? e3 = A : (e3--, e3 |= e3 >>> 1, e3 |= e3 >>> 2, e3 |= e3 >>> 4, e3 |= e3 >>> 8, e3 |= e3 >>> 16, e3++), e3;
              }(e2)), e2 <= t2.length ? e2 : t2.ended ? t2.length : (t2.needReadable = true, 0));
            }
            function O(e2) {
              var t2 = e2._readableState;
              u("emitReadable", t2.needReadable, t2.emittedReadable), t2.needReadable = false, t2.emittedReadable || (u("emitReadable", t2.flowing), t2.emittedReadable = true, r2.nextTick(x, e2));
            }
            function x(e2) {
              var t2 = e2._readableState;
              u("emitReadable_", t2.destroyed, t2.length, t2.ended), t2.destroyed || !t2.length && !t2.ended || (e2.emit("readable"), t2.emittedReadable = false), t2.needReadable = !t2.flowing && !t2.ended && t2.length <= t2.highWaterMark, U(e2);
            }
            function P(e2, t2) {
              t2.readingMore || (t2.readingMore = true, r2.nextTick(M, e2, t2));
            }
            function M(e2, t2) {
              for (; !t2.reading && !t2.ended && (t2.length < t2.highWaterMark || t2.flowing && t2.length === 0); ) {
                var r3 = t2.length;
                if (u("maybeReadMore read 0"), e2.read(0), r3 === t2.length)
                  break;
              }
              t2.readingMore = false;
            }
            function L(e2) {
              var t2 = e2._readableState;
              t2.readableListening = e2.listenerCount("readable") > 0, t2.resumeScheduled && !t2.paused ? t2.flowing = true : e2.listenerCount("data") > 0 && e2.resume();
            }
            function B(e2) {
              u("readable nexttick read 0"), e2.read(0);
            }
            function N(e2, t2) {
              u("resume", t2.reading), t2.reading || e2.read(0), t2.resumeScheduled = false, e2.emit("resume"), U(e2), t2.flowing && !t2.reading && e2.read(0);
            }
            function U(e2) {
              var t2 = e2._readableState;
              for (u("flow", t2.flowing); t2.flowing && e2.read() !== null; )
                ;
            }
            function j(e2, t2) {
              return t2.length === 0 ? null : (t2.objectMode ? r3 = t2.buffer.shift() : !e2 || e2 >= t2.length ? (r3 = t2.decoder ? t2.buffer.join("") : t2.buffer.length === 1 ? t2.buffer.first() : t2.buffer.concat(t2.length), t2.buffer.clear()) : r3 = t2.buffer.consume(e2, t2.decoder), r3);
              var r3;
            }
            function q(e2) {
              var t2 = e2._readableState;
              u("endReadable", t2.endEmitted), t2.endEmitted || (t2.ended = true, r2.nextTick(D, t2, e2));
            }
            function D(e2, t2) {
              if (u("endReadableNT", e2.endEmitted, e2.length), !e2.endEmitted && e2.length === 0 && (e2.endEmitted = true, t2.readable = false, t2.emit("end"), e2.autoDestroy)) {
                var r3 = t2._writableState;
                (!r3 || r3.autoDestroy && r3.finished) && t2.destroy();
              }
            }
            function F(e2, t2) {
              for (var r3 = 0, n2 = e2.length; r3 < n2; r3++)
                if (e2[r3] === t2)
                  return r3;
              return -1;
            }
            I.prototype.read = function(e2) {
              u("read", e2), e2 = parseInt(e2, 10);
              var t2 = this._readableState, r3 = e2;
              if (e2 !== 0 && (t2.emittedReadable = false), e2 === 0 && t2.needReadable && ((t2.highWaterMark !== 0 ? t2.length >= t2.highWaterMark : t2.length > 0) || t2.ended))
                return u("read: emitReadable", t2.length, t2.ended), t2.length === 0 && t2.ended ? q(this) : O(this), null;
              if ((e2 = R(e2, t2)) === 0 && t2.ended)
                return t2.length === 0 && q(this), null;
              var n2, i2 = t2.needReadable;
              return u("need readable", i2), (t2.length === 0 || t2.length - e2 < t2.highWaterMark) && u("length less than watermark", i2 = true), t2.ended || t2.reading ? u("reading or ended", i2 = false) : i2 && (u("do read"), t2.reading = true, t2.sync = true, t2.length === 0 && (t2.needReadable = true), this._read(t2.highWaterMark), t2.sync = false, t2.reading || (e2 = R(r3, t2))), (n2 = e2 > 0 ? j(e2, t2) : null) === null ? (t2.needReadable = t2.length <= t2.highWaterMark, e2 = 0) : (t2.length -= e2, t2.awaitDrain = 0), t2.length === 0 && (t2.ended || (t2.needReadable = true), r3 !== e2 && t2.ended && q(this)), n2 !== null && this.emit("data", n2), n2;
            }, I.prototype._read = function(e2) {
              S(this, new w("_read()"));
            }, I.prototype.pipe = function(e2, t2) {
              var n2 = this, i2 = this._readableState;
              switch (i2.pipesCount) {
                case 0:
                  i2.pipes = e2;
                  break;
                case 1:
                  i2.pipes = [i2.pipes, e2];
                  break;
                default:
                  i2.pipes.push(e2);
              }
              i2.pipesCount += 1, u("pipe count=%d opts=%j", i2.pipesCount, t2);
              var s2 = (!t2 || t2.end !== false) && e2 !== r2.stdout && e2 !== r2.stderr ? c2 : b2;
              function a2(t3, r3) {
                u("onunpipe"), t3 === n2 && r3 && r3.hasUnpiped === false && (r3.hasUnpiped = true, u("cleanup"), e2.removeListener("close", d2), e2.removeListener("finish", g2), e2.removeListener("drain", l2), e2.removeListener("error", p2), e2.removeListener("unpipe", a2), n2.removeListener("end", c2), n2.removeListener("end", b2), n2.removeListener("data", h2), f2 = true, !i2.awaitDrain || e2._writableState && !e2._writableState.needDrain || l2());
              }
              function c2() {
                u("onend"), e2.end();
              }
              i2.endEmitted ? r2.nextTick(s2) : n2.once("end", s2), e2.on("unpipe", a2);
              var l2 = function(e3) {
                return function() {
                  var t3 = e3._readableState;
                  u("pipeOnDrain", t3.awaitDrain), t3.awaitDrain && t3.awaitDrain--, t3.awaitDrain === 0 && o(e3, "data") && (t3.flowing = true, U(e3));
                };
              }(n2);
              e2.on("drain", l2);
              var f2 = false;
              function h2(t3) {
                u("ondata");
                var r3 = e2.write(t3);
                u("dest.write", r3), r3 === false && ((i2.pipesCount === 1 && i2.pipes === e2 || i2.pipesCount > 1 && F(i2.pipes, e2) !== -1) && !f2 && (u("false write response, pause", i2.awaitDrain), i2.awaitDrain++), n2.pause());
              }
              function p2(t3) {
                u("onerror", t3), b2(), e2.removeListener("error", p2), o(e2, "error") === 0 && S(e2, t3);
              }
              function d2() {
                e2.removeListener("finish", g2), b2();
              }
              function g2() {
                u("onfinish"), e2.removeListener("close", d2), b2();
              }
              function b2() {
                u("unpipe"), n2.unpipe(e2);
              }
              return n2.on("data", h2), function(e3, t3, r3) {
                if (typeof e3.prependListener == "function")
                  return e3.prependListener(t3, r3);
                e3._events && e3._events[t3] ? Array.isArray(e3._events[t3]) ? e3._events[t3].unshift(r3) : e3._events[t3] = [r3, e3._events[t3]] : e3.on(t3, r3);
              }(e2, "error", p2), e2.once("close", d2), e2.once("finish", g2), e2.emit("pipe", n2), i2.flowing || (u("pipe resume"), n2.resume()), e2;
            }, I.prototype.unpipe = function(e2) {
              var t2 = this._readableState, r3 = {hasUnpiped: false};
              if (t2.pipesCount === 0)
                return this;
              if (t2.pipesCount === 1)
                return e2 && e2 !== t2.pipes ? this : (e2 || (e2 = t2.pipes), t2.pipes = null, t2.pipesCount = 0, t2.flowing = false, e2 && e2.emit("unpipe", this, r3), this);
              if (!e2) {
                var n2 = t2.pipes, i2 = t2.pipesCount;
                t2.pipes = null, t2.pipesCount = 0, t2.flowing = false;
                for (var o2 = 0; o2 < i2; o2++)
                  n2[o2].emit("unpipe", this, {hasUnpiped: false});
                return this;
              }
              var s2 = F(t2.pipes, e2);
              return s2 === -1 ? this : (t2.pipes.splice(s2, 1), t2.pipesCount -= 1, t2.pipesCount === 1 && (t2.pipes = t2.pipes[0]), e2.emit("unpipe", this, r3), this);
            }, I.prototype.on = function(e2, t2) {
              var n2 = s.prototype.on.call(this, e2, t2), i2 = this._readableState;
              return e2 === "data" ? (i2.readableListening = this.listenerCount("readable") > 0, i2.flowing !== false && this.resume()) : e2 === "readable" && (i2.endEmitted || i2.readableListening || (i2.readableListening = i2.needReadable = true, i2.flowing = false, i2.emittedReadable = false, u("on readable", i2.length, i2.reading), i2.length ? O(this) : i2.reading || r2.nextTick(B, this))), n2;
            }, I.prototype.addListener = I.prototype.on, I.prototype.removeListener = function(e2, t2) {
              var n2 = s.prototype.removeListener.call(this, e2, t2);
              return e2 === "readable" && r2.nextTick(L, this), n2;
            }, I.prototype.removeAllListeners = function(e2) {
              var t2 = s.prototype.removeAllListeners.apply(this, arguments);
              return e2 !== "readable" && e2 !== void 0 || r2.nextTick(L, this), t2;
            }, I.prototype.resume = function() {
              var e2 = this._readableState;
              return e2.flowing || (u("resume"), e2.flowing = !e2.readableListening, function(e3, t2) {
                t2.resumeScheduled || (t2.resumeScheduled = true, r2.nextTick(N, e3, t2));
              }(this, e2)), e2.paused = false, this;
            }, I.prototype.pause = function() {
              return u("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== false && (u("pause"), this._readableState.flowing = false, this.emit("pause")), this._readableState.paused = true, this;
            }, I.prototype.wrap = function(e2) {
              var t2 = this, r3 = this._readableState, n2 = false;
              for (var i2 in e2.on("end", function() {
                if (u("wrapped end"), r3.decoder && !r3.ended) {
                  var e3 = r3.decoder.end();
                  e3 && e3.length && t2.push(e3);
                }
                t2.push(null);
              }), e2.on("data", function(i3) {
                (u("wrapped data"), r3.decoder && (i3 = r3.decoder.write(i3)), !r3.objectMode || i3 !== null && i3 !== void 0) && ((r3.objectMode || i3 && i3.length) && (t2.push(i3) || (n2 = true, e2.pause())));
              }), e2)
                this[i2] === void 0 && typeof e2[i2] == "function" && (this[i2] = function(t3) {
                  return function() {
                    return e2[t3].apply(e2, arguments);
                  };
                }(i2));
              for (var o2 = 0; o2 < E.length; o2++)
                e2.on(E[o2], this.emit.bind(this, E[o2]));
              return this._read = function(t3) {
                u("wrapped _read", t3), n2 && (n2 = false, e2.resume());
              }, this;
            }, typeof Symbol == "function" && (I.prototype[Symbol.asyncIterator] = function() {
              return h === void 0 && (h = e("./internal/streams/async_iterator")), h(this);
            }), Object.defineProperty(I.prototype, "readableHighWaterMark", {enumerable: false, get: function() {
              return this._readableState.highWaterMark;
            }}), Object.defineProperty(I.prototype, "readableBuffer", {enumerable: false, get: function() {
              return this._readableState && this._readableState.buffer;
            }}), Object.defineProperty(I.prototype, "readableFlowing", {enumerable: false, get: function() {
              return this._readableState.flowing;
            }, set: function(e2) {
              this._readableState && (this._readableState.flowing = e2);
            }}), I._fromList = j, Object.defineProperty(I.prototype, "readableLength", {enumerable: false, get: function() {
              return this._readableState.length;
            }}), typeof Symbol == "function" && (I.from = function(t2, r3) {
              return p === void 0 && (p = e("./internal/streams/from")), p(I, t2, r3);
            });
          }).call(this);
        }).call(this, e("_process"), typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
      }, {"../errors": 37, "./_stream_duplex": 38, "./internal/streams/async_iterator": 43, "./internal/streams/buffer_list": 44, "./internal/streams/destroy": 45, "./internal/streams/from": 47, "./internal/streams/state": 49, "./internal/streams/stream": 50, _process: 32, buffer: 14, events: 19, inherits: 21, "string_decoder/": 55, util: 13}], 41: [function(e, t, r) {
        "use strict";
        t.exports = u;
        var n = e("../errors").codes, i = n.ERR_METHOD_NOT_IMPLEMENTED, o = n.ERR_MULTIPLE_CALLBACK, s = n.ERR_TRANSFORM_ALREADY_TRANSFORMING, a = n.ERR_TRANSFORM_WITH_LENGTH_0, c = e("./_stream_duplex");
        function u(e2) {
          if (!(this instanceof u))
            return new u(e2);
          c.call(this, e2), this._transformState = {afterTransform: function(e3, t2) {
            var r2 = this._transformState;
            r2.transforming = false;
            var n2 = r2.writecb;
            if (n2 === null)
              return this.emit("error", new o());
            r2.writechunk = null, r2.writecb = null, t2 != null && this.push(t2), n2(e3);
            var i2 = this._readableState;
            i2.reading = false, (i2.needReadable || i2.length < i2.highWaterMark) && this._read(i2.highWaterMark);
          }.bind(this), needTransform: false, transforming: false, writecb: null, writechunk: null, writeencoding: null}, this._readableState.needReadable = true, this._readableState.sync = false, e2 && (typeof e2.transform == "function" && (this._transform = e2.transform), typeof e2.flush == "function" && (this._flush = e2.flush)), this.on("prefinish", l);
        }
        function l() {
          var e2 = this;
          typeof this._flush != "function" || this._readableState.destroyed ? f(this, null, null) : this._flush(function(t2, r2) {
            f(e2, t2, r2);
          });
        }
        function f(e2, t2, r2) {
          if (t2)
            return e2.emit("error", t2);
          if (r2 != null && e2.push(r2), e2._writableState.length)
            throw new a();
          if (e2._transformState.transforming)
            throw new s();
          return e2.push(null);
        }
        e("inherits")(u, c), u.prototype.push = function(e2, t2) {
          return this._transformState.needTransform = false, c.prototype.push.call(this, e2, t2);
        }, u.prototype._transform = function(e2, t2, r2) {
          r2(new i("_transform()"));
        }, u.prototype._write = function(e2, t2, r2) {
          var n2 = this._transformState;
          if (n2.writecb = r2, n2.writechunk = e2, n2.writeencoding = t2, !n2.transforming) {
            var i2 = this._readableState;
            (n2.needTransform || i2.needReadable || i2.length < i2.highWaterMark) && this._read(i2.highWaterMark);
          }
        }, u.prototype._read = function(e2) {
          var t2 = this._transformState;
          t2.writechunk === null || t2.transforming ? t2.needTransform = true : (t2.transforming = true, this._transform(t2.writechunk, t2.writeencoding, t2.afterTransform));
        }, u.prototype._destroy = function(e2, t2) {
          c.prototype._destroy.call(this, e2, function(e3) {
            t2(e3);
          });
        };
      }, {"../errors": 37, "./_stream_duplex": 38, inherits: 21}], 42: [function(e, t, r) {
        (function(r2, n) {
          (function() {
            "use strict";
            function i(e2) {
              var t2 = this;
              this.next = null, this.entry = null, this.finish = function() {
                !function(e3, t3, r3) {
                  var n2 = e3.entry;
                  e3.entry = null;
                  for (; n2; ) {
                    var i2 = n2.callback;
                    t3.pendingcb--, i2(r3), n2 = n2.next;
                  }
                  t3.corkedRequestsFree.next = e3;
                }(t2, e2);
              };
            }
            var o;
            t.exports = I, I.WritableState = k;
            var s = {deprecate: e("util-deprecate")}, a = e("./internal/streams/stream"), c = e("buffer").Buffer, u = n.Uint8Array || function() {
            };
            var l, f = e("./internal/streams/destroy"), h = e("./internal/streams/state").getHighWaterMark, p = e("../errors").codes, d = p.ERR_INVALID_ARG_TYPE, g = p.ERR_METHOD_NOT_IMPLEMENTED, b = p.ERR_MULTIPLE_CALLBACK, m = p.ERR_STREAM_CANNOT_PIPE, y = p.ERR_STREAM_DESTROYED, _ = p.ERR_STREAM_NULL_VALUES, w = p.ERR_STREAM_WRITE_AFTER_END, v = p.ERR_UNKNOWN_ENCODING, S = f.errorOrDestroy;
            function E() {
            }
            function k(t2, n2, s2) {
              o = o || e("./_stream_duplex"), t2 = t2 || {}, typeof s2 != "boolean" && (s2 = n2 instanceof o), this.objectMode = !!t2.objectMode, s2 && (this.objectMode = this.objectMode || !!t2.writableObjectMode), this.highWaterMark = h(this, t2, "writableHighWaterMark", s2), this.finalCalled = false, this.needDrain = false, this.ending = false, this.ended = false, this.finished = false, this.destroyed = false;
              var a2 = t2.decodeStrings === false;
              this.decodeStrings = !a2, this.defaultEncoding = t2.defaultEncoding || "utf8", this.length = 0, this.writing = false, this.corked = 0, this.sync = true, this.bufferProcessing = false, this.onwrite = function(e2) {
                !function(e3, t3) {
                  var n3 = e3._writableState, i2 = n3.sync, o2 = n3.writecb;
                  if (typeof o2 != "function")
                    throw new b();
                  if (function(e4) {
                    e4.writing = false, e4.writecb = null, e4.length -= e4.writelen, e4.writelen = 0;
                  }(n3), t3)
                    !function(e4, t4, n4, i3, o3) {
                      --t4.pendingcb, n4 ? (r2.nextTick(o3, i3), r2.nextTick(x, e4, t4), e4._writableState.errorEmitted = true, S(e4, i3)) : (o3(i3), e4._writableState.errorEmitted = true, S(e4, i3), x(e4, t4));
                    }(e3, n3, i2, t3, o2);
                  else {
                    var s3 = R(n3) || e3.destroyed;
                    s3 || n3.corked || n3.bufferProcessing || !n3.bufferedRequest || A(e3, n3), i2 ? r2.nextTick(T, e3, n3, s3, o2) : T(e3, n3, s3, o2);
                  }
                }(n2, e2);
              }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = false, this.errorEmitted = false, this.emitClose = t2.emitClose !== false, this.autoDestroy = !!t2.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new i(this);
            }
            function I(t2) {
              var r3 = this instanceof (o = o || e("./_stream_duplex"));
              if (!r3 && !l.call(I, this))
                return new I(t2);
              this._writableState = new k(t2, this, r3), this.writable = true, t2 && (typeof t2.write == "function" && (this._write = t2.write), typeof t2.writev == "function" && (this._writev = t2.writev), typeof t2.destroy == "function" && (this._destroy = t2.destroy), typeof t2.final == "function" && (this._final = t2.final)), a.call(this);
            }
            function C(e2, t2, r3, n2, i2, o2, s2) {
              t2.writelen = n2, t2.writecb = s2, t2.writing = true, t2.sync = true, t2.destroyed ? t2.onwrite(new y("write")) : r3 ? e2._writev(i2, t2.onwrite) : e2._write(i2, o2, t2.onwrite), t2.sync = false;
            }
            function T(e2, t2, r3, n2) {
              r3 || function(e3, t3) {
                t3.length === 0 && t3.needDrain && (t3.needDrain = false, e3.emit("drain"));
              }(e2, t2), t2.pendingcb--, n2(), x(e2, t2);
            }
            function A(e2, t2) {
              t2.bufferProcessing = true;
              var r3 = t2.bufferedRequest;
              if (e2._writev && r3 && r3.next) {
                var n2 = t2.bufferedRequestCount, o2 = new Array(n2), s2 = t2.corkedRequestsFree;
                s2.entry = r3;
                for (var a2 = 0, c2 = true; r3; )
                  o2[a2] = r3, r3.isBuf || (c2 = false), r3 = r3.next, a2 += 1;
                o2.allBuffers = c2, C(e2, t2, true, t2.length, o2, "", s2.finish), t2.pendingcb++, t2.lastBufferedRequest = null, s2.next ? (t2.corkedRequestsFree = s2.next, s2.next = null) : t2.corkedRequestsFree = new i(t2), t2.bufferedRequestCount = 0;
              } else {
                for (; r3; ) {
                  var u2 = r3.chunk, l2 = r3.encoding, f2 = r3.callback;
                  if (C(e2, t2, false, t2.objectMode ? 1 : u2.length, u2, l2, f2), r3 = r3.next, t2.bufferedRequestCount--, t2.writing)
                    break;
                }
                r3 === null && (t2.lastBufferedRequest = null);
              }
              t2.bufferedRequest = r3, t2.bufferProcessing = false;
            }
            function R(e2) {
              return e2.ending && e2.length === 0 && e2.bufferedRequest === null && !e2.finished && !e2.writing;
            }
            function O(e2, t2) {
              e2._final(function(r3) {
                t2.pendingcb--, r3 && S(e2, r3), t2.prefinished = true, e2.emit("prefinish"), x(e2, t2);
              });
            }
            function x(e2, t2) {
              var n2 = R(t2);
              if (n2 && (function(e3, t3) {
                t3.prefinished || t3.finalCalled || (typeof e3._final != "function" || t3.destroyed ? (t3.prefinished = true, e3.emit("prefinish")) : (t3.pendingcb++, t3.finalCalled = true, r2.nextTick(O, e3, t3)));
              }(e2, t2), t2.pendingcb === 0 && (t2.finished = true, e2.emit("finish"), t2.autoDestroy))) {
                var i2 = e2._readableState;
                (!i2 || i2.autoDestroy && i2.endEmitted) && e2.destroy();
              }
              return n2;
            }
            e("inherits")(I, a), k.prototype.getBuffer = function() {
              for (var e2 = this.bufferedRequest, t2 = []; e2; )
                t2.push(e2), e2 = e2.next;
              return t2;
            }, function() {
              try {
                Object.defineProperty(k.prototype, "buffer", {get: s.deprecate(function() {
                  return this.getBuffer();
                }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")});
              } catch (e2) {
              }
            }(), typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (l = Function.prototype[Symbol.hasInstance], Object.defineProperty(I, Symbol.hasInstance, {value: function(e2) {
              return !!l.call(this, e2) || this === I && (e2 && e2._writableState instanceof k);
            }})) : l = function(e2) {
              return e2 instanceof this;
            }, I.prototype.pipe = function() {
              S(this, new m());
            }, I.prototype.write = function(e2, t2, n2) {
              var i2, o2 = this._writableState, s2 = false, a2 = !o2.objectMode && (i2 = e2, c.isBuffer(i2) || i2 instanceof u);
              return a2 && !c.isBuffer(e2) && (e2 = function(e3) {
                return c.from(e3);
              }(e2)), typeof t2 == "function" && (n2 = t2, t2 = null), a2 ? t2 = "buffer" : t2 || (t2 = o2.defaultEncoding), typeof n2 != "function" && (n2 = E), o2.ending ? function(e3, t3) {
                var n3 = new w();
                S(e3, n3), r2.nextTick(t3, n3);
              }(this, n2) : (a2 || function(e3, t3, n3, i3) {
                var o3;
                return n3 === null ? o3 = new _() : typeof n3 == "string" || t3.objectMode || (o3 = new d("chunk", ["string", "Buffer"], n3)), !o3 || (S(e3, o3), r2.nextTick(i3, o3), false);
              }(this, o2, e2, n2)) && (o2.pendingcb++, s2 = function(e3, t3, r3, n3, i3, o3) {
                if (!r3) {
                  var s3 = function(e4, t4, r4) {
                    e4.objectMode || e4.decodeStrings === false || typeof t4 != "string" || (t4 = c.from(t4, r4));
                    return t4;
                  }(t3, n3, i3);
                  n3 !== s3 && (r3 = true, i3 = "buffer", n3 = s3);
                }
                var a3 = t3.objectMode ? 1 : n3.length;
                t3.length += a3;
                var u2 = t3.length < t3.highWaterMark;
                u2 || (t3.needDrain = true);
                if (t3.writing || t3.corked) {
                  var l2 = t3.lastBufferedRequest;
                  t3.lastBufferedRequest = {chunk: n3, encoding: i3, isBuf: r3, callback: o3, next: null}, l2 ? l2.next = t3.lastBufferedRequest : t3.bufferedRequest = t3.lastBufferedRequest, t3.bufferedRequestCount += 1;
                } else
                  C(e3, t3, false, a3, n3, i3, o3);
                return u2;
              }(this, o2, a2, e2, t2, n2)), s2;
            }, I.prototype.cork = function() {
              this._writableState.corked++;
            }, I.prototype.uncork = function() {
              var e2 = this._writableState;
              e2.corked && (e2.corked--, e2.writing || e2.corked || e2.bufferProcessing || !e2.bufferedRequest || A(this, e2));
            }, I.prototype.setDefaultEncoding = function(e2) {
              if (typeof e2 == "string" && (e2 = e2.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e2 + "").toLowerCase()) > -1))
                throw new v(e2);
              return this._writableState.defaultEncoding = e2, this;
            }, Object.defineProperty(I.prototype, "writableBuffer", {enumerable: false, get: function() {
              return this._writableState && this._writableState.getBuffer();
            }}), Object.defineProperty(I.prototype, "writableHighWaterMark", {enumerable: false, get: function() {
              return this._writableState.highWaterMark;
            }}), I.prototype._write = function(e2, t2, r3) {
              r3(new g("_write()"));
            }, I.prototype._writev = null, I.prototype.end = function(e2, t2, n2) {
              var i2 = this._writableState;
              return typeof e2 == "function" ? (n2 = e2, e2 = null, t2 = null) : typeof t2 == "function" && (n2 = t2, t2 = null), e2 !== null && e2 !== void 0 && this.write(e2, t2), i2.corked && (i2.corked = 1, this.uncork()), i2.ending || function(e3, t3, n3) {
                t3.ending = true, x(e3, t3), n3 && (t3.finished ? r2.nextTick(n3) : e3.once("finish", n3));
                t3.ended = true, e3.writable = false;
              }(this, i2, n2), this;
            }, Object.defineProperty(I.prototype, "writableLength", {enumerable: false, get: function() {
              return this._writableState.length;
            }}), Object.defineProperty(I.prototype, "destroyed", {enumerable: false, get: function() {
              return this._writableState !== void 0 && this._writableState.destroyed;
            }, set: function(e2) {
              this._writableState && (this._writableState.destroyed = e2);
            }}), I.prototype.destroy = f.destroy, I.prototype._undestroy = f.undestroy, I.prototype._destroy = function(e2, t2) {
              t2(e2);
            };
          }).call(this);
        }).call(this, e("_process"), typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
      }, {"../errors": 37, "./_stream_duplex": 38, "./internal/streams/destroy": 45, "./internal/streams/state": 49, "./internal/streams/stream": 50, _process: 32, buffer: 14, inherits: 21, "util-deprecate": 58}], 43: [function(e, t, r) {
        (function(r2) {
          (function() {
            "use strict";
            var n;
            function i(e2, t2, r3) {
              return t2 in e2 ? Object.defineProperty(e2, t2, {value: r3, enumerable: true, configurable: true, writable: true}) : e2[t2] = r3, e2;
            }
            var o = e("./end-of-stream"), s = Symbol("lastResolve"), a = Symbol("lastReject"), c = Symbol("error"), u = Symbol("ended"), l = Symbol("lastPromise"), f = Symbol("handlePromise"), h = Symbol("stream");
            function p(e2, t2) {
              return {value: e2, done: t2};
            }
            function d(e2) {
              var t2 = e2[s];
              if (t2 !== null) {
                var r3 = e2[h].read();
                r3 !== null && (e2[l] = null, e2[s] = null, e2[a] = null, t2(p(r3, false)));
              }
            }
            var g = Object.getPrototypeOf(function() {
            }), b = Object.setPrototypeOf((i(n = {get stream() {
              return this[h];
            }, next: function() {
              var e2 = this, t2 = this[c];
              if (t2 !== null)
                return Promise.reject(t2);
              if (this[u])
                return Promise.resolve(p(void 0, true));
              if (this[h].destroyed)
                return new Promise(function(t3, n3) {
                  r2.nextTick(function() {
                    e2[c] ? n3(e2[c]) : t3(p(void 0, true));
                  });
                });
              var n2, i2 = this[l];
              if (i2)
                n2 = new Promise(function(e3, t3) {
                  return function(r3, n3) {
                    e3.then(function() {
                      t3[u] ? r3(p(void 0, true)) : t3[f](r3, n3);
                    }, n3);
                  };
                }(i2, this));
              else {
                var o2 = this[h].read();
                if (o2 !== null)
                  return Promise.resolve(p(o2, false));
                n2 = new Promise(this[f]);
              }
              return this[l] = n2, n2;
            }}, Symbol.asyncIterator, function() {
              return this;
            }), i(n, "return", function() {
              var e2 = this;
              return new Promise(function(t2, r3) {
                e2[h].destroy(null, function(e3) {
                  e3 ? r3(e3) : t2(p(void 0, true));
                });
              });
            }), n), g);
            t.exports = function(e2) {
              var t2, n2 = Object.create(b, (i(t2 = {}, h, {value: e2, writable: true}), i(t2, s, {value: null, writable: true}), i(t2, a, {value: null, writable: true}), i(t2, c, {value: null, writable: true}), i(t2, u, {value: e2._readableState.endEmitted, writable: true}), i(t2, f, {value: function(e3, t3) {
                var r3 = n2[h].read();
                r3 ? (n2[l] = null, n2[s] = null, n2[a] = null, e3(p(r3, false))) : (n2[s] = e3, n2[a] = t3);
              }, writable: true}), t2));
              return n2[l] = null, o(e2, function(e3) {
                if (e3 && e3.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                  var t3 = n2[a];
                  return t3 !== null && (n2[l] = null, n2[s] = null, n2[a] = null, t3(e3)), void (n2[c] = e3);
                }
                var r3 = n2[s];
                r3 !== null && (n2[l] = null, n2[s] = null, n2[a] = null, r3(p(void 0, true))), n2[u] = true;
              }), e2.on("readable", function(e3) {
                r2.nextTick(d, e3);
              }.bind(null, n2)), n2;
            };
          }).call(this);
        }).call(this, e("_process"));
      }, {"./end-of-stream": 46, _process: 32}], 44: [function(e, t, r) {
        "use strict";
        function n(e2, t2) {
          var r2 = Object.keys(e2);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e2);
            t2 && (n2 = n2.filter(function(t3) {
              return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
            })), r2.push.apply(r2, n2);
          }
          return r2;
        }
        function i(e2, t2, r2) {
          return t2 in e2 ? Object.defineProperty(e2, t2, {value: r2, enumerable: true, configurable: true, writable: true}) : e2[t2] = r2, e2;
        }
        function o(e2, t2) {
          for (var r2 = 0; r2 < t2.length; r2++) {
            var n2 = t2[r2];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
          }
        }
        var s = e("buffer").Buffer, a = e("util").inspect, c = a && a.custom || "inspect";
        t.exports = function() {
          function e2() {
            !function(e3, t3) {
              if (!(e3 instanceof t3))
                throw new TypeError("Cannot call a class as a function");
            }(this, e2), this.head = null, this.tail = null, this.length = 0;
          }
          var t2, r2, u;
          return t2 = e2, (r2 = [{key: "push", value: function(e3) {
            var t3 = {data: e3, next: null};
            this.length > 0 ? this.tail.next = t3 : this.head = t3, this.tail = t3, ++this.length;
          }}, {key: "unshift", value: function(e3) {
            var t3 = {data: e3, next: this.head};
            this.length === 0 && (this.tail = t3), this.head = t3, ++this.length;
          }}, {key: "shift", value: function() {
            if (this.length !== 0) {
              var e3 = this.head.data;
              return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, e3;
            }
          }}, {key: "clear", value: function() {
            this.head = this.tail = null, this.length = 0;
          }}, {key: "join", value: function(e3) {
            if (this.length === 0)
              return "";
            for (var t3 = this.head, r3 = "" + t3.data; t3 = t3.next; )
              r3 += e3 + t3.data;
            return r3;
          }}, {key: "concat", value: function(e3) {
            if (this.length === 0)
              return s.alloc(0);
            for (var t3, r3, n2, i2 = s.allocUnsafe(e3 >>> 0), o2 = this.head, a2 = 0; o2; )
              t3 = o2.data, r3 = i2, n2 = a2, s.prototype.copy.call(t3, r3, n2), a2 += o2.data.length, o2 = o2.next;
            return i2;
          }}, {key: "consume", value: function(e3, t3) {
            var r3;
            return e3 < this.head.data.length ? (r3 = this.head.data.slice(0, e3), this.head.data = this.head.data.slice(e3)) : r3 = e3 === this.head.data.length ? this.shift() : t3 ? this._getString(e3) : this._getBuffer(e3), r3;
          }}, {key: "first", value: function() {
            return this.head.data;
          }}, {key: "_getString", value: function(e3) {
            var t3 = this.head, r3 = 1, n2 = t3.data;
            for (e3 -= n2.length; t3 = t3.next; ) {
              var i2 = t3.data, o2 = e3 > i2.length ? i2.length : e3;
              if (o2 === i2.length ? n2 += i2 : n2 += i2.slice(0, e3), (e3 -= o2) === 0) {
                o2 === i2.length ? (++r3, t3.next ? this.head = t3.next : this.head = this.tail = null) : (this.head = t3, t3.data = i2.slice(o2));
                break;
              }
              ++r3;
            }
            return this.length -= r3, n2;
          }}, {key: "_getBuffer", value: function(e3) {
            var t3 = s.allocUnsafe(e3), r3 = this.head, n2 = 1;
            for (r3.data.copy(t3), e3 -= r3.data.length; r3 = r3.next; ) {
              var i2 = r3.data, o2 = e3 > i2.length ? i2.length : e3;
              if (i2.copy(t3, t3.length - e3, 0, o2), (e3 -= o2) === 0) {
                o2 === i2.length ? (++n2, r3.next ? this.head = r3.next : this.head = this.tail = null) : (this.head = r3, r3.data = i2.slice(o2));
                break;
              }
              ++n2;
            }
            return this.length -= n2, t3;
          }}, {key: c, value: function(e3, t3) {
            return a(this, function(e4) {
              for (var t4 = 1; t4 < arguments.length; t4++) {
                var r3 = arguments[t4] != null ? arguments[t4] : {};
                t4 % 2 ? n(Object(r3), true).forEach(function(t5) {
                  i(e4, t5, r3[t5]);
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : n(Object(r3)).forEach(function(t5) {
                  Object.defineProperty(e4, t5, Object.getOwnPropertyDescriptor(r3, t5));
                });
              }
              return e4;
            }({}, t3, {depth: 0, customInspect: false}));
          }}]) && o(t2.prototype, r2), u && o(t2, u), e2;
        }();
      }, {buffer: 14, util: 13}], 45: [function(e, t, r) {
        (function(e2) {
          (function() {
            "use strict";
            function r2(e3, t2) {
              i(e3, t2), n(e3);
            }
            function n(e3) {
              e3._writableState && !e3._writableState.emitClose || e3._readableState && !e3._readableState.emitClose || e3.emit("close");
            }
            function i(e3, t2) {
              e3.emit("error", t2);
            }
            t.exports = {destroy: function(t2, o) {
              var s = this, a = this._readableState && this._readableState.destroyed, c = this._writableState && this._writableState.destroyed;
              return a || c ? (o ? o(t2) : t2 && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = true, e2.nextTick(i, this, t2)) : e2.nextTick(i, this, t2)), this) : (this._readableState && (this._readableState.destroyed = true), this._writableState && (this._writableState.destroyed = true), this._destroy(t2 || null, function(t3) {
                !o && t3 ? s._writableState ? s._writableState.errorEmitted ? e2.nextTick(n, s) : (s._writableState.errorEmitted = true, e2.nextTick(r2, s, t3)) : e2.nextTick(r2, s, t3) : o ? (e2.nextTick(n, s), o(t3)) : e2.nextTick(n, s);
              }), this);
            }, undestroy: function() {
              this._readableState && (this._readableState.destroyed = false, this._readableState.reading = false, this._readableState.ended = false, this._readableState.endEmitted = false), this._writableState && (this._writableState.destroyed = false, this._writableState.ended = false, this._writableState.ending = false, this._writableState.finalCalled = false, this._writableState.prefinished = false, this._writableState.finished = false, this._writableState.errorEmitted = false);
            }, errorOrDestroy: function(e3, t2) {
              var r3 = e3._readableState, n2 = e3._writableState;
              r3 && r3.autoDestroy || n2 && n2.autoDestroy ? e3.destroy(t2) : e3.emit("error", t2);
            }};
          }).call(this);
        }).call(this, e("_process"));
      }, {_process: 32}], 46: [function(e, t, r) {
        "use strict";
        var n = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
        function i() {
        }
        t.exports = function e2(t2, r2, o) {
          if (typeof r2 == "function")
            return e2(t2, null, r2);
          r2 || (r2 = {}), o = function(e3) {
            var t3 = false;
            return function() {
              if (!t3) {
                t3 = true;
                for (var r3 = arguments.length, n2 = new Array(r3), i2 = 0; i2 < r3; i2++)
                  n2[i2] = arguments[i2];
                e3.apply(this, n2);
              }
            };
          }(o || i);
          var s = r2.readable || r2.readable !== false && t2.readable, a = r2.writable || r2.writable !== false && t2.writable, c = function() {
            t2.writable || l();
          }, u = t2._writableState && t2._writableState.finished, l = function() {
            a = false, u = true, s || o.call(t2);
          }, f = t2._readableState && t2._readableState.endEmitted, h = function() {
            s = false, f = true, a || o.call(t2);
          }, p = function(e3) {
            o.call(t2, e3);
          }, d = function() {
            var e3;
            return s && !f ? (t2._readableState && t2._readableState.ended || (e3 = new n()), o.call(t2, e3)) : a && !u ? (t2._writableState && t2._writableState.ended || (e3 = new n()), o.call(t2, e3)) : void 0;
          }, g = function() {
            t2.req.on("finish", l);
          };
          return function(e3) {
            return e3.setHeader && typeof e3.abort == "function";
          }(t2) ? (t2.on("complete", l), t2.on("abort", d), t2.req ? g() : t2.on("request", g)) : a && !t2._writableState && (t2.on("end", c), t2.on("close", c)), t2.on("end", h), t2.on("finish", l), r2.error !== false && t2.on("error", p), t2.on("close", d), function() {
            t2.removeListener("complete", l), t2.removeListener("abort", d), t2.removeListener("request", g), t2.req && t2.req.removeListener("finish", l), t2.removeListener("end", c), t2.removeListener("close", c), t2.removeListener("finish", l), t2.removeListener("end", h), t2.removeListener("error", p), t2.removeListener("close", d);
          };
        };
      }, {"../../../errors": 37}], 47: [function(e, t, r) {
        t.exports = function() {
          throw new Error("Readable.from is not available in the browser");
        };
      }, {}], 48: [function(e, t, r) {
        "use strict";
        var n;
        var i = e("../../../errors").codes, o = i.ERR_MISSING_ARGS, s = i.ERR_STREAM_DESTROYED;
        function a(e2) {
          if (e2)
            throw e2;
        }
        function c(e2) {
          e2();
        }
        function u(e2, t2) {
          return e2.pipe(t2);
        }
        t.exports = function() {
          for (var t2 = arguments.length, r2 = new Array(t2), i2 = 0; i2 < t2; i2++)
            r2[i2] = arguments[i2];
          var l, f = function(e2) {
            return e2.length ? typeof e2[e2.length - 1] != "function" ? a : e2.pop() : a;
          }(r2);
          if (Array.isArray(r2[0]) && (r2 = r2[0]), r2.length < 2)
            throw new o("streams");
          var h = r2.map(function(t3, i3) {
            var o2 = i3 < r2.length - 1;
            return function(t4, r3, i4, o3) {
              o3 = function(e2) {
                var t5 = false;
                return function() {
                  t5 || (t5 = true, e2.apply(void 0, arguments));
                };
              }(o3);
              var a2 = false;
              t4.on("close", function() {
                a2 = true;
              }), n === void 0 && (n = e("./end-of-stream")), n(t4, {readable: r3, writable: i4}, function(e2) {
                if (e2)
                  return o3(e2);
                a2 = true, o3();
              });
              var c2 = false;
              return function(e2) {
                if (!a2 && !c2)
                  return c2 = true, function(e3) {
                    return e3.setHeader && typeof e3.abort == "function";
                  }(t4) ? t4.abort() : typeof t4.destroy == "function" ? t4.destroy() : void o3(e2 || new s("pipe"));
              };
            }(t3, o2, i3 > 0, function(e2) {
              l || (l = e2), e2 && h.forEach(c), o2 || (h.forEach(c), f(l));
            });
          });
          return r2.reduce(u);
        };
      }, {"../../../errors": 37, "./end-of-stream": 46}], 49: [function(e, t, r) {
        "use strict";
        var n = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
        t.exports = {getHighWaterMark: function(e2, t2, r2, i) {
          var o = function(e3, t3, r3) {
            return e3.highWaterMark != null ? e3.highWaterMark : t3 ? e3[r3] : null;
          }(t2, i, r2);
          if (o != null) {
            if (!isFinite(o) || Math.floor(o) !== o || o < 0)
              throw new n(i ? r2 : "highWaterMark", o);
            return Math.floor(o);
          }
          return e2.objectMode ? 16 : 16384;
        }};
      }, {"../../../errors": 37}], 50: [function(e, t, r) {
        t.exports = e("events").EventEmitter;
      }, {events: 19}], 51: [function(e, t, r) {
        (r = t.exports = e("./lib/_stream_readable.js")).Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"), r.finished = e("./lib/internal/streams/end-of-stream.js"), r.pipeline = e("./lib/internal/streams/pipeline.js");
      }, {"./lib/_stream_duplex.js": 38, "./lib/_stream_passthrough.js": 39, "./lib/_stream_readable.js": 40, "./lib/_stream_transform.js": 41, "./lib/_stream_writable.js": 42, "./lib/internal/streams/end-of-stream.js": 46, "./lib/internal/streams/pipeline.js": 48}], 52: [function(e, t, r) {
        "use strict";
        t.exports = function() {
          if (typeof arguments[0] != "function")
            throw new Error("callback needed");
          if (typeof arguments[1] != "number")
            throw new Error("interval needed");
          var e2;
          if (arguments.length > 0) {
            e2 = new Array(arguments.length - 2);
            for (var t2 = 0; t2 < e2.length; t2++)
              e2[t2] = arguments[t2 + 2];
          }
          return new function(e3, t3, r2) {
            var n = this;
            this._callback = e3, this._args = r2, this._interval = setInterval(e3, t3, this._args), this.reschedule = function(e4) {
              e4 || (e4 = n._interval), n._interval && clearInterval(n._interval), n._interval = setInterval(n._callback, e4, n._args);
            }, this.clear = function() {
              n._interval && (clearInterval(n._interval), n._interval = void 0);
            }, this.destroy = function() {
              n._interval && clearInterval(n._interval), n._callback = void 0, n._interval = void 0, n._args = void 0;
            };
          }(arguments[0], arguments[1], e2);
        };
      }, {}], 53: [function(e, t, r) {
        var n = e("buffer"), i = n.Buffer;
        function o(e2, t2) {
          for (var r2 in e2)
            t2[r2] = e2[r2];
        }
        function s(e2, t2, r2) {
          return i(e2, t2, r2);
        }
        i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r), r.Buffer = s), s.prototype = Object.create(i.prototype), o(i, s), s.from = function(e2, t2, r2) {
          if (typeof e2 == "number")
            throw new TypeError("Argument must not be a number");
          return i(e2, t2, r2);
        }, s.alloc = function(e2, t2, r2) {
          if (typeof e2 != "number")
            throw new TypeError("Argument must be a number");
          var n2 = i(e2);
          return t2 !== void 0 ? typeof r2 == "string" ? n2.fill(t2, r2) : n2.fill(t2) : n2.fill(0), n2;
        }, s.allocUnsafe = function(e2) {
          if (typeof e2 != "number")
            throw new TypeError("Argument must be a number");
          return i(e2);
        }, s.allocUnsafeSlow = function(e2) {
          if (typeof e2 != "number")
            throw new TypeError("Argument must be a number");
          return n.SlowBuffer(e2);
        };
      }, {buffer: 14}], 54: [function(e, t, r) {
        t.exports = function(e2) {
          var t2 = e2._readableState;
          return t2 ? t2.objectMode || typeof e2._duplexState == "number" ? e2.read() : e2.read((r2 = t2, r2.buffer.length ? r2.buffer.head ? r2.buffer.head.data.length : r2.buffer[0].length : r2.length)) : null;
          var r2;
        };
      }, {}], 55: [function(e, t, r) {
        "use strict";
        var n = e("safe-buffer").Buffer, i = n.isEncoding || function(e2) {
          switch ((e2 = "" + e2) && e2.toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
              return true;
            default:
              return false;
          }
        };
        function o(e2) {
          var t2;
          switch (this.encoding = function(e3) {
            var t3 = function(e4) {
              if (!e4)
                return "utf8";
              for (var t4; ; )
                switch (e4) {
                  case "utf8":
                  case "utf-8":
                    return "utf8";
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return "utf16le";
                  case "latin1":
                  case "binary":
                    return "latin1";
                  case "base64":
                  case "ascii":
                  case "hex":
                    return e4;
                  default:
                    if (t4)
                      return;
                    e4 = ("" + e4).toLowerCase(), t4 = true;
                }
            }(e3);
            if (typeof t3 != "string" && (n.isEncoding === i || !i(e3)))
              throw new Error("Unknown encoding: " + e3);
            return t3 || e3;
          }(e2), this.encoding) {
            case "utf16le":
              this.text = c, this.end = u, t2 = 4;
              break;
            case "utf8":
              this.fillLast = a, t2 = 4;
              break;
            case "base64":
              this.text = l, this.end = f, t2 = 3;
              break;
            default:
              return this.write = h, void (this.end = p);
          }
          this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t2);
        }
        function s(e2) {
          return e2 <= 127 ? 0 : e2 >> 5 == 6 ? 2 : e2 >> 4 == 14 ? 3 : e2 >> 3 == 30 ? 4 : e2 >> 6 == 2 ? -1 : -2;
        }
        function a(e2) {
          var t2 = this.lastTotal - this.lastNeed, r2 = function(e3, t3, r3) {
            if ((192 & t3[0]) != 128)
              return e3.lastNeed = 0, "\uFFFD";
            if (e3.lastNeed > 1 && t3.length > 1) {
              if ((192 & t3[1]) != 128)
                return e3.lastNeed = 1, "\uFFFD";
              if (e3.lastNeed > 2 && t3.length > 2 && (192 & t3[2]) != 128)
                return e3.lastNeed = 2, "\uFFFD";
            }
          }(this, e2);
          return r2 !== void 0 ? r2 : this.lastNeed <= e2.length ? (e2.copy(this.lastChar, t2, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e2.copy(this.lastChar, t2, 0, e2.length), void (this.lastNeed -= e2.length));
        }
        function c(e2, t2) {
          if ((e2.length - t2) % 2 == 0) {
            var r2 = e2.toString("utf16le", t2);
            if (r2) {
              var n2 = r2.charCodeAt(r2.length - 1);
              if (n2 >= 55296 && n2 <= 56319)
                return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e2[e2.length - 2], this.lastChar[1] = e2[e2.length - 1], r2.slice(0, -1);
            }
            return r2;
          }
          return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e2[e2.length - 1], e2.toString("utf16le", t2, e2.length - 1);
        }
        function u(e2) {
          var t2 = e2 && e2.length ? this.write(e2) : "";
          if (this.lastNeed) {
            var r2 = this.lastTotal - this.lastNeed;
            return t2 + this.lastChar.toString("utf16le", 0, r2);
          }
          return t2;
        }
        function l(e2, t2) {
          var r2 = (e2.length - t2) % 3;
          return r2 === 0 ? e2.toString("base64", t2) : (this.lastNeed = 3 - r2, this.lastTotal = 3, r2 === 1 ? this.lastChar[0] = e2[e2.length - 1] : (this.lastChar[0] = e2[e2.length - 2], this.lastChar[1] = e2[e2.length - 1]), e2.toString("base64", t2, e2.length - r2));
        }
        function f(e2) {
          var t2 = e2 && e2.length ? this.write(e2) : "";
          return this.lastNeed ? t2 + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t2;
        }
        function h(e2) {
          return e2.toString(this.encoding);
        }
        function p(e2) {
          return e2 && e2.length ? this.write(e2) : "";
        }
        r.StringDecoder = o, o.prototype.write = function(e2) {
          if (e2.length === 0)
            return "";
          var t2, r2;
          if (this.lastNeed) {
            if ((t2 = this.fillLast(e2)) === void 0)
              return "";
            r2 = this.lastNeed, this.lastNeed = 0;
          } else
            r2 = 0;
          return r2 < e2.length ? t2 ? t2 + this.text(e2, r2) : this.text(e2, r2) : t2 || "";
        }, o.prototype.end = function(e2) {
          var t2 = e2 && e2.length ? this.write(e2) : "";
          return this.lastNeed ? t2 + "\uFFFD" : t2;
        }, o.prototype.text = function(e2, t2) {
          var r2 = function(e3, t3, r3) {
            var n3 = t3.length - 1;
            if (n3 < r3)
              return 0;
            var i2 = s(t3[n3]);
            if (i2 >= 0)
              return i2 > 0 && (e3.lastNeed = i2 - 1), i2;
            if (--n3 < r3 || i2 === -2)
              return 0;
            if ((i2 = s(t3[n3])) >= 0)
              return i2 > 0 && (e3.lastNeed = i2 - 2), i2;
            if (--n3 < r3 || i2 === -2)
              return 0;
            if ((i2 = s(t3[n3])) >= 0)
              return i2 > 0 && (i2 === 2 ? i2 = 0 : e3.lastNeed = i2 - 3), i2;
            return 0;
          }(this, e2, t2);
          if (!this.lastNeed)
            return e2.toString("utf8", t2);
          this.lastTotal = r2;
          var n2 = e2.length - (r2 - this.lastNeed);
          return e2.copy(this.lastChar, 0, n2), e2.toString("utf8", t2, n2);
        }, o.prototype.fillLast = function(e2) {
          if (this.lastNeed <= e2.length)
            return e2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
          e2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e2.length), this.lastNeed -= e2.length;
        };
      }, {"safe-buffer": 53}], 56: [function(e, t, r) {
        "use strict";
        var n = e("punycode"), i = e("./util");
        function o() {
          this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
        }
        r.parse = _, r.resolve = function(e2, t2) {
          return _(e2, false, true).resolve(t2);
        }, r.resolveObject = function(e2, t2) {
          return e2 ? _(e2, false, true).resolveObject(t2) : t2;
        }, r.format = function(e2) {
          i.isString(e2) && (e2 = _(e2));
          return e2 instanceof o ? e2.format() : o.prototype.format.call(e2);
        }, r.Url = o;
        var s = /^([a-z0-9.+-]+:)/i, a = /:[0-9]*$/, c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, u = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "	"]), l = ["'"].concat(u), f = ["%", "/", "?", ";", "#"].concat(l), h = ["/", "?", "#"], p = /^[+a-z0-9A-Z_-]{0,63}$/, d = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, g = {javascript: true, "javascript:": true}, b = {javascript: true, "javascript:": true}, m = {http: true, https: true, ftp: true, gopher: true, file: true, "http:": true, "https:": true, "ftp:": true, "gopher:": true, "file:": true}, y = e("querystring");
        function _(e2, t2, r2) {
          if (e2 && i.isObject(e2) && e2 instanceof o)
            return e2;
          var n2 = new o();
          return n2.parse(e2, t2, r2), n2;
        }
        o.prototype.parse = function(e2, t2, r2) {
          if (!i.isString(e2))
            throw new TypeError("Parameter 'url' must be a string, not " + typeof e2);
          var o2 = e2.indexOf("?"), a2 = o2 !== -1 && o2 < e2.indexOf("#") ? "?" : "#", u2 = e2.split(a2);
          u2[0] = u2[0].replace(/\\/g, "/");
          var _2 = e2 = u2.join(a2);
          if (_2 = _2.trim(), !r2 && e2.split("#").length === 1) {
            var w = c.exec(_2);
            if (w)
              return this.path = _2, this.href = _2, this.pathname = w[1], w[2] ? (this.search = w[2], this.query = t2 ? y.parse(this.search.substr(1)) : this.search.substr(1)) : t2 && (this.search = "", this.query = {}), this;
          }
          var v = s.exec(_2);
          if (v) {
            var S = (v = v[0]).toLowerCase();
            this.protocol = S, _2 = _2.substr(v.length);
          }
          if (r2 || v || _2.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            var E = _2.substr(0, 2) === "//";
            !E || v && b[v] || (_2 = _2.substr(2), this.slashes = true);
          }
          if (!b[v] && (E || v && !m[v])) {
            for (var k, I, C = -1, T = 0; T < h.length; T++) {
              (A = _2.indexOf(h[T])) !== -1 && (C === -1 || A < C) && (C = A);
            }
            (I = C === -1 ? _2.lastIndexOf("@") : _2.lastIndexOf("@", C)) !== -1 && (k = _2.slice(0, I), _2 = _2.slice(I + 1), this.auth = decodeURIComponent(k)), C = -1;
            for (T = 0; T < f.length; T++) {
              var A;
              (A = _2.indexOf(f[T])) !== -1 && (C === -1 || A < C) && (C = A);
            }
            C === -1 && (C = _2.length), this.host = _2.slice(0, C), _2 = _2.slice(C), this.parseHost(), this.hostname = this.hostname || "";
            var R = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
            if (!R)
              for (var O = this.hostname.split(/\./), x = (T = 0, O.length); T < x; T++) {
                var P = O[T];
                if (P && !P.match(p)) {
                  for (var M = "", L = 0, B = P.length; L < B; L++)
                    P.charCodeAt(L) > 127 ? M += "x" : M += P[L];
                  if (!M.match(p)) {
                    var N = O.slice(0, T), U = O.slice(T + 1), j = P.match(d);
                    j && (N.push(j[1]), U.unshift(j[2])), U.length && (_2 = "/" + U.join(".") + _2), this.hostname = N.join(".");
                    break;
                  }
                }
              }
            this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), R || (this.hostname = n.toASCII(this.hostname));
            var q = this.port ? ":" + this.port : "", D = this.hostname || "";
            this.host = D + q, this.href += this.host, R && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), _2[0] !== "/" && (_2 = "/" + _2));
          }
          if (!g[S])
            for (T = 0, x = l.length; T < x; T++) {
              var F = l[T];
              if (_2.indexOf(F) !== -1) {
                var V = encodeURIComponent(F);
                V === F && (V = escape(F)), _2 = _2.split(F).join(V);
              }
            }
          var W = _2.indexOf("#");
          W !== -1 && (this.hash = _2.substr(W), _2 = _2.slice(0, W));
          var H = _2.indexOf("?");
          if (H !== -1 ? (this.search = _2.substr(H), this.query = _2.substr(H + 1), t2 && (this.query = y.parse(this.query)), _2 = _2.slice(0, H)) : t2 && (this.search = "", this.query = {}), _2 && (this.pathname = _2), m[S] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
            q = this.pathname || "";
            var K = this.search || "";
            this.path = q + K;
          }
          return this.href = this.format(), this;
        }, o.prototype.format = function() {
          var e2 = this.auth || "";
          e2 && (e2 = (e2 = encodeURIComponent(e2)).replace(/%3A/i, ":"), e2 += "@");
          var t2 = this.protocol || "", r2 = this.pathname || "", n2 = this.hash || "", o2 = false, s2 = "";
          this.host ? o2 = e2 + this.host : this.hostname && (o2 = e2 + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (o2 += ":" + this.port)), this.query && i.isObject(this.query) && Object.keys(this.query).length && (s2 = y.stringify(this.query));
          var a2 = this.search || s2 && "?" + s2 || "";
          return t2 && t2.substr(-1) !== ":" && (t2 += ":"), this.slashes || (!t2 || m[t2]) && o2 !== false ? (o2 = "//" + (o2 || ""), r2 && r2.charAt(0) !== "/" && (r2 = "/" + r2)) : o2 || (o2 = ""), n2 && n2.charAt(0) !== "#" && (n2 = "#" + n2), a2 && a2.charAt(0) !== "?" && (a2 = "?" + a2), t2 + o2 + (r2 = r2.replace(/[?#]/g, function(e3) {
            return encodeURIComponent(e3);
          })) + (a2 = a2.replace("#", "%23")) + n2;
        }, o.prototype.resolve = function(e2) {
          return this.resolveObject(_(e2, false, true)).format();
        }, o.prototype.resolveObject = function(e2) {
          if (i.isString(e2)) {
            var t2 = new o();
            t2.parse(e2, false, true), e2 = t2;
          }
          for (var r2 = new o(), n2 = Object.keys(this), s2 = 0; s2 < n2.length; s2++) {
            var a2 = n2[s2];
            r2[a2] = this[a2];
          }
          if (r2.hash = e2.hash, e2.href === "")
            return r2.href = r2.format(), r2;
          if (e2.slashes && !e2.protocol) {
            for (var c2 = Object.keys(e2), u2 = 0; u2 < c2.length; u2++) {
              var l2 = c2[u2];
              l2 !== "protocol" && (r2[l2] = e2[l2]);
            }
            return m[r2.protocol] && r2.hostname && !r2.pathname && (r2.path = r2.pathname = "/"), r2.href = r2.format(), r2;
          }
          if (e2.protocol && e2.protocol !== r2.protocol) {
            if (!m[e2.protocol]) {
              for (var f2 = Object.keys(e2), h2 = 0; h2 < f2.length; h2++) {
                var p2 = f2[h2];
                r2[p2] = e2[p2];
              }
              return r2.href = r2.format(), r2;
            }
            if (r2.protocol = e2.protocol, e2.host || b[e2.protocol])
              r2.pathname = e2.pathname;
            else {
              for (var d2 = (e2.pathname || "").split("/"); d2.length && !(e2.host = d2.shift()); )
                ;
              e2.host || (e2.host = ""), e2.hostname || (e2.hostname = ""), d2[0] !== "" && d2.unshift(""), d2.length < 2 && d2.unshift(""), r2.pathname = d2.join("/");
            }
            if (r2.search = e2.search, r2.query = e2.query, r2.host = e2.host || "", r2.auth = e2.auth, r2.hostname = e2.hostname || e2.host, r2.port = e2.port, r2.pathname || r2.search) {
              var g2 = r2.pathname || "", y2 = r2.search || "";
              r2.path = g2 + y2;
            }
            return r2.slashes = r2.slashes || e2.slashes, r2.href = r2.format(), r2;
          }
          var _2 = r2.pathname && r2.pathname.charAt(0) === "/", w = e2.host || e2.pathname && e2.pathname.charAt(0) === "/", v = w || _2 || r2.host && e2.pathname, S = v, E = r2.pathname && r2.pathname.split("/") || [], k = (d2 = e2.pathname && e2.pathname.split("/") || [], r2.protocol && !m[r2.protocol]);
          if (k && (r2.hostname = "", r2.port = null, r2.host && (E[0] === "" ? E[0] = r2.host : E.unshift(r2.host)), r2.host = "", e2.protocol && (e2.hostname = null, e2.port = null, e2.host && (d2[0] === "" ? d2[0] = e2.host : d2.unshift(e2.host)), e2.host = null), v = v && (d2[0] === "" || E[0] === "")), w)
            r2.host = e2.host || e2.host === "" ? e2.host : r2.host, r2.hostname = e2.hostname || e2.hostname === "" ? e2.hostname : r2.hostname, r2.search = e2.search, r2.query = e2.query, E = d2;
          else if (d2.length)
            E || (E = []), E.pop(), E = E.concat(d2), r2.search = e2.search, r2.query = e2.query;
          else if (!i.isNullOrUndefined(e2.search)) {
            if (k)
              r2.hostname = r2.host = E.shift(), (R = !!(r2.host && r2.host.indexOf("@") > 0) && r2.host.split("@")) && (r2.auth = R.shift(), r2.host = r2.hostname = R.shift());
            return r2.search = e2.search, r2.query = e2.query, i.isNull(r2.pathname) && i.isNull(r2.search) || (r2.path = (r2.pathname ? r2.pathname : "") + (r2.search ? r2.search : "")), r2.href = r2.format(), r2;
          }
          if (!E.length)
            return r2.pathname = null, r2.search ? r2.path = "/" + r2.search : r2.path = null, r2.href = r2.format(), r2;
          for (var I = E.slice(-1)[0], C = (r2.host || e2.host || E.length > 1) && (I === "." || I === "..") || I === "", T = 0, A = E.length; A >= 0; A--)
            (I = E[A]) === "." ? E.splice(A, 1) : I === ".." ? (E.splice(A, 1), T++) : T && (E.splice(A, 1), T--);
          if (!v && !S)
            for (; T--; T)
              E.unshift("..");
          !v || E[0] === "" || E[0] && E[0].charAt(0) === "/" || E.unshift(""), C && E.join("/").substr(-1) !== "/" && E.push("");
          var R, O = E[0] === "" || E[0] && E[0].charAt(0) === "/";
          k && (r2.hostname = r2.host = O ? "" : E.length ? E.shift() : "", (R = !!(r2.host && r2.host.indexOf("@") > 0) && r2.host.split("@")) && (r2.auth = R.shift(), r2.host = r2.hostname = R.shift()));
          return (v = v || r2.host && E.length) && !O && E.unshift(""), E.length ? r2.pathname = E.join("/") : (r2.pathname = null, r2.path = null), i.isNull(r2.pathname) && i.isNull(r2.search) || (r2.path = (r2.pathname ? r2.pathname : "") + (r2.search ? r2.search : "")), r2.auth = e2.auth || r2.auth, r2.slashes = r2.slashes || e2.slashes, r2.href = r2.format(), r2;
        }, o.prototype.parseHost = function() {
          var e2 = this.host, t2 = a.exec(e2);
          t2 && ((t2 = t2[0]) !== ":" && (this.port = t2.substr(1)), e2 = e2.substr(0, e2.length - t2.length)), e2 && (this.hostname = e2);
        };
      }, {"./util": 57, punycode: 33, querystring: 36}], 57: [function(e, t, r) {
        "use strict";
        t.exports = {isString: function(e2) {
          return typeof e2 == "string";
        }, isObject: function(e2) {
          return typeof e2 == "object" && e2 !== null;
        }, isNull: function(e2) {
          return e2 === null;
        }, isNullOrUndefined: function(e2) {
          return e2 == null;
        }};
      }, {}], 58: [function(e, t, r) {
        (function(e2) {
          (function() {
            function r2(t2) {
              try {
                if (!e2.localStorage)
                  return false;
              } catch (e3) {
                return false;
              }
              var r3 = e2.localStorage[t2];
              return r3 != null && String(r3).toLowerCase() === "true";
            }
            t.exports = function(e3, t2) {
              if (r2("noDeprecation"))
                return e3;
              var n = false;
              return function() {
                if (!n) {
                  if (r2("throwDeprecation"))
                    throw new Error(t2);
                  r2("traceDeprecation") ? console.trace(t2) : console.warn(t2), n = true;
                }
                return e3.apply(this, arguments);
              };
            };
          }).call(this);
        }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
      }, {}], 59: [function(e, t, r) {
        t.exports = function e2(t2, r2) {
          if (t2 && r2)
            return e2(t2)(r2);
          if (typeof t2 != "function")
            throw new TypeError("need wrapper function");
          Object.keys(t2).forEach(function(e3) {
            n[e3] = t2[e3];
          });
          return n;
          function n() {
            for (var e3 = new Array(arguments.length), r3 = 0; r3 < e3.length; r3++)
              e3[r3] = arguments[r3];
            var n2 = t2.apply(this, e3), i = e3[e3.length - 1];
            return typeof n2 == "function" && n2 !== i && Object.keys(i).forEach(function(e4) {
              n2[e4] = i[e4];
            }), n2;
          }
        };
      }, {}], 60: [function(e, t, r) {
        "use strict";
        t.exports = function() {
          throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
        };
      }, {}], 61: [function(e, t, r) {
        t.exports = function() {
          for (var e2 = {}, t2 = 0; t2 < arguments.length; t2++) {
            var r2 = arguments[t2];
            for (var i in r2)
              n.call(r2, i) && (e2[i] = r2[i]);
          }
          return e2;
        };
        var n = Object.prototype.hasOwnProperty;
      }, {}]}, {}, [9])(9);
    });
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
      this.root.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
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
      this.root = this.appendChild(document.createElement("div"));
      this.root.textContent = "Login";
      this.root.style.width = "300px";
      this.root.style.height = "400px";
      this.root.style.position = "fixed";
      this.root.style.top = "50%";
      this.root.style.left = "50%";
      this.root.style.marginTop = "-200px";
      this.root.style.marginLeft = "-150px";
      this.root.style.display = "flex";
      this.root.style.flexDirection = "column";
      this.root.style.justifyContent = "space-evenly";
      this.root.style.alignItems = "stretch";
      this.root.innerHTML = `
            <h1>iDom v.0.0.2</h1>
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
  var mqtt = require_mqtt_min();
  var iDom = class extends HTMLElement {
    devs = {};
    constructor() {
      super();
      this.worker = new Worker("idomworker.js");
      this.worker.onmessage = () => {
        console.log("message from worker");
      };
    }
    loginDialog() {
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
    connectedCallback() {
      const s = this.appendChild(document.createElement("style"));
      s.innerHTML = tasmota_default;
      this.root = this.appendChild(document.createElement("div"));
      this.loadingNode = this.appendChild(new iLoading());
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
        this.client = mqtt.connect(localStorage.getItem("idom_url") || "ws://" + location.host, {username: localStorage.getItem("idom_username"), password: localStorage.getItem("idom_password"), reconnectPeriod: 0});
        this.client.on("close", () => {
          console.log("close");
          this.loginDialog();
        });
        this.client.on("disconnect", (err) => {
          console.log("disconnect");
        });
        this.client.on("error", (err) => {
          console.log("errr", err);
          client.close();
        });
        this.client.on("connect", () => {
          this.loadingoff();
          this.root.innerHTML = "";
          this.wdevs = {};
          this.client.subscribe("#");
          this.client.on("message", (topic, payload) => {
            const [type, name, cmd] = topic.split("/");
            if (cmd == "LWT") {
              this.devs[name] = {...this.devs[name] || {}, LWT: payload.toString()};
              this.client.publish(`cmnd/${name}/STATUS`, "0");
              this.client.publish(`cmnd/${name}/STATE`, "");
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
              console.log(topic, payload.toString());
            }
            this.render();
          });
        });
      } else {
        this.loginDialog();
      }
    }
    render() {
      Object.keys(this.devs).forEach((e) => {
        if (this.wdevs[e] == void 0) {
          this.wdevs[e] = this.root.appendChild(new iDev(e, this));
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
