---
title: "Option G: No Static Site"
category: option
status: candidate
sources:
  - raw/data/2026-10-02-r3-cooler-turnkey-mobile-cut-pack-units-and-aging-modules.md
  - raw/papers/2026-10-02-r3-cooler-iowa-state-small-red-meat-plant-design-guide.md
  - raw/articles/2026-10-02-r3-cutshop-nmpan-costing-throughput-cutter-productivity.md
  - raw/articles/2026-10-02-reg-vdacs-red-meat-custom-exemptions.md
  - raw/articles/2026-10-02-r3-coolreg-frederick-county-zoning-ra.md
  - raw/articles/2026-10-02-r3-water-9vac25-32-vpa-scope-exclusions.md
  - raw/articles/2026-10-02-r2-disposal-deq-vswmr-exemptions-compost.md
  - raw/articles/2026-10-02-mkt-vdacs-afid-infrastructure-grants.md
  - raw/articles/2026-10-02-r2-fedgrant-reap-2026-final-rule.md
  - raw/articles/2026-10-12-r6-sba-vre-ch31-self-employment-38cfr.md
  - raw/data/2026-10-03-r5-tiers-gores-meats-frederick-shenandoah-price-tiers.md
created: 2026-10-12
updated: 2026-10-12
tags: [option, candidate, no-static-site, part-time-labor, batch-minimum, onboard-cooler, rolling-inventory, drop-trailer, reefer, aging, cut-on-farm, slot-capacity]
summary: "What if there is no company cooler at a fixed site? Carcasses must hang somewhere for chill plus 7-21 days of aging. G1 parks the unit at the farm for the hang: ruled out with full-time staff, but with part-time hourly labor the idle cost is the unit's ~$48k/yr debt service, and 5-8 head/farm at a 7-day hang (about 150-220 head/yr) clears a ~107-head break-even. G2 drops cheap rail-equipped reefer trailers at farms while the unit moves on: crew stays busy, but it needs about 8 coolers out at once at 2 head/farm [inferred] and their price is unknown. G3, a rolling onboard cooler (best fit): carcasses ride with the unit and rotate. Little's law sets the ceiling: slots = head/week x hang days / 7, so 8 slots give 400 head/yr at a 7-day hang but only 200 at 14 days, below the ~240-head break-even without a cooler site. Dropping the cooler, sewer and lease cuts capex from $471,576 to $405,000 and break-even with owner draw from 274 to 240 head, but it loses long aging, the AFID-fundable cooler, and puts cutting wash water on farms."
confidence: low
---

# Option G: No Static Site

> **Status: candidate.** Explored 2026-10-12 from three questions. Can the business run with no cooler at a static site?
> Could the unit stay at the farm during the hang? Could it travel with hanging beef and rotate it?
> All options: [[business-model-options|Business Model Options]] ([Business Model Options](../topics/business-model-options.md)). Not legal advice.
> No new sources were gathered; every number comes from earlier rounds or the calculator, and derived figures are marked [inferred].

## How it works

In [[option-b-cooler-dock-kill-and-cut|Option B]] ([Option B: Cooler-Dock Kill-and-Cut](option-b-cooler-dock-kill-and-cut.md)), the fixed cooler's real job is **aging time**: 7 days minimum, 14–21 common. Remove it, and each carcass needs another place to hang. There are three variants:

| Variant | Where the beef hangs | Verdict |
|---|---|---|
| **G1. Park the unit at the farm** | In the unit's cooler, parked at the owner's farm until it's time to cut | **Ruled out with full-time staff** (one job per cycle, crew idle). **Viable with part-time hourly labor** for 5-8 head batches at a 7-day hang (see Part-time labor) |
| **G2. Drop coolers** | In a cheap rail-equipped reefer trailer left at each farm, while the kill-and-cut unit moves on | Possible. Depends on the fleet cost, which is **unknown** |
| **G3. Rolling onboard cooler** | In the unit's onboard cooler. Carcasses ride along to later kills and are cut as each reaches its hang target | **Best fit.** Limited by the number of slots |

Cutting happens on farms in every variant, as in [[option-c-cooler-storage-cut-on-farm|Option C]] ([Option C: Storage-Only Cooler, Cut Back on the Farm](option-c-cooler-storage-cut-on-farm.md)), but now there's no cooler at all.

## Legal basis

- **Permit:** the same free VDACS Custom Permit. VDACS allows a custom "mobile slaughter **and processing** unit", and nothing found requires cutting to happen in a fixed building ([VDACS](../../raw/articles/2026-10-02-reg-vdacs-red-meat-custom-exemptions.md)).
- **Moving carcasses between sites:** split stages are allowed if the product is marked "Not for Sale" (Note 13). That likely covers carcasses riding between farms in G3 [inferred].
- **G1 and G2:** the carcass never leaves the owner's farm, which may be the cleanest custom-exempt arrangement [inferred].
- **G3:** owner A's carcass is cut while the unit is parked at farm C. Ask VDACS whether that is acceptable, and whether owners' carcasses can share the onboard cooler. Custom shops mix owners' carcasses routinely, but a mobile unit has not been confirmed [inferred].

## Zoning and site (Frederick County)

- **Removed:** the cooler-site problem. That means no M2 parcel or RA conditional use permit for a dock, and no § 165-204.17 setbacks at a company site ([RA](../../raw/articles/2026-10-02-r3-coolreg-frederick-county-zoning-ra.md)).
- **Sharper:** the open farm-side question for every option. Is a mobile unit killing and cutting on RA farms a "slaughterhouse / processing of meats" use? G3 sharpens it most, because it cuts **many owners'** beef at whichever farm it stops.
- **Still needed: a home base.** A loaded refrigerated unit needs a place to park overnight on shore power. A parked reefer full of carcasses is a static cooler by another name. How the county treats overnight parking or storage of a loaded unit **has not been researched**.

## Waste

- **Offal:** stays on the farm of kill under 9VAC20-81-95 D.4, as in every option ([DEQ](../../raw/articles/2026-10-02-r2-disposal-deq-vswmr-exemptions-compost.md)).
- **Cutting wash water:** generated on every farm where cutting happens. On the VPA text it is "industrial waste", so it needs a holding tank and a hauler ([VPA](../../raw/articles/2026-10-02-r3-water-9vac25-32-vpa-scope-exclusions.md)).
- **G3:** wash water lands on farm C for farm A's beef.

## Capacity and labor

**The ceiling is Little's law, not the cutters.** At steady state, carcasses on the rail = head per week × hang days ÷ 7 [inferred]. Rotating doesn't create capacity; slots do.

| Target | 7-day hang | 14-day hang | 21-day hang |
|---|---|---|---|
| ~4.8 head/wk (240/yr, break-even without a cooler site) | 5 slots | 10 slots | 15 slots |
| ~8 head/wk (cutter ceiling, two people) | 8 slots | 16 slots | 24 slots |

Onboard capacity (MPT&S quote classes): gooseneck 38–44 ft **4–8 beef**; 45 ft semi **9**; modular **6–16**. Sentinel's 53 ft unit has only a 10 ft cooler ([vendors](../../raw/data/2026-10-02-r3-cooler-turnkey-mobile-cut-pack-units-and-aging-modules.md)). MPT&S's quote form asks for the "number of days carcasses will be chilled in this unit", so the vendor expects buyers to hang carcasses onboard.

**An 8-slot unit tops out at 400 head/yr at a 7-day hang, and 200 at 14 days** (calculator, 50-week season).

**Hot carcasses.** Each kill loads 100°F carcasses next to aging ones, which raises the cooler's temperature and humidity, and moisture condenses on the cold carcasses. Plants chill in a separate room: Iowa State sizes a dedicated pre-chill load of 5,000 lb from 100°F to 36°F in 24 h ([Iowa State](../../raw/papers/2026-10-02-r3-cooler-iowa-state-small-red-meat-plant-design-guide.md)). G3 needs **a separate pull-down compartment** [inferred]. Friesla's drawdown cooler chills 3,000 lb in 24 h, about **4 head a day**, which also caps daily kills.

**G1 math** [inferred]: an 8-slot unit with a farm of 8 head and about 4 cut days (2 cutters, 8 h per custom beef). The cycle is about 12 days at a 7-day hang (≈4.7 head/wk) and about 19 days at 14 days (≈2.9/wk). Most farm-kill customers have 1–3 head, so the real figure is lower. The crew is idle during the hang.

**G2 math** [inferred]: drop coolers needed ≈ jobs hanging at once. At 8 head/wk, a 14-day hang and 2 head per farm, that's about 8 coolers out at once. Every farm needs power or a generator for its cooler.

**Cutting on farms** loses efficiency. Option C estimates 1–2 carcasses per cut stop (NMPAN productivity: about 8 man-hours per custom beef) ([NMPAN](../../raw/articles/2026-10-02-r3-cutshop-nmpan-costing-throughput-cutter-productivity.md)). G3 also needs onboard freezer space or a delivery loop to get packaged beef back to its owner. MPT&S's freezer option holds about 5 beef.

## Economics

Calculator preset: cooler, sewer and site lease set to 0, with the $300k unit price unchanged.

| | Option B (plan) | G3 preset |
|---|---|---|
| Start-up capital | $471,576 | **$405,000** |
| Y1 / Y2 / Y3 cash for owner | $17,799 / $70,685 / $129,507 | $44,653 / $97,704 / $156,650 |
| Break-even head (cash ≥ 0 / with $50k draw) | 210 / 274 | 176 / **240** |
| Max head with 8 slots (7-day / 14-day hang) | n/a | 400 / **200** |

- **Read it with care:**
  - The preset does **not** price the bigger unit G3 needs (12–16 slots, quote only).
  - It also leaves out 24/7 generator fuel, a separate chill compartment, delivery trips and spoilage insurance.
  - G3 only matches Option B's 274-head break-even once the unit costs about **$525,000**. Unmodelled costs pull that crossover lower [inferred].
- **Funding gets worse:**
  - The cooler was the natural AFID Infrastructure project, and the project REAP could fund later ([AFID](../../raw/articles/2026-10-02-mkt-vdacs-afid-infrastructure-grants.md), [REAP](../../raw/articles/2026-10-02-r2-fedgrant-reap-2026-final-rule.md)).
  - The rig fits neither: AFID may count it as a vehicle, REAP excludes trailer-mounted systems, and VR&E bars "trucks, cars, or other means of transportation" ([VR&E](../../raw/articles/2026-10-12-r6-sba-vre-ch31-self-employment-38cfr.md)).
  - G is close to **all debt**.
- **Revenue:** long aging is a priced tier locally (Gore's kill-and-age tier, 2023) ([Gore's](../../raw/data/2026-10-03-r5-tiers-gores-meats-frederick-shenandoah-price-tiers.md)). G3 at a 7-day hang gives that up, along with Option F's aging, storage and pickup-at-cooler add-ons.

## Part-time labor: G1 revisited

**Question:** "let's not assume full time employment. what about part time or half-time engagement for this? that would make the 'at the farm' a bit more doable?"

Paying the crew only for hours worked (about 9 h per head: 8 to cut a custom beef + 1 to kill, NMPAN/Lorentz 2010) removes G1's idle-crew cost. **The idle cost becomes the unit**: about **$48,206/yr of debt service** on the $405,000 no-cooler capex (calculator), plus insurance. So G1 stops being a labor question and becomes a question of how many head one parked unit can turn in a year.

**What one parked unit can turn** [inferred]. Cycle = 1 kill day + hang + cut days (2 cutters at 8 h per custom beef ≈ 2 head per cut day), 90% of the calendar booked, one farm's animals per cycle:

| Head per farm | 7-day hang | 14-day hang |
|---|---|---|
| 2 | ~73 head/yr | ~41 |
| 3 | ~99 | ~58 |
| 5 | ~149 | ~91 |
| 8 | ~219 | ~138 |

**Break-even with labor paid by the hour** (calculator: employee hours = 9 × head at $20.03 + 15% burden, owner unpaid on top; "cash" = EBITDA − debt service):

| Setup | Cash ≥ $0 | Cash ≥ $50k | Cash at 150 head |
|---|---|---|---|
| No cooler, $300k unit | **107 head** | 197 | $24,002 |
| No cooler, $200k unit | **86 head** | 176 | $35,905 |
| Option B (static cooler), same hourly labor | 155 | 246 | −$2,769 |

If the owner does the cutting, their wages for those hours add to the "cash" line.

**Reading the tables together** [inferred]: G1 works under part-time labor only as a **short-hang, big-batch service**.
- **5-8 head per farm at a 7-day hang** (about 150-220 head/yr) clears break-even: about $24k-$50k/yr cash, plus any owner wages.
- **2-3 head per farm**, typical of freezer-beef customers, doesn't clear it at any hang length.
- **A 14-day hang** doesn't clear it at any batch size unless the unit costs well under $300k.

It is a smaller, lifestyle-scale business that books fewer, larger jobs.

**Part-time labor catches:**
- **Recruiting:** "Butchers at half-time are hard to recruit," and a good cutter takes about 2 years to train ([[msu-failure-modes|failure mode 3]] ([Why Mobile Slaughter Units Fail](../concepts/msu-failure-modes.md))). An owner-operator who cuts avoids the problem.
- **GI Bill OJT** needs a job that "customarily requires full-time training", so a part-time cutter can't draw it ([GI Bill OJT](../../raw/articles/2026-10-12-r6-sba-gi-bill-ojt-apprenticeship-meat-cutter.md)).
- **WOTC** pays 40% only at 400+ hours (25% at 120-399), and it has lapsed for hires after 12/31/2025 ([WOTC](../../raw/articles/2026-10-12-r6-sba-wotc-veteran-hiring-credit-lapsed.md)).
- **Workers' comp** stays at the NCCI 2081 butchering rate per $100 of payroll whatever the hours.
- **Fall peak:** on-call crew must be available exactly when every farm wants a kill.

**Making G1 work:**
- **Batch minimum.** Book about 4+ head per farm visit; price smaller jobs higher or send them to G3.
- **G1 + G3 hybrid.** Park the unit for big batches; run rolling-cooler rounds for 1-3 head jobs between them. Slot math and part-time labor apply to both.
- **A cheaper unit.** At $200k, break-even falls to about 86 head, so the 38-44 ft gooseneck quote matters more under this model.
- **Short hang as the default product**, with longer aging as a premium only where the calendar allows.

## What it fixes

- No M2 parcel or RA conditional use permit for a cooler site. No sewer connection, and no dock wastewater.
- About $66,576 less start-up capital and $18,000/yr less lease in the calculator.
- A faster start: no site search, land purchase or permits for the site.

## What it costs

- **Slots become the ceiling.** 14–21-day aging needs a 10–24 slot unit, effectively a semi on farm lanes.
- **Hot carcasses and aging ones share a cooler**, unless the unit is built with two compartments.
- **Risk is concentrated.** Every customer's beef is in one box running 24/7. A generator or refrigeration failure spoils several owners' beef at once.
- **Cutting moves to farms**, bringing wash water on every farm, more trips and lower cut-day efficiency.
- **The farm-side zoning question gets sharper**, and a home base is still needed.
- **It loses the AFID and REAP cooler fit**, so nearly all of it is debt.

## Open questions

1. MPT&S quote: a 12–16 slot modular unit with a separate chill compartment and onboard freezer.
2. Used rail-equipped reefer trailer prices, power hookups and cellular temperature alarms (G2). **Not found in any round.**
3. VDACS: may one owner's carcass be cut on another owner's farm, and may owners' carcasses share the onboard cooler?
4. Frederick County: overnight parking and storage of a loaded refrigerated unit at the home base; farm-side cutting of many owners' beef.
5. How many Valley customers book 4+ head per farm visit; whether a batch minimum or small-job surcharge is acceptable.
6. Part-time cutter availability in the Winchester area; on-call pay norms.
7. Generator fuel per 24 h of refrigeration; spoilage and bailee insurance for carcasses in transit.

## Verdict

**Candidate, narrow.**
- **G1** is ruled out with full-time staff. **With part-time, paid-by-the-hour labor it is viable as a short-hang, big-batch service**: 5-8 head per farm at a 7-day hang, about 150-220 head/yr, break-even about 107 head with a $300k unit or 86 with $200k.
- **G3** works as a **7-day-hang service on an 8–9 slot unit**, about 6–8 head a week. That's around break-even with little room for the fall peak.
- **G2** can't be judged until reefer trailer prices are found.
- Longer aging favours a static cooler, as in Option B or Option C, unless a 12–16 slot two-compartment unit quotes well under about $525k.
- **Strongest no-static-site configuration** [inferred]: part-time or owner-operator labor, a G1 + G3 hybrid with a batch minimum, and a 7-day hang as standard.
- Next step: get the MPT&S quote, the reefer trailer prices, and test local demand for 4+ head bookings.

## See Also

- [[business-model-options|Business Model Options]] ([Business Model Options](../topics/business-model-options.md))
- [[option-b-cooler-dock-kill-and-cut|Option B: Cooler-Dock Kill-and-Cut]] ([Option B: Cooler-Dock Kill-and-Cut](option-b-cooler-dock-kill-and-cut.md))
- [[option-c-cooler-storage-cut-on-farm|Option C: Storage-Only Cooler, Cut Back on the Farm]] ([Option C: Storage-Only Cooler, Cut Back on the Farm](option-c-cooler-storage-cut-on-farm.md))
- [[option-a-kill-only-partner-cut-shop|Option A: Kill-Only Mobile Unit + Partner Cut Shop]] ([Option A: Kill-Only Mobile Unit + Partner Cut Shop](option-a-kill-only-partner-cut-shop.md))
- [[cooler-backed-mobile-model|Cooler-Backed Mobile Model]] ([Cooler-Backed Mobile Model](../topics/cooler-backed-mobile-model.md))
- [[veteran-funding-mechanisms|Veteran Funding Mechanisms]] ([Veteran Funding Mechanisms](../topics/veteran-funding-mechanisms.md))
