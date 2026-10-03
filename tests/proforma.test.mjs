import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { computeYear, projection, breakEvenHead, sensitivity, flatten } from '../site/proforma.js';

const json = JSON.parse(readFileSync(new URL('../site/assumptions.json', import.meta.url)));
const a = flatten(json);
const r = Math.round;

test('every item has complete metadata', () => {
  for (const g of json.groups) for (const it of g.items) {
    for (const k of ['key', 'label', 'value', 'unit', 'min', 'max', 'step', 'source', 'year']) assert.ok(it[k] !== undefined && it[k] !== '', `${it.key}.${k}`);
    assert.ok(['sourced', 'placeholder'].includes(it.status), it.key);
    assert.ok(it.min <= it.value && it.value <= it.max, `${it.key} in range`);
  }
  assert.equal(Object.keys(a).length, 30); // 29 keys + years
});

test('projection golden numbers', () => {
  const p = projection(a);
  assert.equal(r(p[0].totalCapex), 471576);
  assert.equal(r(p[0].revenue), 186000);
  assert.equal(r(p[0].debtService), 56130);
  assert.deepEqual(p.map(y => r(y.cash)), [17799, 70685, 129507]);
  assert.equal(r(p[0].depreciation), 60939);
  assert.equal(r(computeYear(a, 375, 3080).opex), 163114);
});

test('break-even golden numbers', () => {
  assert.equal(breakEvenHead(a, 0), 210);
  assert.equal(breakEvenHead(a, 50000), 274);
  assert.equal(breakEvenHead({ ...a, capexUnit: 192000 }, 0), 194);
  assert.equal(breakEvenHead({ ...a, capexUnit: 192000 }, 50000), 258);
  assert.equal(breakEvenHead({ ...a, capexUnit: 400000 }, 0), 226);
  assert.equal(breakEvenHead({ ...a, capexUnit: 400000 }, 50000), 289);
  assert.equal(breakEvenHead({ ...a, killFee: 0, cutPerLb: 0 }, 0), null);
});

test('sensitivity golden numbers', () => {
  const s = sensitivity(a, [0.90, 1.00, 1.10, 1.25]);
  assert.deepEqual(s.map(x => r(x.year3Cash)), [102563, 129507, 156450, 196866]);
  assert.deepEqual(s.map(x => x.breakEvenWithOwner), [302, 274, 251, 223]);
});
