const KEY = 'mbp-diligence-v1';
const STATUSES = { todo: 'To do', progress: 'In progress', done: 'Done' };
const $ = (id) => document.getElementById(id);

function el(tag, props = {}, ...kids) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids);
  return e;
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.items) return s;
  } catch {}
  return { version: 1, items: {} };
}

let state = load();
let calls = [];
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
const item = (id) => (state.items[id] ||= { status: 'todo', notes: '', contacted: '' });

// Returns a clean state or throws with a readable message. Unknown call ids are dropped.
function validate(obj) {
  if (!obj || obj.version !== 1 || typeof obj.items !== 'object' || Array.isArray(obj.items)) {
    throw new Error('Expected {"version":1,"items":{...}}');
  }
  const ids = new Set(calls.map((c) => c.id));
  const items = {};
  for (const [id, v] of Object.entries(obj.items)) {
    if (!ids.has(id)) continue;
    if (!v || !Object.hasOwn(STATUSES, v.status)) throw new Error(`Bad status for "${id}"`);
    if (typeof v.notes !== 'string') throw new Error(`Bad notes for "${id}"`);
    if (typeof v.contacted !== 'string' || !/^(\d{4}-\d{2}-\d{2})?$/.test(v.contacted)) {
      throw new Error(`Bad date for "${id}" (use YYYY-MM-DD)`);
    }
    items[id] = { status: v.status, notes: v.notes, contacted: v.contacted };
  }
  return { version: 1, items };
}

function progress() {
  const n = (s) => calls.filter((c) => (state.items[c.id]?.status || 'todo') === s).length;
  $('progress').textContent =
    `${n('done')} of ${calls.length} calls done, ${n('progress')} in progress, ${n('todo')} to do.`;
}

function renderCalls(rawBase) {
  $('calls').replaceChildren(...calls.map((c) => {
    const it = item(c.id);
    const id = (f) => `${c.id}-${f}`;

    const status = el('select', { id: id('status') },
      ...Object.entries(STATUSES).map(([v, t]) => el('option', { value: v, textContent: t, selected: it.status === v })));
    status.value = it.status;
    const date = el('input', { type: 'date', id: id('date'), value: it.contacted });
    const notes = el('textarea', { id: id('notes'), rows: 2, value: it.notes });

    status.onchange = () => { it.status = status.value; save(); progress(); };
    date.onchange = () => { it.contacted = date.value; save(); };
    notes.oninput = () => { it.notes = notes.value; save(); };

    const meta = el('p', { className: 'muted' }, `Weeks ${c.weeks} · Informs: ${c.decision}`);
    if (c.phone) meta.append(' · ', el('a', { href: `tel:${c.phone}`, textContent: c.phone }));
    if (c.source) meta.append(' · ', el('a', { href: rawBase + c.source, textContent: 'source' }));

    return el('li', {}, el('div', { style: 'flex:1' },
      el('h3', { textContent: `${c.n}. ${c.who}`, style: 'margin-top:.25em' }),
      el('p', { textContent: c.ask }),
      meta,
      el('div', { className: 'grid-2' },
        el('div', { className: 'field' }, el('label', { htmlFor: id('status'), textContent: 'Status' }), status),
        el('div', { className: 'field' }, el('label', { htmlFor: id('date'), textContent: 'Date contacted' }), date)),
      el('div', { className: 'field' }, el('label', { htmlFor: id('notes'), textContent: 'Notes' }), notes)));
  }));
  progress();
}

function renderDeadlines(deadlines, rawBase) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  $('deadlines').replaceChildren(...deadlines.map((d) => {
    const [y, m, day] = d.date.split('-').map(Number);
    const left = Math.round((new Date(y, m - 1, day) - today) / 86400000);
    const leftText = left < 0 ? 'passed' : left === 0 ? 'today' : String(left);
    const note = el('td', {}, d.note);
    if (d.source) note.append(' ', el('a', { href: rawBase + d.source, textContent: 'source' }));
    return el('tr', {},
      el('td', {}, el('time', { dateTime: d.date, textContent: d.date })),
      el('td', { className: 'num', textContent: leftText }),
      el('td', { textContent: d.title }),
      note);
  }));
}

try {
  const data = await (await fetch('diligence.json')).json();
  calls = data.calls;
  renderCalls(data.rawBase);
  renderDeadlines(data.deadlines, data.rawBase);
  save();

  $('export').onclick = () => {
    const a = el('a', {
      href: URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })),
      download: `mbp-diligence-${new Date().toISOString().slice(0, 10)}.json`,
    });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  $('import').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state = validate(JSON.parse(await file.text()));
      save();
      renderCalls(data.rawBase);
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
    e.target.value = '';
  };

  $('clear').onclick = () => {
    if (!confirm('Clear all statuses, notes and dates saved in this browser?')) return;
    state = { version: 1, items: {} };
    localStorage.removeItem(KEY);
    renderCalls(data.rawBase);
  };
} catch (err) {
  $('progress').textContent = `Could not load the call list (${err.message}). See the business plan, Section 11.`;
}
