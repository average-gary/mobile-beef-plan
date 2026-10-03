import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { computeYear, projection, breakEvenHead, sensitivity, flatten, laborCheck, tierRevenue } from '../site/proforma.js';

const json = JSON.parse(readFileSync(new URL('../site/assumptions.json', import.meta.url)));
const a = flatten(json);
const r = Math.round;

test('every item has complete metadata', () => {
  for (const g of json.groups) for (const it of g.items) {
    for (const k of ['key', 'label', 'value', 'unit', 'min', 'max', 'step', 'source', 'year']) assert.ok(it[k] !== undefined && it[k] !== '', `${it.key}.${k}`);
    assert.ok(['sourced', 'placeholder'].includes(it.status), it.key);
    assert.ok(it.min <= it.value && it.value <= it.max, `${it.key} in range`);
  }
  assert.equal(Object.keys(a).length, 41); // 29 original keys + 11 service-tier keys + years
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

// Service tiers. Defaults: Full = 125 + 30 + 1.00*750 + 25 = 930; storage = 25*2 = 50;
// Coached = 400 + 375 + 50 = 825; Rental = 400 + 50 = 450. Debt service 56,129.93 is mix-independent.
// Mix-independent Y3 (375 head, 3,080 h) lines: payroll 3080*20.03*1.15 = 70,946.26; fuel 120*375/4 = 11,250;
// utilities 7200 + 600 + 150*375*11/1000 = 8,418.75; WC 0.1089*70,946.26 = 7,726.05; lease 18,000; professional 4,000.
const mix = (f, c, rr) => ({ ...a, tierMixFull: f, tierMixCoached: c, tierMixRental: rr });

test('default mix (Full = 1) reproduces golden numbers', () => {
  assert.deepEqual(tierRevenue(a), { full: 930, coached: 825, rental: 450 });
  assert.deepEqual(projection(a), projection(mix(1, 0, 0)));
  assert.equal(projection(a)[2].revenuePerHead, 930);
  assert.equal(r(projection(a)[2].cash), 129507);
});

test('100% rental mix, hand-checked', () => {
  // Y3: revenue 375*450 = 168,750; packaging 0; rendering 0; insurance 0.042*168,750 + 7,726.05 = 14,813.55
  // opex = 70,946.26 + 11,250 + 8,418.75 + 14,813.55 + 18,000 + 4,000 = 127,428.56; cash = 41,321.44 - 56,129.93 = -14,808.49
  const y3 = projection(mix(0, 0, 1))[2];
  assert.equal(y3.revenuePerHead, 450);
  assert.equal(y3.packaging, 0);
  assert.equal(y3.rendering, 0);
  assert.equal(r(y3.cash), -14808);
});

test('50/30/20 mix, hand-checked', () => {
  // rev/head 0.5*930 + 0.3*825 + 0.2*450 = 802.5; Y3 revenue 300,937.5; packaging 50*375*0.5 = 9,375;
  // rendering 25*375*(0.5 + 0.3*1) = 7,500; insurance 0.042*300,937.5 + 7,726.05 = 20,365.42
  // opex = 70,946.26 + 9,375 + 7,500 + 11,250 + 8,418.75 + 20,365.42 + 18,000 + 4,000 = 149,855.43
  // cash = 300,937.5 - 149,855.43 - 56,129.93 = 94,952.14
  const y3 = projection(mix(0.5, 0.3, 0.2))[2];
  assert.equal(y3.revenuePerHead, 802.5);
  assert.equal(y3.packaging, 9375);
  assert.equal(y3.rendering, 7500);
  assert.equal(r(y3.cash), 94952);
});

test('tier mix not summing to 1 is rejected (not normalized)', () => {
  assert.throws(() => computeYear(mix(0.5, 0.3, 0.3), 375, 3080), RangeError);
  assert.throws(() => computeYear(mix(1.2, -0.2, 0), 375, 3080), RangeError);
  assert.throws(() => laborCheck(mix(0, 0, 0), 375, 3080), RangeError);
  assert.doesNotThrow(() => computeYear(mix(0.33, 0.33, 0.34), 375, 3080));
});

test('laborCheck math', () => {
  // Full only: 375*9 = 3,375 needed; 3,080 + 2,500 = 5,580 available; 60.5%
  assert.deepEqual(laborCheck(a, 375, 3080), { hoursNeeded: 3375, hoursAvailable: 5580, utilization: 3375 / 5580 });
  // 50/30/20: 375*(0.5*9 + 0.3*3 + 0.2*1.5) = 375*5.7 = 2,137.5; owner hours 0 -> 2,137.5/2,080
  const l = laborCheck(mix(0.5, 0.3, 0.2), 375, 2080, 0);
  assert.ok(Math.abs(l.hoursNeeded - 2137.5) < 1e-9);
  assert.equal(l.hoursAvailable, 2080);
  assert.ok(l.utilization > 1);
});
