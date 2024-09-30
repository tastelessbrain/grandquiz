const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer'); // Import multer for file uploads
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// Use bodyParser to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mediaType = req.body.mediatype;
    let uploadPath = '';

    if (mediaType === 'Audio') {
      uploadPath = path.join(__dirname, '..', 'grandquiz', 'soundfiles');
    } else if (mediaType === 'Bild') {
      uploadPath = path.join(__dirname, '..', 'grandquiz', 'qimg');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  },
});

const upload = multer({ storage: storage });

// Endpoint to upload media
app.post('/upload', upload.single('file'), (req, res) => {
  const mediaType = req.body.mediatype;
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res.status(400).send('No file uploaded');
  }

  // Prepare the file path for insertion into the database (relative path)
  const relativeFilePath = `.${filePath
    .split('grandquiz')[1]
    .replace(/\\/g, '/')}`;

  // Insert the file information into the Medien table
  const insertQuery = `INSERT INTO Medien (TYPE, MEDIA) VALUES (?, ?)`;
  const params = [mediaType, relativeFilePath];

  executeQuery(insertQuery, params, res);
});

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

// Endpoint to update category names
app.post('/setcategories', (req, res) => {
  const categories = req.body;
  const queries = [
    'UPDATE Kategorien SET NAME = ? WHERE id = 1',
    'UPDATE Kategorien SET NAME = ? WHERE id = 2',
    'UPDATE Kategorien SET NAME = ? WHERE id = 3',
    'UPDATE Kategorien SET NAME = ? WHERE id = 4',
    'UPDATE Kategorien SET NAME = ? WHERE id = 5',
  ];

  const params = [
    [categories.category1],
    [categories.category2],
    [categories.category3],
    [categories.category4],
    [categories.category5],
  ];

  let completedQueries = 0;
  queries.forEach((query, index) => {
    pool.query(query, params[index], (error, results) => {
      if (error) {
        console.error('Database query error: ', error);
        return res.status(500).send('Database error');
      }
      completedQueries++;
      if (completedQueries === queries.length) {
        res.send('Categories updated successfully');
      }
    });
  });
});

// Endpoint to update question data
app.post('/updateQuestion', (req, res) => {
  const { categoryId, questionNumber, frage, antwort, frageTyp, mediaId } =
    req.body;

  // Prepare the SQL query for updating the question
  const updateQuery = `
    UPDATE Fragen
    SET FRAGE = ?, ANTWORT = ?, FRAGE_TYP = ?, MEDIA = ?
    WHERE Kategorie = ? AND FNUMBER = ?
  `;

  // Set the parameters for the query
  const params = [
    frage,
    antwort,
    frageTyp,
    mediaId,
    categoryId,
    questionNumber,
  ];

  // Execute the query using the executeQuery helper function
  executeQuery(updateQuery, params, res);
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
