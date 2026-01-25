const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const BASE = process.env.TEST_BASE || 'http://localhost:3000';

async function get(pathReq) {
  const res = await fetch(`${BASE}${pathReq}`);
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

async function postJson(pathReq, body) {
  const res = await fetch(`${BASE}${pathReq}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = null; }
  return { status: res.status, body: text, json };
}

async function del(pathReq) {
  const res = await fetch(`${BASE}${pathReq}`, { method: 'DELETE' });
  const text = await res.text();
  try { return { status: res.status, json: JSON.parse(text), body: text }; } catch (e) { return { status: res.status, body: text }; }
}

describe('Media browser / sync API', () => {
  const rootDir = path.resolve(__dirname, '..');
  const uploadsQimg = path.join(rootDir, 'uploads', 'qimg');
  const testFileRel = path.join('uploads', 'qimg', 'ci_test_image.txt');
  const testFileAbs = path.join(rootDir, testFileRel);

  beforeAll(() => {
    if (!fs.existsSync(uploadsQimg)) fs.mkdirSync(uploadsQimg, { recursive: true });
  });

  afterAll(() => {
    // best-effort cleanup
    try { if (fs.existsSync(testFileAbs)) fs.unlinkSync(testFileAbs); } catch (e) {}
  });

  test('scan sees filesystem-only file and sync inserts into DB, then deletion works', async () => {
    // create a test file
    fs.writeFileSync(testFileAbs, 'ci test');

    // ensure the file is reported by /api/media/files
    const scan = await get('/api/media/files');
    expect(scan.status).toBe(200);
    expect(scan.json).toBeTruthy();
    const files = scan.json.files || [];
    const found = files.find((f) => f.path === testFileRel.replace(/\\/g, '/'));
    expect(found).toBeTruthy();

    // sync only that path
    const sync = await postJson('/api/media/sync', { paths: [testFileRel], deleteDbMissing: false });
    expect(sync.status).toBe(200);
    expect(sync.json).toBeTruthy();
    // inserted should include our path
    const inserted = sync.json.inserted || [];
    const ins = inserted.find((i) => i.path === testFileRel.replace(/\\/g, '/'));
    expect(ins).toBeTruthy();
    const mediaId = ins.id;

    // confirm media is visible via /api/media
    const mediaList = await get('/api/media');
    expect(mediaList.status).toBe(200);
    const mediaRow = (mediaList.json || []).find((m) => m.ID === mediaId || String(m.ID) === String(mediaId));
    expect(mediaRow).toBeTruthy();
    expect(mediaRow.Media).toBe(testFileRel.replace(/\\/g, '/'));

    // delete DB row and file via DELETE
    const delRes = await del(`/api/media/${mediaId}?deleteFile=true`);
    expect(delRes.status).toBe(200);

    // file should be gone
    expect(fs.existsSync(testFileAbs)).toBe(false);

    // ensure DB row no longer present
    const mediaListAfter = await get('/api/media');
    expect(mediaListAfter.status).toBe(200);
    const still = (mediaListAfter.json || []).find((m) => m.ID === mediaId || String(m.ID) === String(mediaId));
    expect(still).toBeUndefined();
  }, 20000);

  test('sync then delete DB only (keep file) flows', async () => {
    // recreate file
    fs.writeFileSync(testFileAbs, 'ci test 2');
    const sync = await postJson('/api/media/sync', { paths: [testFileRel], deleteDbMissing: false });
    expect(sync.status).toBe(200);
    const inserted = sync.json.inserted || [];
    const ins = inserted.find((i) => i.path === testFileRel.replace(/\\/g, '/'));
    // it's possible the previous test left DB row if something failed; find the media id from /api/media
    let mediaId = ins && ins.id;
    if (!mediaId) {
      const mediaList = await get('/api/media');
      const maybe = (mediaList.json || []).find((m) => m.Media === testFileRel.replace(/\\/g, '/'));
      mediaId = maybe && maybe.ID;
    }
    expect(mediaId).toBeTruthy();

    // delete DB row only, keep file
    const delRes = await del(`/api/media/${mediaId}?deleteFile=false`);
    expect(delRes.status).toBe(200);

    // file must still exist
    expect(fs.existsSync(testFileAbs)).toBe(true);

    // cleanup file
    try { fs.unlinkSync(testFileAbs); } catch (e) {}
  }, 20000);
});
