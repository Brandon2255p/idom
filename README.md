## iDom

WebSocket MQTT control application for tasmota powered devices. Application work without backend, direct connect to mqtt server (mosquitto) by websocket.

Define in mosquitto configuration http_dir:

```
listener 8080
protocol websockets
http_dir /opt/www
```

Then:

```
yarn build
cp public/* /opt/www/
```

or run in dev mode:

```
yarn dev
```

### Screenshots

#### Browser

![Login screen](screenshots/desktop_login.png?raw=true)
![Main screen](screenshots/desktop_main.png?raw=true)

#### iOS

![iOS Login screen](screenshots/ios_login.png?raw=true)
![iOS Main screen](screenshots/ios_main.png?raw=true)
