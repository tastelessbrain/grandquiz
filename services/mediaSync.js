const fs = require('fs');
const path = require('path');
const dbHelpers = require('./dbHelpers');

async function scanUploads(rootDir) {
  const files = [];
  const scanDir = async (dir, type) => {
    try {
      const names = await fs.promises.readdir(dir);
      for (const name of names) {
        try {
          const p = path.join(dir, name);
          const st = await fs.promises.stat(p);
          if (st.isFile()) {
            files.push({ abs: p, rel: path.relative(rootDir, p), filename: name, type });
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore missing dir
    }
  };
  await scanDir(path.join(rootDir, 'uploads/qimg'), 'Bild');
  await scanDir(path.join(rootDir, 'uploads/soundfiles'), 'Audio');
  return files;
}

function isSafeRelativePath(rootDir, rel) {
  if (!rel) return false;
  // disallow absolute
  if (path.isAbsolute(rel)) return false;
  // normalize and make sure it stays inside uploads
  const abs = path.resolve(rootDir, rel);
  const uploadsRoot = path.resolve(rootDir, 'uploads');
  return abs === uploadsRoot || abs.startsWith(uploadsRoot + path.sep);
}

async function syncFiles(pool, rootDir, options = {}) {
  const { paths = null, deleteDbMissing = false } = options;
  const result = { inserted: [], removedDbIds: [], errors: [] };

  // build list of files to consider
  let toScan = [];
  if (Array.isArray(paths) && paths.length > 0) {
    for (const rel of paths) {
      try {
        if (!isSafeRelativePath(rootDir, rel)) {
          result.errors.push({ path: rel, error: 'unsafe path' });
          continue;
        }
        const abs = path.resolve(rootDir, rel);
        const st = await fs.promises.stat(abs);
        if (st.isFile()) toScan.push({ abs, rel });
      } catch (e) {
        result.errors.push({ path: rel, error: 'not found' });
      }
    }
  } else {
    toScan = (await scanUploads(rootDir)).map((f) => ({ abs: f.abs, rel: f.rel }));
  }

  // map current DB by MEDIA path
  const mediaRows = await dbHelpers.getMediaList(pool);
  const dbByPath = {};
  for (const r of mediaRows) if (r.Media) dbByPath[r.Media] = r;

  // idempotent inserts
  for (const f of toScan) {
    try {
      if (dbByPath[f.rel]) continue; // already present
      const type = f.rel.startsWith('uploads/qimg') ? 'Bild' : f.rel.startsWith('uploads/soundfiles') ? 'Audio' : 'Bild';
      // double-check using getMediaByPath for race-safety
      const existing = await dbHelpers.getMediaByPath(pool, f.rel);
      if (existing) continue;
      const id = await dbHelpers.insertMedia(pool, type, f.rel);
      result.inserted.push({ path: f.rel, id });
    } catch (e) {
      result.errors.push({ path: f.rel, error: String(e) });
    }
  }

  // optionally delete DB entries whose files are missing; do this in a transaction
  if (deleteDbMissing) {
    try {
      await dbHelpers.withTransaction(pool, async (conn) => {
        for (const r of mediaRows) {
          if (!r.Media) continue;
          const abs = path.resolve(rootDir, r.Media);
          if (!fs.existsSync(abs)) {
            try {
              await new Promise((resolve, reject) => conn.query('DELETE FROM Medien WHERE ID = ?', [r.ID], (err) => err ? reject(err) : resolve()));
              result.removedDbIds.push(r.ID);
            } catch (e) {
              result.errors.push({ id: r.ID, error: String(e) });
            }
          }
        }
      });
    } catch (e) {
      result.errors.push({ transaction: 'deleteDbMissing failed', error: String(e) });
    }
  }

  return result;
}

async function deleteMedia(pool, rootDir, id, deleteFile = true) {
  const r = await dbHelpers.getMediaById(pool, id);
  if (!r) throw new Error('Media not found');
  // delete file first
  if (deleteFile && r.Media) {
    const abs = path.resolve(rootDir, r.Media);
    if (isSafeRelativePath(rootDir, r.Media) && fs.existsSync(abs)) {
      await fs.promises.unlink(abs);
    }
  }
  // delete DB row
  await dbHelpers.deleteMediaById(pool, id);
  return { success: true };
}

module.exports = { scanUploads, syncFiles, deleteMedia };
