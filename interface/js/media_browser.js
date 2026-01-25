(function () {
  const origin = window.location.origin;
  const mediaList = document.getElementById('media_list');
  const refreshBtn = document.getElementById('refresh_media_btn');
  const syncBtn = document.getElementById('sync_media_btn');
  const deleteDbMissingCheckbox = document.getElementById('delete_db_missing');
  const backBtn = document.getElementById('back_btn');
  const uploadForm = document.getElementById('upload_form');
  const mbFileInput = document.getElementById('mb_file');
  const mbMediaType = document.getElementById('mb_mediatype');

  function normPath(p) {
    if (!p) return '';
    return p.replace(/\\/g, '/').replace(/^\/+/g, '');
  }

  // keep the file input's accept attribute in sync with the selected mediatype
  if (mbFileInput && mbMediaType) {
    function updateAccept() {
      const v = mbMediaType.value;
      if (v === 'Bild') mbFileInput.accept = 'image/*';
      else if (v === 'Audio') mbFileInput.accept = 'audio/*';
      else mbFileInput.accept = '';
    }
    updateAccept();
    mbMediaType.addEventListener('change', updateAccept);
  }

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.location.href = 'insert.html';
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const file = mbFileInput.files && mbFileInput.files[0];
      if (!file) { alert('Select a file'); return; }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('mediatype', mbMediaType.value);
      fetch(origin + '/api/uploadMedia', { method: 'POST', body: fd })
        .then(async (r) => {
          if (!r.ok) {
            const txt = await r.text();
            throw new Error(txt || 'Upload failed');
          }
          return r.json();
        })
        .then((body) => {
          alert('Upload successful');
          mbFileInput.value = '';
          fetchAndRender();
        })
        .catch((e) => { console.error(e); alert('Upload failed: ' + e.message); });
    });
  }

  function createRow(file, dbRow) {
    const div = document.createElement('div');
    div.className = 'media-row';
    div.dataset.path = file.path;

    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('div');
    title.className = 'meta-title';
    title.textContent = file.filename + ' (' + file.type + ')';
    meta.appendChild(title);

    // preview
    if (file.type === 'Bild') {
      const img = document.createElement('img');
      const urlPath = normPath(file.path);
      img.src = '/' + urlPath;
      img.alt = file.filename || '';
      meta.appendChild(img);
    } else if (file.type === 'Audio') {
      const audio = document.createElement('audio');
      audio.controls = true;
      const urlPath = normPath(file.path);
      audio.src = '/' + urlPath;
      audio.setAttribute('aria-label', file.filename || 'audio');
      meta.appendChild(audio);
    }

    const status = document.createElement('div');
    status.className = 'meta-status';
    status.textContent = dbRow ? ('DB id: ' + dbRow.ID) : 'Not in DB';
    if (!dbRow) {
      div.classList.add('unused');
    } else {
      const refCount = Number(dbRow.refCount) || 0;
      if (refCount === 0) {
        div.classList.add('unused');
        const note = document.createElement('div');
        note.className = 'meta-note';
        note.textContent = 'Not referenced by any question';
        meta.appendChild(note);
      } else if (refCount > 0) {
        const note = document.createElement('div');
        note.className = 'meta-note';
        note.textContent = 'Referenced by ' + refCount + ' question' + (refCount > 1 ? 's' : '');
        meta.appendChild(note);
        if (Array.isArray(dbRow.refs) && dbRow.refs.length) {
          const list = document.createElement('ul');
          list.className = 'meta-ref-list';
          dbRow.refs.forEach((ref) => {
            const li = document.createElement('li');
            li.className = 'meta-ref-item';
            li.textContent = 'Kategorie ' + ref.Kategorie + ' — Frage ' + ref.FNUMBER;
            list.appendChild(li);
          });
          meta.appendChild(list);
        }
      }
    }
    meta.appendChild(status);

    const controls = document.createElement('div');
    controls.className = 'controls';

    const btnSync = document.createElement('button');
    btnSync.textContent = dbRow ? 'Refresh DB info' : 'Add to DB';
    btnSync.className = 'btn-sync-row';
    btnSync.addEventListener('click', function () {
      fetch(origin + '/api/media/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: [file.path] }),
      })
        .then(async (r) => {
          if (!r.ok) {
            const txt = await r.text();
            throw new Error(txt || 'Sync failed');
          }
          return r.json();
        })
        .then(() => fetchAndRender())
        .catch((e) => alert('Sync failed: ' + (e && e.message ? e.message : e)));
    });
    controls.appendChild(btnSync);

    if (dbRow) {
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Delete DB (keep file)';
      btnDel.className = 'btn-delete-db';
      btnDel.addEventListener('click', function () {
        if (!confirm('Delete DB row for this media?')) return;
        fetch(origin + '/api/media/' + encodeURIComponent(dbRow.ID) + '?deleteFile=false', { method: 'DELETE' })
          .then((r) => {
            if (!r.ok) throw new Error('Delete failed');
            return r.json();
          })
          .then(() => fetchAndRender())
          .catch((e) => alert('Delete failed: ' + (e && e.message ? e.message : e)));
      });
      controls.appendChild(btnDel);

      const btnDelFile = document.createElement('button');
      btnDelFile.textContent = 'Delete DB + File';
      btnDelFile.addEventListener('click', function () {
        if (!confirm('Delete DB row AND file? This is irreversible.')) return;
        fetch(origin + '/api/media/' + encodeURIComponent(dbRow.ID) + '?deleteFile=true', { method: 'DELETE' })
          .then((r) => {
            if (!r.ok) throw new Error('Delete failed');
            return r.json();
          })
          .then(() => fetchAndRender())
          .catch((e) => alert('Delete failed: ' + (e && e.message ? e.message : e)));
      });
      controls.appendChild(btnDelFile);
    }

    div.appendChild(meta);
    div.appendChild(controls);
    return div;
  }

  function render(files, dbByPath) {
    if (!mediaList) return;
    mediaList.innerHTML = '';
    const filePaths = new Set();
    files.forEach((f) => {
      filePaths.add(f.path);
      const dbRow = dbByPath[f.path] || null;
      mediaList.appendChild(createRow(f, dbRow));
    });

    // append DB-only entries (files that are referenced in DB but missing on disk)
    const dbOnly = [];
    for (const p in dbByPath) {
      if (!filePaths.has(p)) {
        const dbRow = dbByPath[p];
        const np = normPath(p);
        const parts = np.split('/');
        const fakeFile = { path: np, filename: parts.pop(), type: dbRow.Type || 'Bild' };
        dbOnly.push({ file: fakeFile, dbRow });
      }
    }
    if (dbOnly.length) {
      const hdr = document.createElement('h2');
      hdr.textContent = 'Missing files (DB only)';
      hdr.style.marginTop = '1rem';
      hdr.style.fontSize = '1.0rem';
      mediaList.appendChild(hdr);
      dbOnly.forEach((item) => mediaList.appendChild(createRow(item.file, item.dbRow)));
    }
  }

  function fetchAndRender() {
    if (!mediaList) return;
    fetch(origin + '/api/media/files')
      .then(async (r) => {
        if (!r.ok) {
          const txt = await r.text();
          throw new Error(txt || 'Fetch failed');
        }
        return r.json();
      })
      .then((body) => {
        render(body.files || [], body.dbByPath || {});
      })
      .catch((e) => {
        console.error(e);
        alert('Failed to fetch media files: ' + (e && e.message ? e.message : e));
      });
  }

  if (refreshBtn) refreshBtn.addEventListener('click', fetchAndRender);
  if (syncBtn) syncBtn.addEventListener('click', function () {
    const deleteDbMissing = deleteDbMissingCheckbox.checked;
    if (!confirm('Sync filesystem to DB? This will add missing files to the database' + (deleteDbMissing ? ' and delete DB entries for missing files.' : '.'))) return;
    fetch(origin + '/api/media/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteDbMissing }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const txt = await r.text();
          throw new Error(txt || 'Sync failed');
        }
        return r.json();
      })
      .then((body) => {
        let msg = '';
        if (body.inserted && body.inserted.length) msg += 'Inserted: ' + body.inserted.map((i) => i.path).join(', ') + '\n';
        if (body.removedDbIds && body.removedDbIds.length) msg += 'Removed DB IDs: ' + body.removedDbIds.join(', ') + '\n';
        if (body.errors && body.errors.length) msg += 'Errors: ' + JSON.stringify(body.errors) + '\n';
        alert(msg || 'Sync completed');
        fetchAndRender();
      })
      .catch((e) => alert('Sync failed: ' + (e && e.message ? e.message : e)));
  });

  // initial load
  fetchAndRender();
})();
