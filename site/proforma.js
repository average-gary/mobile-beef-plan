// Illustrative pro forma. With the default Full-service-only tier mix it must match tools/reference/proforma.py
// (which has no tiers).

// Shares of head by service tier. Rejected (throws) unless they are >= 0 and sum to 1 within 0.001; not normalized,
// so a typo cannot silently rescale the other tiers.
export function tierMix(a) {
  const m = { full: a.tierMixFull, coached: a.tierMixCoached, rental: a.tierMixRental };
  const sum = m.full + m.coached + m.rental;
  if (!Object.values(m).every(v => v >= 0) || Math.abs(sum - 1) > 0.001) throw new RangeError(`Tier mix must sum to 1 (got ${+sum.toFixed(4)})`);
  return m;
}

// Revenue per head for each tier. Full = Option B formula; Coached and Rental = rental fee (+ coaching) + cooler storage.
export function tierRevenue(a) {
  const storage = a.storageFeePerHeadWeek * a.storageWeeks;
  return {
    full: a.killFee + a.mileagePerHead + a.cutPerLb * a.hangingWeight + a.extrasPerHead,
    coached: a.rentalFeePerHead + a.coachingFeePerHead + storage,
    rental: a.rentalFeePerHead + storage,
  };
}

// Staff hours the mix needs vs employee + owner hours available. Payroll still follows employeeHours; this is a check.
export function laborCheck(a, head, employeeHours, ownerHours = 2500) {
  const m = tierMix(a);
  const hoursNeeded = head * (m.full * a.staffHoursFullPerHead + m.coached * a.staffHoursCoachedPerHead + m.rental * a.staffHoursRentalPerHead);
  const hoursAvailable = employeeHours + ownerHours;
  return { hoursNeeded, hoursAvailable, utilization: hoursNeeded / hoursAvailable };
}

export function computeYear(a, head, employeeHours) {
  const m = tierMix(a), t = tierRevenue(a);
  const revenuePerHead = m.full * t.full + m.coached * t.coached + m.rental * t.rental;
  const revenue = head * revenuePerHead;
  const payroll = employeeHours * a.wage * (1 + a.payrollBurden);
  const packaging = a.packagingPerHead * head * m.full;                                      // Full only: company cuts and packs
  const rendering = a.renderingPerHead * head * (m.full + m.coached * a.renderingCoached);  // Rental: offal stays on renter's farm
  const fuel = a.fuelPerKillDay * head / a.headPerKillDay;
  const utilities = a.coolerUtilities + a.sewerBase + a.sewerGalPerHead * head * a.sewerPer1000Gal / 1000;
  const insurance = a.insuranceRevenueShare * revenue + (a.wcRatePer100 / 100) * payroll;
  const lease = a.siteLease;
  const professional = a.professional;
  const opex = payroll + packaging + rendering + fuel + utilities + insurance + lease + professional;
  const ebitda = revenue - opex;
  const totalCapex = a.capexUnit + a.capexTow + a.capexCooler + a.capexSewer + a.capexWorkingCapital;
  const debt = totalCapex * a.debtFraction;
  const i = a.interestRate / 12, n = a.termYears * 12;
  const payment = i === 0 ? debt / n : debt * i / (1 - (1 + i) ** -n);
  const debtService = 12 * payment;
  const depreciation = (totalCapex - a.capexWorkingCapital) / a.depreciationYears;
  return { head, revenue, revenuePerHead, payroll, packaging, rendering, fuel, utilities, insurance, lease, professional,
    opex, ebitda, debtService, cash: ebitda - debtService, depreciation, totalCapex, debt };
}

export function projection(a) {
  return a.years.map(y => computeYear(a, y.head, y.employeeHours));
}

export function breakEvenHead(a, cashTarget = 0) {
  const hours = a.years[a.years.length - 1].employeeHours;
  for (let h = 50; h < 900; h++) if (computeYear(a, h, hours).cash >= cashTarget) return h;
  return null;
}

export function sensitivity(a, cutPrices) {
  const y3 = a.years[2];
  return cutPrices.map(cutPerLb => {
    const b = { ...a, cutPerLb };
    return { cutPerLb, year3Cash: computeYear(b, y3.head, y3.employeeHours).cash, breakEvenWithOwner: breakEvenHead(b, a.ownerDraw) };
  });
}

export function flatten(json) {
  const out = { years: json.years };
  for (const g of json.groups) for (const it of g.items) out[it.key] = it.value;
  return out;
}
