const path = require('path');
const multer = require('multer');
const fs = require('fs');

module.exports = function (app, pool, rootDir) {
  app.get('/api/categories', (req, res) => {
    pool.query('SELECT id, NAME FROM Kategorien', (error, results) => {
      if (error) {
        console.error('Database query error: ', error);
        return res.status(500).send('Database error');
      }
      res.json(results);
    });
  });

  // GET /api/question?id=...  OR  /api/question?category=...&number=...
  app.get('/api/question', (req, res) => {
    const id = req.query.id;
    const category = req.query.category;
    const number = req.query.number;

    if (id) {
      const q = `SELECT Fragen.FRAGE, Fragen.ANTWORT, Fragen.FRAGE_TYP, Medien.Media, Medien.Type AS MediaType FROM Fragen LEFT JOIN Medien ON Fragen.MEDIA = Medien.ID WHERE Fragen.ID = ?`;
      pool.query(q, [id], (error, results) => {
        if (error) {
          console.error('Database query error: ', error);
          return res.status(500).send('Database error');
        }
        res.json(results);
      });
      return;
    }

    if (category && number) {
      const q = `SELECT Fragen.FRAGE, Fragen.ANTWORT, Fragen.FRAGE_TYP, Medien.ID AS MediaID, Medien.Media, Medien.Type AS MediaType FROM Fragen LEFT JOIN Medien ON Fragen.MEDIA = Medien.ID WHERE Fragen.Kategorie = ? AND Fragen.FNUMBER = ?`;
      pool.query(q, [category, number], (error, results) => {
        if (error) {
          console.error('Database query error: ', error);
          return res.status(500).send('Database error');
        }
        res.json(results);
      });
      return;
    }

    res.status(400).send('Missing parameters');
  });

  app.get('/api/media', (req, res) => {
    pool.query('SELECT ID, Media, Type FROM Medien', (error, results) => {
      if (error) {
        console.error('Database query error: ', error);
        return res.status(500).send('Database error');
      }
      res.json(results);
    });
  });

  app.post('/api/categories', (req, res) => {
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

    let completed = 0;
    queries.forEach((query, idx) => {
      pool.query(query, params[idx], (error) => {
        if (error) {
          console.error('Database query error: ', error);
          return res.status(500).send('Database error');
        }
        completed++;
        if (completed === queries.length) {
          res.send('Categories updated successfully');
        }
      });
    });
  });

  app.post('/api/question', (req, res) => {
    const { categoryId, questionNumber, frage, antwort, frageTyp, mediaId } = req.body;
    const updateQuery = `
      UPDATE Fragen
      SET FRAGE = ?, ANTWORT = ?, FRAGE_TYP = ?, MEDIA = ?
      WHERE Kategorie = ? AND FNUMBER = ?
    `;
    const params = [frage, antwort, frageTyp, mediaId, categoryId, questionNumber];
    pool.query(updateQuery, params, (error, results) => {
      if (error) {
        console.error('Database query error: ', error);
        return res.status(500).send('Database error');
      }
      res.send('Question updated successfully');
    });
  });

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  app.post('/api/uploadMedia', upload.single('file'), (req, res) => {
    const mediaType = req.body.mediatype;
    if (!mediaType) return res.status(400).send('No media type provided');

    let uploadPath = '';
    if (mediaType === 'Bild') {
      uploadPath = path.join(rootDir, 'uploads/qimg');
    } else if (mediaType === 'Audio') {
      uploadPath = path.join(rootDir, 'uploads/soundfiles');
    } else {
      return res.status(400).send('Invalid media type');
    }

    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const filename = file.originalname;
    const filePath = path.join(uploadPath, filename);
    fs.mkdirSync(uploadPath, { recursive: true });
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        console.error('File save error: ', err);
        return res.status(500).send('File save error');
      }

      const relativeFilePath = path.relative(rootDir, filePath);
      const insertQuery = 'INSERT INTO Medien (TYPE, MEDIA) VALUES (?, ?)';
      const params = [mediaType, relativeFilePath];
      pool.query(insertQuery, params, (error) => {
        if (error) {
          console.error('Database query error: ', error);
          return res.status(500).send('Database error');
        }
        res.json({ message: 'File uploaded and database updated successfully!' });
      });
    });
  });
};
