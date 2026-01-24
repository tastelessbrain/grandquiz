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

    const isDigits = (v) => typeof v === 'string' && /^\d+$/.test(v);

    if (id) {
      if (!isDigits(id)) return res.status(400).send('Invalid id');
      (async () => {
        try {
          const results = await dbHelpers.getQuestionById(pool, parseInt(id, 10));
          res.json(results);
        } catch (error) {
          console.error('Database query error: ', error);
          res.status(500).send('Database error');
        }
      })();
      return;
    }

    if (category && number) {
      if (!isDigits(category) || !isDigits(number)) return res.status(400).send('Invalid category or number');
      (async () => {
        try {
          const results = await dbHelpers.getQuestionByCategoryNumber(pool, parseInt(category, 10), parseInt(number, 10));
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
        const maxLen = 255;

        if (!categories || typeof categories !== 'object') {
          return res.status(400).send('Invalid request body');
        }

        const validated = {};
        for (let i = 1; i <= 5; i++) {
          const key = `category${i}`;
          const val = categories[key];
          if (val === undefined || val === null) {
            return res.status(400).send(`Missing ${key}`);
          }
          if (typeof val !== 'string') {
            return res.status(400).send(`${key} must be a string`);
          }
          const trimmed = val.trim();
          if (trimmed.length === 0) {
            return res.status(400).send(`${key} must not be empty`);
          }
          if (trimmed.length > maxLen) {
            return res.status(400).send(`${key} exceeds maximum length`);
          }
          validated[key] = trimmed;
        }

        await dbHelpers.updateCategory(pool, 1, validated.category1);
        await dbHelpers.updateCategory(pool, 2, validated.category2);
        await dbHelpers.updateCategory(pool, 3, validated.category3);
        await dbHelpers.updateCategory(pool, 4, validated.category4);
        await dbHelpers.updateCategory(pool, 5, validated.category5);
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

        const isDigits = (v) => typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v));

        if (!isDigits(categoryId)) return res.status(400).send('Invalid categoryId');
        if (!isDigits(questionNumber)) return res.status(400).send('Invalid questionNumber');

        const catId = parseInt(categoryId, 10);
        const qNum = parseInt(questionNumber, 10);

        if (catId <= 0) return res.status(400).send('categoryId must be positive');
        if (qNum <= 0) return res.status(400).send('questionNumber must be positive');

        if (typeof frage !== 'string') return res.status(400).send('Invalid frage');
        if (typeof antwort !== 'string') return res.status(400).send('Invalid antwort');

        const frageTrim = frage.trim();
        const antwortTrim = antwort.trim();

        if (frageTrim.length === 0) return res.status(400).send('frage must not be empty');
        if (antwortTrim.length === 0) return res.status(400).send('antwort must not be empty');

        const MAX_FRAGE_LEN = 4000;
        const MAX_ANTWORT_LEN = 2000;
        const MAX_FRAGETYP_LEN = 100;

        if (frageTrim.length > MAX_FRAGE_LEN) return res.status(400).send('frage exceeds maximum length');
        if (antwortTrim.length > MAX_ANTWORT_LEN) return res.status(400).send('antwort exceeds maximum length');

        let mediaIdVal = null;
        if (mediaId !== undefined && mediaId !== null && mediaId !== '') {
          if (!isDigits(mediaId)) return res.status(400).send('Invalid mediaId');
          mediaIdVal = parseInt(mediaId, 10);
          if (mediaIdVal <= 0) return res.status(400).send('mediaId must be positive');
        }

        let frageTypVal = null;
        if (frageTyp !== undefined && frageTyp !== null && frageTyp !== '') {
          if (typeof frageTyp !== 'string') return res.status(400).send('Invalid frageTyp');
          const ft = frageTyp.trim();
          if (ft.length === 0) return res.status(400).send('frageTyp must not be empty');
          if (ft.length > MAX_FRAGETYP_LEN) return res.status(400).send('frageTyp exceeds maximum length');
          frageTypVal = ft;
        }

        await dbHelpers.updateQuestion(pool, catId, qNum, frageTrim, antwortTrim, frageTypVal, mediaIdVal);
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

      const originalName = String(file.originalname || 'file');
      let filename = path.basename(originalName);
      // replace spaces, strip disallowed chars
      filename = filename.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      // remove leading dots to avoid hidden/relative names like '.' or '..'
      filename = filename.replace(/^[.]+/, '');
      // fallback for completely stripped names or reserved names
      if (!filename || filename === '.' || filename === '..') filename = 'file';
      const filePath = path.join(uploadPath, filename);
      const resolvedUploadPath = path.resolve(uploadPath);
      fs.mkdirSync(resolvedUploadPath, { recursive: true });
      const uploadPathStat = fs.statSync(resolvedUploadPath);
      if (!uploadPathStat.isDirectory()) {
        throw new Error('Upload path is not a directory');
      }
      const resolvedFilePath = path.resolve(filePath);
      if (resolvedFilePath !== resolvedUploadPath && !resolvedFilePath.startsWith(resolvedUploadPath + path.sep)) {
        throw new Error('Invalid file path');
      }
      await fs.promises.writeFile(resolvedFilePath, file.buffer);

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
