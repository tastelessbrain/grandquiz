# GrandQuiz

Simple Express-based backend + static web UI for the Quiz application.

**Overview**
- `server.js` serves the static web UI from the `interface` folder and exposes a small API for DB queries and uploads.
- Runtime configuration is provided by [config.json](config.json).

**Requirements**
- Node.js (v14+ recommended) and npm
- MariaDB (or MySQL)
- Mosquitto MQTT broker (with WebSockets enabled as the web UI connects over WS)

**Config file**
The app reads configuration from [config.json](config.json). Keys used by the server:
- **mysql**:
  - **host**: database host (string)
  - **user**: database username (string)
  - **password**: database password (string)
  - **database**: database name (string)
  - **port**: database port (number, typically `3306`)
- **server**:
  - **port**: port the Express server listens on (number, e.g. `3000`)
- **ssl**: optional HTTPS configuration
  - **enabled**: enable HTTPS (boolean)
  - **key**: path to the PEM private key file (string, relative to repository root)
  - **cert**: path to the PEM certificate file (string, relative to repository root)
  - (HTTPS uses the same `server.port` as the HTTP server)
- **mqtt**:
  - **host**: MQTT hostname for the web client to connect to. If empty, the client falls back to `window.location.hostname` aka the same hostname you are using to access the website.
  - **port**: MQTT port (number). The web UI defaults to `9001` if this is not set.
- **auth**:
  - **enabled**: enable HTTP Basic authentication for the web service (boolean, `false` to disable)
  - **users**: array of user objects with `user` and `password` fields. Example: `[{ "user": "admin", "password": "secret" }]`

Example `config.json`:

```json
{
  "mysql": {
    "host": "localhost",
    "user": "quizuser",
    "password": "securepassword",
    "database": "quizdb",
    "port": 3306
  },
  "server": {
    "port": 3000
  },
  "ssl": {
    "enabled": false,
    "key": "certs/key.pem",
    "cert": "certs/cert.pem"
  },
  "mqtt": {
    "host": "",
    "port": 9001
  }
  ,
  "auth": {
    "enabled": false,
    "users": [
      {
        "user": "",
        "password": ""
      }
    ]
  }
}
```

Security note: If you enable HTTP Basic authentication via the `auth` section, do so only when HTTPS is enabled. Basic auth credentials are sent in plaintext over HTTP and can be intercepted; enabling `auth.enabled` without `ssl.enabled` exposes user passwords. Prefer setting `auth.enabled` to `true` only when `ssl.enabled` is also `true` and you have valid certificate files.

**MQTT / Mosquitto**
- The web UI expects an MQTT broker available (typically via WebSockets). For the default setup the UI connects on the WebSocket port (default configured in `config.json`, commonly `9001`).

Install mosquitto (Debian/Ubuntu):

```bash
sudo apt update
sudo apt install -y mosquitto
```

Enable WebSockets in mosquitto (example snippet to add to `/etc/mosquitto/mosquitto.conf` or a conf drop-in):

```
# tcp listener (clients)
listener 1883
protocol mqtt

# websockets listener (browser)
listener 9001
protocol websockets
```

After changing mosquitto config, restart:

```bash
sudo systemctl restart mosquitto
```

**MariaDB / MySQL setup**
1. Install MariaDB (Debian/Ubuntu):

```bash
sudo apt update
sudo apt install -y mariadb-server
sudo systemctl enable --now mariadb
```

2. Secure the installation (optional but recommended):

```bash
sudo mysql_secure_installation
```

3. Create database and user for the application (example):

```sql
CREATE DATABASE quizdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'quizuser'@'localhost' IDENTIFIED BY 'securepassword';
GRANT ALL PRIVILEGES ON quizdb.* TO 'quizuser'@'localhost';
FLUSH PRIVILEGES;
```

Adjust username, password and host as needed. If the web server and DB are on separate hosts, create the user with the appropriate host (e.g. `'quizuser'@'192.168.1.%'`).

4. Load schema/data if you have a dump (example file `dump.sql` to get a base structure in repository):

```bash
mysql -u quizuser -p quizdb < dump.sql
```

**Start the application**
- From repository root:

```bash
npm install   # if dependencies are not installed
node server.js
```

Visit `http://127.0.0.1:3000/` (adjust if you changed the server port in `config.json`).