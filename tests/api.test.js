const fetch = require('node-fetch');

const BASE = process.env.TEST_BASE || 'http://localhost:3000';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = null;
    }
  }
  return { status: res.status, body: text, json };
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

describe('API integration tests (CI, test DB)', () => {
  test('update and restore categories', async () => {
    // Read original
    const orig = await get('/api/categories');
    expect(orig.status).toBe(200);
    expect(Array.isArray(orig.json)).toBe(true);

    const originalNames = orig.json.slice(0, 5).map((c) => c.NAME || '');

    // Update
    const newNames = { category1: 'CI_T1', category2: 'CI_T2', category3: 'CI_T3', category4: 'CI_T4', category5: 'CI_T5' };
    const upd = await post('/api/categories', newNames);
    expect(upd.status).toBe(200);

    const after = await get('/api/categories');
    expect(after.status).toBe(200);
    const namesAfter = after.json.slice(0, 5).map((c) => c.NAME);
    expect(namesAfter).toEqual([newNames.category1, newNames.category2, newNames.category3, newNames.category4, newNames.category5]);

    // Restore
    const restoreBody = {
      category1: originalNames[0],
      category2: originalNames[1],
      category3: originalNames[2],
      category4: originalNames[3],
      category5: originalNames[4],
    };
    const resRestore = await post('/api/categories', restoreBody);
    expect(resRestore.status).toBe(200);

    const final = await get('/api/categories');
    expect(final.status).toBe(200);
    const finalNames = final.json.slice(0, 5).map((c) => c.NAME);
    expect(finalNames).toEqual(originalNames);
  }, 20000);

  test('update and restore a question', async () => {
    // Pick a question by category 1 number 1
    const origQ = await get('/api/question?category=1&number=1');
    expect(origQ.status).toBe(200);
    expect(Array.isArray(origQ.json)).toBe(true);

    const original = (origQ.json[0]) || { FRAGE: '', ANTWORT: '', FRAGE_TYP: null, MediaID: null };

    // Update question
    const updBody = {
      categoryId: 1,
      questionNumber: 1,
      frage: 'CI test question',
      antwort: 'CI answer',
      frageTyp: 'Text',
      mediaId: null,
    };
    const upd = await post('/api/question', updBody);
    expect(upd.status).toBe(200);

    const after = await get('/api/question?category=1&number=1');
    expect(after.status).toBe(200);
    expect(after.json[0].FRAGE).toBe('CI test question');
    expect(after.json[0].ANTWORT).toBe('CI answer');

    // Restore original
    const restoreBody = {
      categoryId: 1,
      questionNumber: 1,
      frage: original.FRAGE,
      antwort: original.ANTWORT,
      frageTyp: original.FRAGE_TYP,
      mediaId: original.MediaID || null,
    };
    const resRestore = await post('/api/question', restoreBody);
    expect(resRestore.status).toBe(200);

    const final = await get('/api/question?category=1&number=1');
    expect(final.status).toBe(200);
    expect(final.json[0].FRAGE).toBe(original.FRAGE);
    expect(final.json[0].ANTWORT).toBe(original.ANTWORT);
  }, 20000);
});
