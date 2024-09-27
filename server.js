const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Use bodyParser to parse incoming requests
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'p42', // replace with your MySQL username
  password: '12345678', // replace with your MySQL password
  database: 'project_42',
  port: 3306,
});

// Helper function to execute queries
function executeQuery(query, params, res) {
  pool.query(query, params, (error, results) => {
    if (error) {
      console.error('Database query error: ', error);
      res.status(500).send('Database error');
    } else {
      res.json(results);
    }
  });
}

// Dynamic query endpoint (VERY CAREFUL HERE!)
app.post('/query', (req, res) => {
  const query = req.body.query;
  
  // Security: Sanitize input or add some validation for allowed queries.
  if (typeof query !== 'string') {
    return res.status(400).send('Invalid query string');
  }
  
  // Execute the query
  executeQuery(query, [], res);
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
