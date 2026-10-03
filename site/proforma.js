// Illustrative pro forma. Must match tools/reference/proforma.py.

export function computeYear(a, head, employeeHours) {
  const revenuePerHead = a.killFee + a.mileagePerHead + a.cutPerLb * a.hangingWeight + a.extrasPerHead;
  const revenue = head * revenuePerHead;
  const payroll = employeeHours * a.wage * (1 + a.payrollBurden);
  const packaging = a.packagingPerHead * head;
  const rendering = a.renderingPerHead * head;
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
