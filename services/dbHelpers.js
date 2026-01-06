function runQueryGeneric(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => err ? reject(err) : resolve(results));
  });
}

const fs = require('fs');
const path = require('path');

async function insertMedia(db, type, mediaPath) {
  const res = await runQueryGeneric(db, 'INSERT INTO Medien (TYPE, MEDIA) VALUES (?, ?)', [type, mediaPath]);
  return res.insertId;
}

// Write a buffer to uploads (qimg or soundfiles) and insert a Medien row
async function addMediaFromBuffer(db, type, filename, buffer, rootDir) {
  const uploadPath = type === 'Bild' ? path.join(rootDir, 'uploads/qimg') : path.join(rootDir, 'uploads/soundfiles');
  fs.mkdirSync(uploadPath, { recursive: true });
  const filePath = path.join(uploadPath, filename);
  fs.writeFileSync(filePath, buffer);
  const relativeFilePath = path.relative(rootDir, filePath);
  const newId = await insertMedia(db, type, relativeFilePath);
  return newId;
}

async function updateCategory(db, id, name) {
  await runQueryGeneric(db, 'UPDATE Kategorien SET NAME = ? WHERE id = ?', [name, id]);
}

async function updateQuestion(db, kategorie, fnumber, frage, antwort, frageTyp, mediaId) {
  await runQueryGeneric(db, 'UPDATE Fragen SET FRAGE = ?, ANTWORT = ?, FRAGE_TYP = ?, MEDIA = ? WHERE Kategorie = ? AND FNUMBER = ?', [frage, antwort, frageTyp, mediaId, kategorie, fnumber]);
}

async function getCategories(db) {
  return await runQueryGeneric(db, 'SELECT id, NAME FROM Kategorien');
}

async function getQuestionById(db, id) {
  const q = `SELECT Fragen.FRAGE, Fragen.ANTWORT, Fragen.FRAGE_TYP, Medien.Media, Medien.Type AS MediaType FROM Fragen LEFT JOIN Medien ON Fragen.MEDIA = Medien.ID WHERE Fragen.ID = ?`;
  const results = await runQueryGeneric(db, q, [id]);
  return results;
}

async function getQuestionByCategoryNumber(db, category, number) {
  const q = `SELECT Fragen.FRAGE, Fragen.ANTWORT, Fragen.FRAGE_TYP, Medien.ID AS MediaID, Medien.Media, Medien.Type AS MediaType FROM Fragen LEFT JOIN Medien ON Fragen.MEDIA = Medien.ID WHERE Fragen.Kategorie = ? AND Fragen.FNUMBER = ?`;
  const results = await runQueryGeneric(db, q, [category, number]);
  return results;
}

async function getMediaList(db) {
  return await runQueryGeneric(db, 'SELECT ID, Media, Type FROM Medien');
}

module.exports = { runQueryGeneric, insertMedia, addMediaFromBuffer, updateCategory, updateQuestion, getCategories, getQuestionById, getQuestionByCategoryNumber, getMediaList };

