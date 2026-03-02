const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Load configuration from config.json
const config = require(path.join(__dirname, 'config.json'));
const basicAuth = require(path.join(__dirname, 'middleware', 'basicAuth'));

// Use bodyParser to parse incoming requests
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Serve the web interface from the `interface` folder
const interfacePath = path.join(__dirname, 'interface');

// Apply BasicAuth before serving static files and API routes
app.use(basicAuth(config));

app.use(express.static(interfacePath));

// Ensure root URL serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(interfacePath, 'index.html'));
});

// Serve media from the top-level `uploads` folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration endpoint: return mqtt settings only
app.get('/config', (req, res) => {
  res.json({ mqtt: config.mqtt || { host: '', port: 9001 } });
});

// Create a connection pool
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: process.env.DB_NAME || config.mysql.database,
  port: config.mysql.port,
});

// Register API routes from routes/api.js
require(path.join(__dirname, 'routes', 'api'))(app, pool, __dirname);

// Start the server
if (config.ssl && config.ssl.enabled) {
  const sslKeyPath = path.resolve(__dirname, config.ssl.key || '');
  const sslCertPath = path.resolve(__dirname, config.ssl.cert || '');
  try {
    const key = fs.readFileSync(sslKeyPath);
    const cert = fs.readFileSync(sslCertPath);
    const sslPort = config.server.port;
    https.createServer({ key, cert }, app).listen(sslPort, () => {
      console.log(`HTTPS server running on port ${sslPort}`);
    });
  } catch (err) {
    console.error('Failed to start HTTPS server:', err);
    process.exit(1);
  }
} else {
  app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
}
