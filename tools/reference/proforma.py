# Illustrative pro forma: cooler-backed custom-exempt mobile kill-and-cut. Assumptions labeled S(ourced) or P(laceholder).
HW=750                      # S: lb hanging/head (worked example used throughout wiki)
KILL=125; MILE=30; CUT=1.00; EXTRA=25   # S: $100-150 kill; P: mileage/head; S: $0.90-1.05/lb; S/P: aging+SRM+offal avg
def rev_head(cut=CUT): return KILL+MILE+cut*HW+EXTRA
WAGE=20.03*1.15             # S: VA mean butcher wage May 2025 + 15% burden (S: templates)
WC=10.89/100                # S: NCCI 2081 Iowa 2009 rate per $ payroll (placeholder for VA)
def year(head, emp_hours, cut=CUT, capex=None, rate=0.085, debt_frac=0.8, life=7):
    capex = capex or CAPEX
    r=head*rev_head(cut)
    payroll=emp_hours*WAGE
    pack=50*head            # P
    render=25*head          # P (CA $6/animal + SRM/hides)
    fuel=120*(head/4)       # P from Nevada 2007 $230/day for 2 units; 4 head/kill day
    util=7200; sewer=600+150*head*11/1000   # P; S rates
    ins=0.042*r + WC*payroll  # S CISA 2013 share + 2081 rate
    lease=18000             # P site
    prof=4000               # P accounting/legal/permit renewals
    opex=payroll+pack+render+fuel+util+sewer+ins+lease+prof
    total=sum(capex.values())
    debt=total*debt_frac; i=rate/12; n=120
    pmt=debt*i/(1-(1+i)**-n)*12
    dep=sum(v for k,v in capex.items() if k!='Working capital & permits')/life
    return dict(head=head,rev=r,payroll=payroll,pack=pack,render=render,fuel=fuel,util=util+sewer,ins=ins,lease=lease,prof=prof,opex=opex,
                ebitda=r-opex,debt_service=pmt,cash=r-opex-pmt,dep=dep,total_capex=total,debt=debt)
CAPEX={'Mobile kill-and-cut unit (Sentinel 53 ft list)':300000,'Tow tractor, used':60000,'Hanging cooler, ~400 sq ft + rail':60000,
       'Sewer connection (2019 fees)':6576,'Working capital & permits':45000}
if __name__=='__main__':
    print('rev/head', rev_head(), 'capex', sum(CAPEX.values()))
    for h,eh in [(200,2080),(300,3080),(375,3080)]:
        y=year(h,eh); print({k:round(v) for k,v in y.items()})
    # break-even head (cash after debt service, Y2 staffing)
    for capex_name,cx in [('semi',CAPEX),('lower-cost unit $200k',{**CAPEX,'Mobile kill-and-cut unit (Sentinel 53 ft list)':200000}),
                          ('kill-only $92k + cut-room trailer $100k',{**CAPEX,'Mobile kill-and-cut unit (Sentinel 53 ft list)':192000}),
                          ('$400k unit',{**CAPEX,'Mobile kill-and-cut unit (Sentinel 53 ft list)':400000})]:
        be=next(h for h in range(50,800) if year(h,3080,capex=cx)['cash']>=0)
        print(capex_name, 'cash break-even head', be, 'Y3 cash', round(year(375,3080,capex=cx)['cash']))
    for cut in (0.90,1.00,1.10,1.25):
        print('cut',cut,'Y3 cash',round(year(375,3080,cut=cut)['cash']),'BE',next(h for h in range(50,900) if year(h,3080,cut=cut)['cash']>=0))
