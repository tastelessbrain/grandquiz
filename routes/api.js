const path = require('path');
const multer = require('multer');
const fs = require('fs');
const importExport = require('../services/importExport');
const dbHelpers = require('../services/dbHelpers');

module.exports = function (app, pool, rootDir) {
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  app.get('/api/categories', (req, res) => {
    (async () => {
      try {
        const results = await dbHelpers.getCategories(pool);
        res.json(results);
      } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).send('Database error');
      }
    })();
  });

  // GET /api/question?id=...  OR  /api/question?category=...&number=...
  app.get('/api/question', (req, res) => {
    const id = req.query.id;
    const category = req.query.category;
    const number = req.query.number;

    if (id) {
      (async () => {
        try {
          const results = await dbHelpers.getQuestionById(pool, id);
          res.json(results);
        } catch (error) {
          console.error('Database query error: ', error);
          res.status(500).send('Database error');
        }
      })();
      return;
    }

    if (category && number) {
      (async () => {
        try {
          const results = await dbHelpers.getQuestionByCategoryNumber(pool, category, number);
          res.json(results);
        } catch (error) {
          console.error('Database query error: ', error);
          res.status(500).send('Database error');
        }
      })();
      return;
    }

    res.status(400).send('Missing parameters');
  });

  app.get('/api/media', (req, res) => {
    (async () => {
      try {
        const results = await dbHelpers.getMediaList(pool);
        res.json(results);
      } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).send('Database error');
      }
    })();
  });

  app.get('/api/exportZip', (req, res) => {
    importExport.streamExportZip(pool, rootDir, res).catch((err) => {
      console.error('Export ZIP error:', err);
      if (!res.headersSent) res.status(500).send('Export failed');
    });
  });

  app.post('/api/importZip', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).send('No file uploaded');

      const result = await importExport.importZipBuffer(pool, rootDir, file.buffer);
      if (result && result.errors) return res.status(400).json({ errors: result.errors });
      return res.send(result.message || 'Import ZIP completed');
    } catch (err) {
      console.error('Import ZIP error:', err);
      res.status(500).send('Import failed');
    }
  });

  app.post('/api/categories', (req, res) => {
    (async () => {
      try {
        const categories = req.body;
        await dbHelpers.updateCategory(pool, 1, categories.category1);
        await dbHelpers.updateCategory(pool, 2, categories.category2);
        await dbHelpers.updateCategory(pool, 3, categories.category3);
        await dbHelpers.updateCategory(pool, 4, categories.category4);
        await dbHelpers.updateCategory(pool, 5, categories.category5);
        res.send('Categories updated successfully');
      } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).send('Database error');
      }
    })();
  });

  app.post('/api/question', (req, res) => {
    (async () => {
      try {
        const { categoryId, questionNumber, frage, antwort, frageTyp, mediaId } = req.body;
        await dbHelpers.updateQuestion(pool, categoryId, questionNumber, frage, antwort, frageTyp, mediaId);
        res.send('Question updated successfully');
      } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).send('Database error');
      }
    })();
  });

  app.post('/api/uploadMedia', upload.single('file'), async (req, res) => {
    try {
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
      await fs.promises.writeFile(filePath, file.buffer);

      const relativeFilePath = path.relative(rootDir, filePath);
      try {
        await dbHelpers.insertMedia(pool, mediaType, relativeFilePath);
        res.json({ message: 'File uploaded and database updated successfully!' });
      } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).send('Database error');
      }
    } catch (err) {
      console.error('File save error: ', err);
      res.status(500).send('File save error');
    }
  });
};
