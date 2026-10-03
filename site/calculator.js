import { flatten, projection, breakEvenHead, sensitivity } from './proforma.js';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const int = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const CUTS = [0.90, 1.00, 1.10, 1.25];
const $ = (id) => document.getElementById(id);

function el(tag, props = {}, ...kids) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids);
  return e;
}

// One labelled number input. Returns the .field wrapper; the input carries data-key.
function field(key, value, extra = {}) {
  const input = el('input', { type: 'number', id: 'in-' + key, value: String(value), step: extra.step ?? 'any', inputMode: 'decimal' });
  input.dataset.key = key;
  if (extra.min != null) input.min = extra.min;
  if (extra.max != null) input.max = extra.max;
  const range = extra.min != null && extra.max != null ? ` between ${extra.min} and ${extra.max}` : extra.min != null ? ` of at least ${extra.min}` : '';
  const err = el('p', { className: 'error', id: 'err-' + key, hidden: true, textContent: `Enter a number${range}.` });
  input.setAttribute('aria-describedby', err.id + (extra.descId ? ' ' + extra.descId : ''));
  if (extra.ariaLabel) input.setAttribute('aria-label', extra.ariaLabel);
  return { input, err };
}

let defaults = {};          // key -> default number (items + y1head, y1hours, ...)
let inputs = [];
let groupsJson;

function buildForm(json) {
  const groups = $('groups');
  groups.replaceChildren();
  for (const g of json.groups) {
    const fs = el('fieldset', {}, el('legend', { textContent: g.title }));
    for (const it of g.items) {
      defaults[it.key] = it.value;
      const descId = 'src-' + it.key;
      const { input, err } = field(it.key, it.value, { ...it, descId });
      const placeholder = it.status === 'placeholder';
      const badge = el('span', { className: placeholder ? 'placeholder-badge' : 'sourced-badge', textContent: placeholder ? 'placeholder' : 'sourced' });
      const label = el('label', { htmlFor: input.id }, it.label + (it.unit ? ` (${it.unit})` : '') + ' ', badge);
      const src = [it.source, it.year].filter(Boolean).join(', ');
      const desc = el('small', { className: 'muted', id: descId, textContent: [src, it.note].filter(Boolean).join(' — ') });
      fs.append(el('div', { className: 'field' }, label, input, err, desc));
      inputs.push(input);
    }
    groups.append(fs);
  }
  const tbody = $('years');
  json.years.forEach((y, i) => {
    const n = i + 1;
    const row = el('tr', {}, el('th', { scope: 'row', textContent: 'Year ' + n }));
    for (const [prop, name] of [['head', 'head'], ['employeeHours', 'hours']]) {
      const key = `y${n}${name}`;
      defaults[key] = y[prop];
      const { input, err } = field(key, y[prop], { min: 0, step: 1, ariaLabel: `Year ${n} ${prop === 'head' ? 'head' : 'employee hours'}` });
      row.append(el('td', {}, input, err));
      inputs.push(input);
    }
    tbody.append(row);
  });
}

// Reads inputs; returns {values, changed} or null if any input is invalid.
function readInputs() {
  let ok = true;
  const values = {};
  const changed = new URLSearchParams();
  for (const input of inputs) {
    const raw = input.value.trim();
    const v = Number(raw);
    const bad = raw === '' || !Number.isFinite(v) ||
      (input.min !== '' && v < +input.min) || (input.max !== '' && v > +input.max);
    $('err-' + input.dataset.key).hidden = !bad;
    input.setAttribute('aria-invalid', String(bad));
    if (bad) { ok = false; continue; }
    values[input.dataset.key] = v;
    if (v !== defaults[input.dataset.key]) changed.set(input.dataset.key, raw);
  }
  return ok ? { values, changed } : null;
}

function scenario(values) {
  const a = { ...flatten(groupsJson) };
  for (const k of Object.keys(a)) if (k in values) a[k] = values[k];
  a.years = groupsJson.years.map((_, i) => ({ head: values[`y${i + 1}head`], employeeHours: values[`y${i + 1}hours`] }));
  return a;
}

function kpi(label, value, negative = false) {
  return el('div', { className: 'kpi' + (negative ? ' negative' : '') },
    el('span', { className: 'kpi-value', textContent: value }), el('span', { className: 'kpi-label', textContent: label }));
}

const beText = (h) => (h == null ? 'Not reached' : int.format(h) + ' head');

function table(target, headers, rows) {
  const caption = target.querySelector('caption');
  const head = el('tr', {}, ...headers.map((h, i) => el('th', { scope: 'col', className: i ? 'num' : '', textContent: h })));
  const body = rows.map(([label, ...cells]) =>
    el('tr', {}, el('th', { scope: 'row', textContent: label }), ...cells.map((c) => el('td', { className: 'num', textContent: c }))));
  target.replaceChildren(...(caption ? [caption] : []), el('thead', {}, head), el('tbody', {}, ...body));
}

const LINES = [
  ['Head harvested', 'head', int], ['Revenue', 'revenue'], ['Payroll (incl. burden)', 'payroll'], ['Packaging', 'packaging'],
  ['Rendering / offal', 'rendering'], ['Fuel', 'fuel'], ['Utilities + sewer', 'utilities'], ['Insurance + workers comp', 'insurance'],
  ['Site lease', 'lease'], ['Professional / permits', 'professional'], ['Total opex', 'opex'], ['EBITDA', 'ebitda'],
  ['Debt service', 'debtService'], ['Cash for owner', 'cash'],
];

function render() {
  const read = readInputs();
  $('form-error').hidden = !!read;
  if (!read) return;   // keep last good results on screen

  const hash = read.changed.toString();
  history.replaceState(null, '', hash ? '#' + hash : location.pathname + location.search);

  const a = scenario(read.values);
  const years = projection(a);
  const last = years[years.length - 1];
  $('kpis').replaceChildren(
    kpi('Total start-up capital', usd.format(last.totalCapex)),
    kpi('Revenue per head', usd.format(last.revenuePerHead)),
    kpi('Break-even head (cash ≥ $0)', beText(breakEvenHead(a, 0))),
    kpi(`Break-even head with ${usd.format(a.ownerDraw)} owner draw`, beText(breakEvenHead(a, a.ownerDraw))),
    kpi(`Year ${years.length} cash for owner`, usd.format(last.cash), last.cash < 0),
  );
  table($('results'), ['', ...years.map((_, i) => 'Year ' + (i + 1))],
    LINES.map(([label, k, fmt = usd]) => [label, ...years.map((y) => fmt.format(y[k]))]));
  table($('sensitivity'), ['Cutting price ($/lb hanging)', `Year ${years.length} cash for owner`, 'Break-even head with owner draw'],
    sensitivity(a, CUTS).map((s) => ['$' + s.cutPerLb.toFixed(2), usd.format(s.year3Cash), beText(s.breakEvenWithOwner)]));
}

function loadHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  for (const input of inputs) input.value = params.has(input.dataset.key) ? params.get(input.dataset.key) : String(defaults[input.dataset.key]);
}

async function main() {
  try {
    const res = await fetch('assumptions.json');
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    groupsJson = await res.json();
  } catch (e) {
    $('groups').replaceChildren(el('p', { className: 'error', textContent: 'Could not load assumptions.json: ' + e.message }));
    return;
  }
  buildForm(groupsJson);
  loadHash();
  render();
  $('form').addEventListener('input', render);
  window.addEventListener('hashchange', () => { loadHash(); render(); });
  $('reset').addEventListener('click', () => {
    history.replaceState(null, '', location.pathname + location.search);
    loadHash(); render();
    $('status').textContent = 'Defaults restored.';
  });
  $('copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $('status').textContent = 'Link copied.';
    } catch {
      $('status').textContent = 'Copy failed — copy this URL: ' + location.href;
    }
  });
}

main();
