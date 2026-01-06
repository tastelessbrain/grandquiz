const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const unzipper = require('unzipper');
const dbHelpers = require('./dbHelpers');

function runQuery(pool, sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => err ? reject(err) : resolve(results));
  });
}

function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') {
    errors.push('manifest must be an object');
    return errors;
  }
  if (!Array.isArray(manifest.categories)) {
    errors.push('categories must be an array');
  } else {
    manifest.categories.forEach((c, idx) => {
      if (typeof c.id === 'undefined') errors.push(`categories[${idx}].id missing`);
      if (typeof c.NAME !== 'string') errors.push(`categories[${idx}].NAME missing or not a string`);
    });
  }
  if (!Array.isArray(manifest.questions)) {
    errors.push('questions must be an array');
  } else {
    manifest.questions.forEach((q, idx) => {
      if (typeof q.Kategorie === 'undefined') errors.push(`questions[${idx}].Kategorie missing`);
      if (typeof q.FNUMBER === 'undefined') errors.push(`questions[${idx}].FNUMBER missing`);
      if (q.FRAGE != null && typeof q.FRAGE !== 'string') errors.push(`questions[${idx}].FRAGE not a string or null`);
      if (q.ANTWORT != null && typeof q.ANTWORT !== 'string') errors.push(`questions[${idx}].ANTWORT not a string or null`);
      if (typeof q.FRAGE_TYP !== 'string') errors.push(`questions[${idx}].FRAGE_TYP missing or not a string`);
    });
  }
  return errors;
}

function validateMediaPresence(manifest, directory) {
  const errors = [];
  if (!Array.isArray(manifest.questions) || !Array.isArray(manifest.media)) return errors;
  const mediaById = new Map(manifest.media.map(m => [m.ID, m]));
  for (let i = 0; i < manifest.questions.length; i++) {
    const q = manifest.questions[i];
    if (q.MEDIA) {
      const m = mediaById.get(q.MEDIA);
      if (!m) {
        errors.push(`questions[${i}].MEDIA references missing media id ${q.MEDIA}`);
        continue;
      }
      if (m.zipPath) {
        const found = directory.files.find(f => f.path === m.zipPath);
        if (!found) errors.push(`media id ${m.ID} expected in zip at ${m.zipPath} but missing`);
      }
    }
  }
  return errors;
}

async function streamExportZip(pool, rootDir, res) {
  const categories = await runQuery(pool, 'SELECT id, NAME FROM Kategorien');
  const questions = await runQuery(pool, 'SELECT ID, Kategorie, FNUMBER, FRAGE, ANTWORT, FRAGE_TYP, MEDIA FROM Fragen');

  const mediaIds = Array.from(new Set(questions.filter(q => q.MEDIA).map(q => q.MEDIA)));
  let mediaRows = [];
  if (mediaIds.length > 0) {
    const placeholders = mediaIds.map(() => '?').join(',');
    mediaRows = await runQuery(pool, `SELECT ID, Type, Media FROM Medien WHERE ID IN (${placeholders})`, mediaIds);
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="grandquiz-export.zip"');

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', (err) => {
    console.error('Archive creation error:', err);
    try {
      if (!res.headersSent) {
        if (typeof res.status === 'function') {
          res.status(500).type('text').send('Failed to create archive');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Failed to create archive');
        }
      } else {
        try { res.destroy(err); } catch (e) {}
      }
    } catch (e) {
      try { res.destroy(err); } catch (e2) {}
    }
  });
  archive.pipe(res);

  const manifest = { categories, questions, media: [] };
  for (const m of mediaRows) {
    const filePath = path.join(rootDir, m.Media || '');
    const filename = path.basename(m.Media || `media_${m.ID}`);
    const zipPath = path.posix.join('media', filename);
    if (m.Media && fs.existsSync(filePath)) {
      archive.file(filePath, { name: zipPath });
    }
    // Do not include repository-local Media path in manifest; only include ID, Type and zipPath
    manifest.media.push({ ID: m.ID, Type: m.Type, zipPath });
  }

  archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
  await archive.finalize();
}

async function importZipBuffer(pool, rootDir, buffer) {
  const directory = await unzipper.Open.buffer(buffer);
  const manifestEntry = directory.files.find(f => f.path === 'manifest.json');
  if (!manifestEntry) return { errors: ['manifest.json missing in zip'] };

  const manifestBuf = await manifestEntry.buffer();
  const manifest = JSON.parse(manifestBuf.toString());

  const validationErrors = validateManifest(manifest);
  if (validationErrors.length > 0) return { errors: validationErrors };

  const mediaErrors = validateMediaPresence(manifest, directory);
  if (mediaErrors.length > 0) return { errors: mediaErrors };

  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, conn) => {
      if (connErr) return reject(connErr);

      const execConnQuery = (sql, params) => new Promise((resolveQ, rejectQ) => {
        conn.query(sql, params, (qErr, result) => qErr ? rejectQ(qErr) : resolveQ(result));
      });

      (async () => {
        try {
          await execConnQuery('START TRANSACTION');

          // wipe uploads directories
          const qimgDir = path.join(rootDir, 'uploads/qimg');
          const soundDir = path.join(rootDir, 'uploads/soundfiles');
          try { fs.rmSync(qimgDir, { recursive: true, force: true }); } catch (e) {}
          try { fs.rmSync(soundDir, { recursive: true, force: true }); } catch (e) {}
          fs.mkdirSync(qimgDir, { recursive: true });
          fs.mkdirSync(soundDir, { recursive: true });

          // clear FK references then wipe Medien table
          await execConnQuery('UPDATE Fragen SET MEDIA = NULL');
          await execConnQuery('DELETE FROM Medien');

          // Import media files and map old ID -> new ID
          const mediaIdMap = {};
          if (Array.isArray(manifest.media)) {
            for (const m of manifest.media) {
              const entry = directory.files.find(f => f.path === (m.zipPath || ''));
              let newMediaId = null;
              if (entry) {
                const buf = await entry.buffer();
                const filename = path.basename(m.zipPath);
                newMediaId = await dbHelpers.addMediaFromBuffer(conn, m.Type, filename, buf, rootDir);
              } else {
                // If the zip did not contain the media file, insert a DB row with null media path
                newMediaId = await dbHelpers.insertMedia(conn, m.Type, null);
              }
              mediaIdMap[m.ID] = newMediaId;
            }
          }

          if (Array.isArray(manifest.categories)) {
            for (const c of manifest.categories) {
              await dbHelpers.updateCategory(conn, c.id, c.NAME);
            }
          }

          if (Array.isArray(manifest.questions)) {
            for (const q of manifest.questions) {
              const newMedia = q.MEDIA ? (mediaIdMap[q.MEDIA] || null) : null;
              await dbHelpers.updateQuestion(conn, q.Kategorie, q.FNUMBER, q.FRAGE, q.ANTWORT, q.FRAGE_TYP, newMedia);
            }
          }

          await execConnQuery('COMMIT');
          resolve({ success: true, message: 'Import ZIP completed (uploads and Medien wiped and replaced)' });
        } catch (innerErr) {
          try { await execConnQuery('ROLLBACK'); } catch (e) {}
          reject(innerErr);
        } finally {
          conn.release();
        }
      })();
    });
  });
}

module.exports = { streamExportZip, importZipBuffer, validateManifest, validateMediaPresence };

