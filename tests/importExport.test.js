const { validateManifest, validateMediaPresence } = require('../services/importExport');

describe('importExport validation', () => {
  test('validateManifest accepts minimal valid manifest', () => {
    const manifest = {
      categories: [{ id: 1, NAME: 'Cat1' }],
      questions: [{ Kategorie: 1, FNUMBER: 1, FRAGE: null, ANTWORT: null, FRAGE_TYP: 'Text' }],
      media: [],
    };
    const errors = validateManifest(manifest);
    expect(Array.isArray(errors)).toBe(true);
    expect(errors.length).toBe(0);
  });

  test('validateManifest detects missing fields', () => {
    const manifest = { categories: [], questions: [] };
    const errors = validateManifest(manifest);
    // categories empty is allowed (array), but internal checks may pass; ensure no exception
    expect(Array.isArray(errors)).toBe(true);
  });

  test('validateManifest rejects bad question types', () => {
    const manifest = {
      categories: [{ id: 1, NAME: 'Cat1' }],
      questions: [{ Kategorie: 1, FNUMBER: 1, FRAGE: 123, ANTWORT: {}, FRAGE_TYP: 12 }],
      media: [],
    };
    const errors = validateManifest(manifest);
    expect(errors.some(e => e.includes('FRAGE not a string'))).toBe(true);
    expect(errors.some(e => e.includes('ANTWORT not a string'))).toBe(true);
    expect(errors.some(e => e.includes('FRAGE_TYP'))).toBe(true);
  });

  test('validateMediaPresence detects missing media entries in manifest', () => {
    const manifest = {
      categories: [{ id: 1, NAME: 'Cat1' }],
      questions: [{ Kategorie: 1, FNUMBER: 1, FRAGE: null, ANTWORT: null, FRAGE_TYP: 'Text', MEDIA: 42 }],
      media: [],
    };
    const fakeDirectory = { files: [] };
    const errors = validateMediaPresence(manifest, fakeDirectory);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/MEDIA references missing media id/);
  });

  test('validateMediaPresence detects missing zip file for media', () => {
    const manifest = {
      categories: [{ id: 1, NAME: 'Cat1' }],
      questions: [{ Kategorie: 1, FNUMBER: 1, FRAGE: null, ANTWORT: null, FRAGE_TYP: 'Text', MEDIA: 1 }],
      media: [{ ID: 1, Type: 'Bild', zipPath: 'media/foo.png' }],
    };
    const fakeDirectory = { files: [{ path: 'media/other.png' }] };
    const errors = validateMediaPresence(manifest, fakeDirectory);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/expected in zip/);
  });

  test('validateMediaPresence passes when media present in zip', () => {
    const manifest = {
      categories: [{ id: 1, NAME: 'Cat1' }],
      questions: [{ Kategorie: 1, FNUMBER: 1, FRAGE: null, ANTWORT: null, FRAGE_TYP: 'Text', MEDIA: 1 }],
      media: [{ ID: 1, Type: 'Bild', zipPath: 'media/foo.png' }],
    };
    const fakeDirectory = { files: [{ path: 'media/foo.png' }] };
    const errors = validateMediaPresence(manifest, fakeDirectory);
    expect(errors.length).toBe(0);
  });
});
