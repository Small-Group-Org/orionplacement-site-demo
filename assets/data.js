/* Orion Placement prototype: ALL sample data lives here.
   Every number, person detail, price and listing below is SAMPLE DATA awaiting Orion's figures.
   Pages render these values inside <span class="mark"> so they show as unconfirmed.
   Replace this file with real data; pages and components need no other change. */
window.ORION_DATA = {
  asOf: "October 2026",
  source: "Orion placement and posting records, sample figures",

  /* Owner decisions (marked everywhere they appear) */
  terms: {
    fee: "20% of first-year base salary",
    feeRate: 0.20,
    guarantee: "90-day replacement",
    guaranteeDays: 90,
    guaranteeDetail: "If the hire leaves or is let go within 90 days of the start date, we search again and send replacements at no extra fee.",
    payment: "invoice on the start date, due in 30 days",
    exclusivity: "Not required. Keep posting and using other recruiters.",
    upfront: "Nothing. No retainer, no fee unless you hire someone we introduced."
  },

  people: [
    { id: "justin", name: "Justin Sofman", initials: "JS", title: "Co-Founder & Managing Partner", phone: "(201) 572-9538",
      email: "justin@orionplacement.com", note: "Sends most candidate introductions and agrees terms with firms.",
      does: "Your first call. Takes the seat brief, sends the shortlist and agrees terms with your firm.",
      photo: "assets/images/founders/justin-sofman.png",
      calendly: "https://calendly.com/orionplacement/call-with-justin" },
    { id: "jon", name: "Jon Missirlian", initials: "JM", title: "Co-Founder & Head of Screening", phone: "(954) 859-9941",
      email: "jon@orionplacement.com", note: "Screens candidates before any profile is sent.",
      does: "Screens every candidate before you see a profile, and stays with them through the move.",
      photo: "assets/images/founders/jon-missirlian.jpg" }
  ],

  /* ===== Trust assets (round 3). ONLY these may be shown. Source: CRO.md section 2, captured 30 Oct 2026. =====
     rating, reviews, jonNamed, since, place, calendly: real. placements, clientFirms: Orion's own site claims, shown marked until confirmed. */
  trust: {
    rating: "5.0", reviews: 60, captured: "30 Oct 2026", jonNamed: 47,
    since: "2022", place: "Fort Lauderdale, Florida",
    placements: "500+", clientFirms: "200+",
    calendly: "https://calendly.com/orionplacement/call-with-justin",
    google: "https://www.google.com/search?q=Orion+Placement+reviews"
  },
  /* Orion in one line (entry pages) */
  orionLine: "Orion Placement is a legal recruiting firm in Fort Lauderdale that has placed attorneys and paralegals with law firms across the US since 2022.",
  /* Google reviews. Verbatim only. fragment: true = partial text, shown with a "[full text to pull]" mark. lead = words outside the quote marks. */
  reviews: [
    { id: "travis-bowen", name: "Travis Bowen", kind: "employer", quote: "Justin Sofman and Jon Missirlian have been relentless in helping us with the staffing needs of our Firm. They have successfully placed 2 new team members with us and we will use them for all of our future staffing needs. Orion Placement, Justin and Jon are professional, excellent at follow-up and experts in finding the talent we need." },
    { id: "lainie-james", name: "Lainie James", kind: "employer", quote: "Jon Missirlian has been a trusted recruiter for MS&A for quite some time, consistently delivering high-quality candidates. Beyond his professional expertise, he is always respectful and kind. Working with him has been a pleasure, and I know I can always rely on him to find top-tier talent." },
    { id: "brett-zimmerman", name: "Brett Zimmerman", kind: "employer", quote: "Jon did and amazing job finding me a perfect candidate for my company. He\u2019s above and beyond with his follow up with candidates. I will be using Orion Placement and Jon for all my future hires!" },
    { id: "lourdes-masson", name: "Lourdes Masson", kind: "employer", quote: "I\u2019ve worked with Orion Placement several times over the years, and they\u2019ve always been a pleasure to work with. They\u2019re trued professionals, communicate well, and consistently deliver great candidates. I wouldn\u2019t hesitate to recommend them to any law firm looking for a recruiting partner." },
    { id: "daffner-law", name: "Daffner Law", kind: "employer", quote: "Very attentive and does an excellent job - highly recommended!" },
    { id: "derek-letellier", name: "Derek Letellier", kind: "candidate", quote: "Jon did a phenomenal job connecting me to a fantastic opportunity. From the beginning, he was incredibly responsive, kept the process flowing, answered all the questions I had, and helped me secure my next role." },
    { id: "n-brown", name: "N Brown", kind: "candidate", quote: "They set great expectations and delivered for me within less than a week. This is perhaps the best result I have ever had while working through a placement agency. Their process is simple and effective; I felt like I had someone on the inside working for me. Kudos and many thanks again." },
    { id: "vera-massey", name: "Vera Massey", kind: "candidate", quote: "Jon was incredibly professional, responsive, and genuinely cared about helping me. He guided me through every step of the process and made the transition smooth and stress-free." },
    { id: "rafael-jimenez", name: "Rafael Jimenez", kind: "candidate", quote: "Justin at Orion was able to find me a perfect paralegal position within two weeks of us getting in touch. I am forever grateful to Justin as the position and employer are exactly what I was looking for." }
  ],

  /* Domains Orion sends email from (to confirm) */
  sendingDomains: ["orionplacement.com", "[second sending domain to confirm]"],

  cities: [
    { slug: "houston-tx", name: "Houston", state: "TX", stateName: "Texas", stateSlug: "texas", citySlug: "houston", built: true },
    { slug: "dallas-tx", name: "Dallas", state: "TX", stateName: "Texas", stateSlug: "texas", citySlug: "dallas" },
    { slug: "austin-tx", name: "Austin", state: "TX", stateName: "Texas", stateSlug: "texas", citySlug: "austin" },
    { slug: "san-antonio-tx", name: "San Antonio", state: "TX", stateName: "Texas", stateSlug: "texas", citySlug: "san-antonio" },
    { slug: "new-york-ny", name: "New York", state: "NY", stateName: "New York", stateSlug: "new-york", citySlug: "new-york" },
    { slug: "denver-co", name: "Denver", state: "CO", stateName: "Colorado", stateSlug: "colorado", citySlug: "denver" },
    { slug: "chicago-il", name: "Chicago", state: "IL", stateName: "Illinois", stateSlug: "illinois", citySlug: "chicago" },
    { slug: "atlanta-ga", name: "Atlanta", state: "GA", stateName: "Georgia", stateSlug: "georgia", citySlug: "atlanta" },
    { slug: "boston-ma", name: "Boston", state: "MA", stateName: "Massachusetts", stateSlug: "massachusetts", citySlug: "boston" },
    { slug: "los-angeles-ca", name: "Los Angeles", state: "CA", stateName: "California", stateSlug: "california", citySlug: "los-angeles" }
  ],

  roles: [
    { slug: "estate-planning-attorney", name: "Estate planning attorney", short: "estate planning attorney", kind: "attorney", built: true },
    { slug: "litigation-attorney", name: "Litigation attorney", short: "litigation attorney", kind: "attorney" },
    { slug: "commercial-litigation-attorney", name: "Commercial litigation attorney", short: "commercial litigation attorney", kind: "attorney" },
    { slug: "personal-injury-attorney", name: "Personal injury attorney", short: "personal injury attorney", kind: "attorney" },
    { slug: "real-estate-attorney", name: "Real estate attorney", short: "real estate attorney", kind: "attorney" },
    { slug: "insurance-defense-attorney", name: "Insurance defense attorney", short: "insurance defense attorney", kind: "attorney" },
    { slug: "family-law-attorney", name: "Family law attorney", short: "family law attorney", kind: "attorney" },
    { slug: "employment-attorney", name: "Employment attorney", short: "employment attorney", kind: "attorney" },
    { slug: "estate-planning-paralegal", name: "Estate planning paralegal", short: "estate planning paralegal", kind: "paralegal" },
    { slug: "litigation-paralegal", name: "Litigation paralegal", short: "litigation paralegal", kind: "paralegal" },
    { slug: "legal-assistant", name: "Legal assistant", short: "legal assistant", kind: "staff" }
  ],

  /* Experience bands used by every band bar */
  expBands: [
    { key: "b1", label: "1–3 years", min: 1, max: 3 },
    { key: "b2", label: "4–7 years", min: 4, max: 7 },
    { key: "b3", label: "8+ years", min: 8, max: 40 }
  ],

  /* Base salary bands, USD thousands. bands[city][role] = { b1:[lo,hi], b2, b3, median, typical } */
  bands: {
    "houston-tx": {
      "estate-planning-attorney":       { b1: [90, 115],  b2: [115, 150], b3: [150, 195], median: 132, typical: "4–7 years" },
      "litigation-attorney":            { b1: [95, 120],  b2: [120, 155], b3: [155, 210], median: 138, typical: "3–6 years" },
      "commercial-litigation-attorney": { b1: [105, 130], b2: [130, 170], b3: [170, 230], median: 150, typical: "4–8 years" },
      "personal-injury-attorney":       { b1: [85, 110],  b2: [110, 145], b3: [145, 200], median: 125, typical: "3–6 years" },
      "real-estate-attorney":           { b1: [95, 118],  b2: [118, 150], b3: [150, 200], median: 133, typical: "4–7 years" },
      "insurance-defense-attorney":     { b1: [85, 105],  b2: [105, 135], b3: [135, 170], median: 118, typical: "2–5 years" },
      "family-law-attorney":            { b1: [80, 100],  b2: [100, 130], b3: [130, 170], median: 112, typical: "3–6 years" },
      "estate-planning-paralegal":      { b1: [52, 62],   b2: [62, 74],   b3: [74, 88],   median: 66,  typical: "4–7 years" },
      "litigation-paralegal":           { b1: [55, 65],   b2: [65, 78],   b3: [78, 92],   median: 70,  typical: "3–6 years" },
      "legal-assistant":                { b1: [42, 50],   b2: [50, 58],   b3: [58, 68],   median: 52,  typical: "2–5 years" }
    },
    "dallas-tx":      { "estate-planning-attorney": { b1: [92, 118],  b2: [118, 152], b3: [152, 200], median: 135, typical: "4–7 years" } },
    "austin-tx":      { "estate-planning-attorney": { b1: [88, 112],  b2: [112, 145], b3: [145, 185], median: 128, typical: "4–7 years" } },
    "san-antonio-tx": { "estate-planning-attorney": { b1: [80, 100],  b2: [100, 130], b3: [130, 165], median: 114, typical: "4–7 years" } },
    "new-york-ny":    { "estate-planning-attorney": { b1: [120, 150], b2: [150, 195], b3: [195, 260], median: 172, typical: "4–7 years" } },
    "denver-co":      { "estate-planning-attorney": { b1: [90, 112],  b2: [112, 145], b3: [145, 185], median: 128, typical: "4–7 years" } },
    "chicago-il":     { "estate-planning-attorney": { b1: [98, 122],  b2: [122, 158], b3: [158, 205], median: 140, typical: "4–7 years" } },
    "atlanta-ga":     { "estate-planning-attorney": { b1: [88, 110],  b2: [110, 142], b3: [142, 185], median: 126, typical: "4–7 years" } },
    "boston-ma":      { "estate-planning-attorney": { b1: [105, 130], b2: [130, 168], b3: [168, 220], median: 150, typical: "4–7 years" } },
    "los-angeles-ca": { "estate-planning-attorney": { b1: [110, 138], b2: [138, 180], b3: [180, 240], median: 160, typical: "4–7 years" } }
  },

  /* What moves pay, per role (used on leaf and role hub) */
  payDrivers: {
    "estate-planning-attorney": [
      { k: "Portable book", v: "A small book of existing estate clients adds the most, often +$15k to +$30k." },
      { k: "Trust administration", v: "Running administrations end to end, not only drafting, moves an offer up a band." },
      { k: "Estate tax work", v: "Form 706 and gift tax returns are scarce at small firms and priced accordingly." },
      { k: "Bar admissions", v: "Texas licence is required; a second state helps firms near a border or with retiree clients." }
    ]
  },
  /* Three pay levers as cards with one figure each (salary leaf). Figures are sample. */
  payLevers: {
    "estate-planning-attorney": [
      { k: "Portable book", fig: "+$15k–$30k", v: "A small book of existing estate clients is the biggest single lever on base." },
      { k: "Trust administration", fig: "Up one band", v: "Running administrations end to end, not only drafting, moves an offer up a level." },
      { k: "On-site seat", fig: "+$5k–$10k", v: "Fully on-site Houston seats pay more than hybrid seats at the same level." }
    ]
  },

  /* Must-have chips offered by the candidate finder, per role kind */
  mustHaves: {
    "estate-planning-attorney": ["Texas bar", "Drafting wills and trusts", "Trust administration", "Probate", "Estate tax", "Client-facing", "Spanish", "Portable book"],
    "estate-planning-paralegal": ["Drafting wills and trusts", "Trust administration", "Probate", "Client-facing", "Spanish"],
    attorney: ["Texas bar", "Court appearances", "Depositions", "Client-facing", "Spanish", "Portable book"],
    paralegal: ["E-filing", "Discovery", "Client-facing", "Spanish"],
    staff: ["Client-facing", "Spanish", "E-filing"]
  },

  /* Anonymised candidates. Never put names, employer names, school names or anything identifying here. */
  candidates: [
    { id: "EP-TX-0412", role: "estate-planning-attorney", headline: "Estate planning associate, drafts and runs trust administrations", years: 5,
      city: "houston-tx", area: "Houston, Inner Loop", relocate: [], bars: ["Texas"], firmType: "Estate planning boutique", firmSize: "6 attorneys",
      mix: [["Wills and trusts", 55], ["Trust administration", 25], ["Probate", 20]], pay: [125, 140], availability: "4 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["Texas bar", "Drafting wills and trusts", "Trust administration", "Probate", "Client-facing"],
      timeline: [["2023–now", "Estate planning boutique, 6 attorneys", "Associate. Own client meetings, drafting of revocable trusts and wills, 20+ administrations a year."],
                 ["2021–2023", "General practice firm, 9 attorneys", "Associate. Probate filings, guardianships, estate planning drafting."]],
      why: "Five years at firms your size, runs administrations without a partner in the room." },
    { id: "EP-TX-0388", role: "estate-planning-attorney", headline: "Estate planning and probate associate, bilingual", years: 3,
      city: "houston-tx", area: "Houston, Southwest", relocate: [], bars: ["Texas"], firmType: "General practice firm", firmSize: "12 attorneys",
      mix: [["Wills and trusts", 40], ["Probate", 40], ["Guardianship", 20]], pay: [98, 110], availability: "2 weeks' notice",
      modes: ["on-site"], tags: ["Texas bar", "Drafting wills and trusts", "Probate", "Spanish", "Client-facing"],
      timeline: [["2023–now", "General practice firm, 12 attorneys", "Associate. Independent and dependent administrations, Spanish-speaking client intake."]],
      why: "Handles probate court on her own and takes Spanish-speaking client meetings." },
    { id: "EP-TX-0451", role: "estate-planning-attorney", headline: "Senior estate planning attorney, estate tax and business succession", years: 9,
      city: "houston-tx", area: "The Woodlands", relocate: [], bars: ["Texas"], firmType: "Tax and estates firm", firmSize: "18 attorneys",
      mix: [["Estate tax", 45], ["Wills and trusts", 35], ["Business succession", 20]], pay: [165, 185], availability: "6 weeks' notice",
      modes: ["hybrid"], tags: ["Texas bar", "Drafting wills and trusts", "Estate tax", "Client-facing", "Portable book"],
      timeline: [["2019–now", "Tax and estates firm, 18 attorneys", "Senior associate. Form 706 and 709 returns, succession plans for closely held businesses."],
                 ["2016–2019", "Estate planning boutique, 4 attorneys", "Associate. Drafting and funding."]],
      why: "Estate tax returns in-house, brings a small book of existing clients." },
    { id: "EP-TX-0467", role: "estate-planning-attorney", headline: "Junior estate planning associate, strong drafter", years: 2,
      city: "houston-tx", area: "Sugar Land", relocate: [], bars: ["Texas"], firmType: "Estate planning boutique", firmSize: "5 attorneys",
      mix: [["Wills and trusts", 60], ["Probate", 40]], pay: [85, 95], availability: "Available now",
      modes: ["on-site"], tags: ["Texas bar", "Drafting wills and trusts", "Probate"],
      timeline: [["2024–now", "Estate planning boutique, 5 attorneys", "Associate. Drafting packages, signing ceremonies, probate applications."]],
      why: "Two years of drafting volume at a five-attorney firm; available now." },
    { id: "EP-TX-0476", role: "estate-planning-attorney", headline: "Estate planning associate, high-volume drafting and client meetings", years: 4,
      city: "houston-tx", area: "Katy", relocate: [], bars: ["Texas"], firmType: "Family and estates firm", firmSize: "10 attorneys",
      mix: [["Wills and trusts", 65], ["Probate", 25], ["Guardianship", 10]], pay: [118, 130], availability: "3 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["Texas bar", "Drafting wills and trusts", "Probate", "Client-facing"],
      timeline: [["2022–now", "Family and estates firm, 10 attorneys", "Associate. Own client meetings, 15 to 20 plans a month, probate applications."]],
      why: "Four years of client-facing drafting at a ten-attorney firm." },
    { id: "EP-TX-0503", role: "estate-planning-attorney", headline: "Trust administration and probate attorney, open to Houston", years: 6,
      city: "austin-tx", area: "Austin, open to Houston", relocate: ["houston-tx"], bars: ["Texas"], firmType: "Regional firm", firmSize: "22 attorneys",
      mix: [["Trust administration", 50], ["Probate", 30], ["Wills and trusts", 20]], pay: [130, 145], availability: "4 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["Texas bar", "Trust administration", "Probate", "Drafting wills and trusts", "Court appearances"],
      timeline: [["2022–now", "Regional firm, 22 attorneys", "Associate. Trust administrations and contested probate hearings."],
                 ["2020–2022", "Small firm, 7 attorneys", "Associate. Estate planning and probate."]],
      why: "Six years in administrations, already licensed in Texas, relocating to Houston." },
    { id: "EP-TX-0519", role: "estate-planning-attorney", headline: "Estate planning partner-track attorney with portable book", years: 11,
      city: "dallas-tx", area: "Dallas", relocate: [], bars: ["Texas", "Oklahoma"], firmType: "Mid-size firm", firmSize: "40 attorneys",
      mix: [["Wills and trusts", 50], ["Estate tax", 30], ["Trust administration", 20]], pay: [175, 200], availability: "60 days' notice",
      modes: ["hybrid"], tags: ["Texas bar", "Drafting wills and trusts", "Estate tax", "Trust administration", "Portable book"],
      timeline: [["2018–now", "Mid-size firm, 40 attorneys", "Senior associate. Runs a client base and two paralegals."]],
      why: "Eleven years and a portable book; looking for a smaller firm." },
    { id: "EP-NY-0207", role: "estate-planning-attorney", headline: "Estate planning associate, trusts and estates practice", years: 4,
      city: "new-york-ny", area: "New York, Manhattan", relocate: [], bars: ["New York"], firmType: "Trusts and estates boutique", firmSize: "10 attorneys",
      mix: [["Wills and trusts", 50], ["Estate tax", 25], ["Probate", 25]], pay: [150, 170], availability: "4 weeks' notice",
      modes: ["hybrid"], tags: ["Drafting wills and trusts", "Estate tax", "Probate", "Client-facing"],
      timeline: [["2022–now", "Trusts and estates boutique, 10 attorneys", "Associate. Drafting, Surrogate's Court filings."]],
      why: "Four years at a ten-attorney boutique." },
    { id: "EP-CO-0133", role: "estate-planning-attorney", headline: "Estate planning and elder law associate", years: 5,
      city: "denver-co", area: "Denver", relocate: [], bars: ["Colorado"], firmType: "Elder law firm", firmSize: "8 attorneys",
      mix: [["Wills and trusts", 45], ["Elder law", 35], ["Probate", 20]], pay: [118, 132], availability: "3 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["Drafting wills and trusts", "Probate", "Client-facing"],
      timeline: [["2021–now", "Elder law firm, 8 attorneys", "Associate. Medicaid planning, wills and trusts."]],
      why: "Five years at an eight-attorney firm." },
    { id: "LIT-TX-0390", role: "litigation-attorney", headline: "Civil litigation associate, insurance defense background", years: 4,
      city: "houston-tx", area: "Houston, Downtown", relocate: [], bars: ["Texas"], firmType: "Insurance defense firm", firmSize: "14 attorneys",
      mix: [["Insurance defense", 60], ["General civil", 40]], pay: [115, 130], availability: "2 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["Texas bar", "Court appearances", "Depositions"],
      timeline: [["2022–now", "Insurance defense firm, 14 attorneys", "Associate. 60 active files, first-chair depositions."]],
      why: "Takes depositions on her own; carries a full caseload." },
    { id: "LIT-TX-0422", role: "commercial-litigation-attorney", headline: "Commercial litigation attorney, contract and business disputes", years: 7,
      city: "houston-tx", area: "Houston, Galleria", relocate: [], bars: ["Texas"], firmType: "Business litigation firm", firmSize: "20 attorneys",
      mix: [["Contract disputes", 55], ["Business torts", 30], ["Appeals", 15]], pay: [150, 170], availability: "4 weeks' notice",
      modes: ["on-site"], tags: ["Texas bar", "Court appearances", "Depositions", "Client-facing"],
      timeline: [["2019–now", "Business litigation firm, 20 attorneys", "Senior associate. Second chair at trial twice, runs discovery."]],
      why: "Seven years of business disputes at a 20-attorney firm." },
    { id: "RE-TX-0274", role: "real-estate-attorney", headline: "Real estate associate, commercial closings and title", years: 5,
      city: "houston-tx", area: "Houston, Memorial", relocate: [], bars: ["Texas"], firmType: "Real estate firm", firmSize: "9 attorneys",
      mix: [["Commercial closings", 50], ["Title review", 30], ["Leasing", 20]], pay: [120, 135], availability: "4 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["Texas bar", "Client-facing"],
      timeline: [["2021–now", "Real estate firm, 9 attorneys", "Associate. Closes commercial purchases, reviews title commitments."]],
      why: "Closes commercial deals without supervision." },
    { id: "PL-TX-0611", role: "estate-planning-paralegal", headline: "Estate planning paralegal, drafting and trust funding", years: 6,
      city: "houston-tx", area: "Houston, Heights", relocate: [], bars: [], firmType: "Estate planning boutique", firmSize: "4 attorneys",
      mix: [["Drafting", 50], ["Trust funding", 30], ["Probate filings", 20]], pay: [62, 70], availability: "2 weeks' notice",
      modes: ["on-site"], tags: ["Drafting wills and trusts", "Trust administration", "Client-facing", "Spanish"],
      timeline: [["2020–now", "Estate planning boutique, 4 attorneys", "Paralegal. First drafts, funding letters, signing ceremonies."]],
      why: "Six years drafting at a four-attorney firm; bilingual." },
    { id: "PL-TX-0640", role: "litigation-paralegal", headline: "Litigation paralegal, discovery and e-filing", years: 4,
      city: "houston-tx", area: "Houston, Energy Corridor", relocate: [], bars: [], firmType: "Litigation firm", firmSize: "11 attorneys",
      mix: [["Discovery", 50], ["E-filing", 30], ["Trial prep", 20]], pay: [60, 68], availability: "2 weeks' notice",
      modes: ["on-site", "hybrid"], tags: ["E-filing", "Discovery"],
      timeline: [["2022–now", "Litigation firm, 11 attorneys", "Paralegal. Discovery responses, state and federal e-filing."]],
      why: "Runs discovery for three attorneys." },
    { id: "PI-TX-0158", role: "personal-injury-attorney", headline: "Personal injury associate, pre-litigation to trial", years: 3,
      city: "houston-tx", area: "Houston, Midtown", relocate: [], bars: ["Texas"], firmType: "Personal injury firm", firmSize: "7 attorneys",
      mix: [["Pre-litigation", 50], ["Litigation", 40], ["Trial", 10]], pay: [95, 110], availability: "3 weeks' notice",
      modes: ["on-site"], tags: ["Texas bar", "Court appearances", "Depositions", "Spanish", "Client-facing"],
      timeline: [["2023–now", "Personal injury firm, 7 attorneys", "Associate. Demand letters through depositions, bilingual intake."]],
      why: "Three years start to finish on PI files; bilingual." }
  ],

  /* Confidential jobs. Employers are described, never named. Bands in USD thousands. */
  jobs: [
    { id: "J-HOU-EP-01", role: "estate-planning-attorney", city: "houston-tx", title: "Estate planning associate", firmSize: "8 attorneys", firmType: "Estate planning firm",
      mix: "Wills and trusts, trust administration", area: "Galleria / Uptown", band: [120, 145], mode: "on-site", years: "3–6 years", posted: "2026-10-28" },
    { id: "J-HOU-EP-02", role: "estate-planning-attorney", city: "houston-tx", title: "Estate planning attorney", firmSize: "15 attorneys", firmType: "Full-service small firm",
      mix: "Estate planning, business succession", area: "Energy Corridor", band: [140, 170], mode: "hybrid", years: "6–10 years", posted: "2026-10-24" },
    { id: "J-HOU-EP-03", role: "estate-planning-attorney", city: "houston-tx", title: "Junior estate planning associate", firmSize: "5 attorneys", firmType: "Estate planning boutique",
      mix: "Drafting, probate", area: "The Woodlands", band: [95, 115], mode: "on-site", years: "2–4 years", posted: "2026-10-30" },
    { id: "J-HOU-EP-04", role: "estate-planning-attorney", city: "houston-tx", title: "Senior estate planning and trust attorney", firmSize: "22 attorneys", firmType: "Tax and estates firm",
      mix: "Estate tax, trust administration", area: "Downtown", band: [165, 190], mode: "hybrid", years: "8+ years", posted: "2026-10-19" },
    { id: "J-HOU-LIT-01", role: "litigation-attorney", city: "houston-tx", title: "Civil litigation associate", firmSize: "12 attorneys", firmType: "Litigation firm",
      mix: "General civil, insurance defense", area: "Downtown", band: [110, 135], mode: "on-site", years: "3–5 years", posted: "2026-10-27" },
    { id: "J-HOU-RE-01", role: "real-estate-attorney", city: "houston-tx", title: "Real estate associate", firmSize: "10 attorneys", firmType: "Real estate firm",
      mix: "Commercial closings, leasing", area: "Memorial", band: [118, 140], mode: "hybrid", years: "4–7 years", posted: "2026-10-22" },
    { id: "J-HOU-PL-01", role: "estate-planning-paralegal", city: "houston-tx", title: "Estate planning paralegal", firmSize: "6 attorneys", firmType: "Estate planning boutique",
      mix: "Drafting, funding, probate filings", area: "Bellaire", band: [60, 72], mode: "on-site", years: "3+ years", posted: "2026-10-29" },
    { id: "J-HOU-PI-01", role: "personal-injury-attorney", city: "houston-tx", title: "Personal injury associate", firmSize: "9 attorneys", firmType: "Personal injury firm",
      mix: "Pre-litigation, litigation", area: "Midtown", band: [100, 125], mode: "on-site", years: "2–5 years", posted: "2026-10-26" },
    { id: "J-DAL-EP-01", role: "estate-planning-attorney", city: "dallas-tx", title: "Estate planning associate", firmSize: "11 attorneys", firmType: "Estate planning firm",
      mix: "Wills and trusts, probate", area: "Uptown Dallas", band: [120, 150], mode: "on-site", years: "3–6 years", posted: "2026-10-25" },
    { id: "J-AUS-EP-01", role: "estate-planning-attorney", city: "austin-tx", title: "Trust administration attorney", firmSize: "7 attorneys", firmType: "Estate planning boutique",
      mix: "Trust administration, probate", area: "Central Austin", band: [115, 140], mode: "hybrid", years: "4–7 years", posted: "2026-10-21" }
  ],

  /* City snapshot (sample) */
  snapshots: {
    "houston-tx": { firmsHiring: 31, shortlistDays: "5 business days", onsiteShare: "7 in 10" }
  },

  /* Where to post a legal job (real places; every price, reach and time value is sample) */
  placesToPost: {
    "houston-tx": [
      { name: "Houston Bar Association career centre", cost: "$250 per 30 days", reach: "Houston attorneys", firstApplicant: "3–5 days", bestFor: "Houston attorney roles" },
      { name: "State Bar of Texas career centre", cost: "$300 per 30 days", reach: "Texas-licensed attorneys", firstApplicant: "3–7 days", bestFor: "Licensed attorneys statewide" },
      { name: "Law school job boards (UH, South Texas, Thurgood Marshall)", cost: "Free", reach: "Students and recent graduates", firstApplicant: "1–2 weeks", bestFor: "Law clerks and first-year associates" },
      { name: "LinkedIn Jobs", cost: "$10–$40 per day promoted", reach: "Broad, all levels", firstApplicant: "1–2 days", bestFor: "Volume; mid-level attorneys" },
      { name: "Indeed", cost: "Free or $5–$25 per day sponsored", reach: "Broad, staff roles", firstApplicant: "Same day", bestFor: "Legal assistants and paralegals" },
      { name: "Your firm's own careers page", cost: "Free", reach: "People who already know you", firstApplicant: "Varies", bestFor: "Referrals and returning staff" }
    ]
  },

  /* Where talent comes from (real institutions; contacts and cycle timing are sample) */
  placesToHire: {
    "houston-tx": [
      { name: "University of Houston Law Center", kind: "Law school", contact: "Career development office", cycle: "On-campus interviews in August; spring postings from January" },
      { name: "South Texas College of Law Houston", kind: "Law school", contact: "Career resources office", cycle: "Fall interview programme; clerk postings year-round" },
      { name: "Thurgood Marshall School of Law", kind: "Law school", contact: "Career services office", cycle: "Fall and spring recruiting; summer clerkships from February" },
      { name: "Houston Community College paralegal programme", kind: "Paralegal programme", contact: "Programme coordinator", cycle: "Graduates in May and December" },
      { name: "San Jacinto College paralegal programme", kind: "Paralegal programme", contact: "Programme coordinator", cycle: "Graduates in May and December" },
      { name: "Houston Bar Association sections", kind: "Bar association", contact: "Section chairs and newsletters", cycle: "Monthly section meetings" },
      { name: "Houston Paralegal Association", kind: "Professional association", contact: "Job bank", cycle: "Postings year-round" }
    ]
  },

  /* Where lateral hires come from, Houston (share of sample placements) */
  lateralSources: {
    "houston-tx": [["Other small firms", 46], ["Mid-size firms", 24], ["Solo practices", 12], ["Large firms", 10], ["In-house or government", 8]]
  }
};

/* ===== Employer pages sample data (2, 4, 6, 8, 10, 11, 12); extends window.ORION_DATA.
   Every value here is SAMPLE DATA or draft copy awaiting Orion's figures; pages render data values inside <span class="mark">. */
Object.assign(window.ORION_DATA, {

  /* Employers hub: the six employer tools. time = sample estimate. */
  employerTools: [
    { key: "findCandidates", title: "Find candidates", get: "Anonymised candidates for your seat, ranked by your must-haves. The top three open at once.", time: "About 2 minutes", cta: "Describe your seat" },
    { key: "submitJob", title: "Submit a job", get: "Paste the posting you already have. We read it, check the pay against the market and show who fits.", time: "About 1 minute", cta: "Paste your posting" },
    { key: "fees", title: "Fees and calculator", get: "Our terms in one table, the fee on your salary, and the questions to ask any recruiter.", time: "About 2 minutes", cta: "See the terms" },
    { key: "hiringKit", title: "Hiring kit", get: "A posting template, interview questions, a scorecard, an offer-letter outline and pay models.", time: "Ready to copy", cta: "Open the kit" },
    { key: "whereToPost", title: "Where to post in Houston", get: "Every place to post a legal job in Houston, with cost and time to the first applicant.", time: "About 3 minutes", cta: "Compare places to post" },
    { key: "whereToHire", title: "Where to hire in Houston", get: "Law schools, paralegal programmes and bar groups, who to contact and when they hire.", time: "About 3 minutes", cta: "See the sources" }
  ],

  /* Submit a job: sample posting used by "Use a sample posting" */
  samplePosting: "Estate Planning Associate Attorney – Houston, TX\n\nOur 8-attorney firm in the Galleria area is hiring an estate planning associate with 4+ years of experience. You will meet clients, draft wills and revocable trusts, and run trust administrations and probate matters with paralegal support.\n\nRequirements:\n- Licensed in Texas and in good standing\n- 4 to 7 years of estate planning practice\n- Comfortable leading client meetings on your own\n- Estate tax experience a plus; Spanish a plus\n\nSalary: $120,000 – $140,000 depending on experience, plus bonus.\nThis is an on-site position, Monday to Friday.\n\nSend your resume to hiring@examplefirm.com.",

  /* Submit a job: keyword rules for must-have chips (RegExp source, case-insensitive) */
  parseTags: {
    "Texas bar": "texas (bar|licen[cs]e)|licensed in texas|admitted in texas",
    "Drafting wills and trusts": "draft\\w*[^.]{0,40}(wills?|trusts?)|(wills?|trusts?)[^.]{0,30}draft",
    "Trust administration": "trust administrations?|administrations?",
    "Probate": "probate",
    "Estate tax": "estate tax|form 706|gift tax|709",
    "Client-facing": "client meetings?|client-facing|meet (with )?clients|clients? contact",
    "Spanish": "spanish|bilingual",
    "Portable book": "portable|book of business",
    "Court appearances": "court appearances?|hearings?|trial",
    "Depositions": "depositions?",
    "E-filing": "e-?fil(e|ing)",
    "Discovery": "discovery"
  },
  /* Submit a job: role detection, checked in order */
  parseRoles: [
    ["estate-planning-paralegal", "estate planning paralegal|paralegal[^.]{0,40}estate|probate paralegal"],
    ["litigation-paralegal", "litigation paralegal|paralegal[^.]{0,40}litigation"],
    ["legal-assistant", "legal assistant|legal secretary"],
    ["commercial-litigation-attorney", "commercial litigation|business litigation"],
    ["personal-injury-attorney", "personal injury"],
    ["insurance-defense-attorney", "insurance defense"],
    ["real-estate-attorney", "real estate (attorney|associate|lawyer)"],
    ["family-law-attorney", "family law"],
    ["employment-attorney", "employment (law|attorney|lawyer)|labor and employment"],
    ["estate-planning-attorney", "estate planning|trusts and estates|wills and trusts"],
    ["litigation-attorney", "litigation|litigator"]
  ],

  /* Role hub copy */
  roleIntro: {
    "estate-planning-attorney": [
      "At a small or mid-size firm, the estate planning attorney meets clients, designs the plan and drafts wills, trusts and powers of attorney.",
      "Most also run trust administrations and probate matters, often with one paralegal and little partner review.",
      "Senior hires add estate tax returns, business succession and, sometimes, a book of existing clients."
    ]
  },

  /* Pay models (role hub and hiring kit). Every number is sample. */
  payModels: {
    "estate-planning-attorney": [
      { name: "Salary only", how: "A fixed base, reviewed once a year.", fits: "Associates with 1 to 5 years; firms that want a predictable cost.", typical: "Base inside the Houston band for the level" },
      { name: "Salary plus bonus", how: "Base plus a bonus on collections above a set threshold, or an annual discretionary bonus.", fits: "Mid-level attorneys who carry their own files.", typical: "Bonus of 5% to 15% of base" },
      { name: "Salary plus origination", how: "Base plus a share of fees collected from clients the attorney brings in.", fits: "Senior attorneys with a portable book.", typical: "25% to 33% of fees on originated matters" }
    ]
  },

  /* Hiring kit, per role. Template placeholders: {firm} {size} {city} {state} {years} {pay} {mode} {email} */
  hiringKit: {
    "estate-planning-attorney": {
      template: [
        ["h", "Estate planning associate attorney ({years})"],
        ["p", "{firm} is a {size}-attorney firm in {city} focused on estate planning, probate and trust administration. We are hiring an associate to own client relationships from the first meeting to the signing."],
        ["h", "What you will do"],
        ["li", "Meet clients, learn their goals and recommend a plan."],
        ["li", "Draft wills, revocable trusts, powers of attorney and medical directives."],
        ["li", "Run trust administrations and probate matters from intake to closing, with a paralegal supporting you."],
        ["li", "Supervise signings and help clients fund their trusts."],
        ["h", "What you bring"],
        ["li", "A {state} law licence in good standing."],
        ["li", "{years} of estate planning practice."],
        ["li", "Drafting you are confident to send without close review."],
        ["li", "Ease leading client meetings on your own."],
        ["li", "A plus: estate tax returns (Forms 706 and 709), Spanish."],
        ["h", "Pay and benefits"],
        ["li", "Base salary {pay}, depending on experience."],
        ["li", "Health insurance, bar dues and CLE paid."],
        ["h", "How we work"],
        ["p", "{mode}, in our {city} office."],
        ["h", "How to apply"],
        ["p", "Send your resume to {email}. We reply to every applicant within five business days."]
      ],
      questions: [
        { q: "Walk me through the last estate plan you designed, from the first meeting to the signing.", good: "Names the client's goals, the documents chosen and why, who drafted what, and how signing and funding were handled.", flag: "Talks only about filling in a template." },
        { q: "When would you recommend a revocable trust over a will for a Texas client?", good: "Mentions incapacity planning, privacy, property in other states and blended families. Says a will is often enough because Texas independent administration is simple.", flag: "Recommends a trust for everyone." },
        { q: "Tell me about a trust administration you ran. What did you do in the first 30 days?", good: "Notices to beneficiaries, a tax ID for the trust, an inventory, securing assets, a timeline for distributions.", flag: "Cannot describe the steps in order." },
        { q: "A client's adult children join the meeting and disagree with the plan. What do you do?", good: "Identifies who the client is, meets the client alone, records capacity and intent, checks for conflicts.", flag: "Tries to find a plan that pleases the children." },
        { q: "How many plans did you draft a month, and how much did a partner review?", good: "Gives concrete numbers and says honestly what review they still need.", flag: "Vague about volume." },
        { q: "A client's estate may be above the federal exemption. What do you raise?", good: "Portability, lifetime gifts, Form 709 for gifts, Form 706 at death, and when to bring in a CPA.", flag: "Has never worked on a taxable estate and does not say so." },
        { q: "What would you need from us in your first 90 days?", good: "Specific: templates, paralegal time, how client intake works, who reviews first drafts.", flag: "No questions about how the firm runs." }
      ],
      scorecard: [
        { k: "Drafting quality", w: 25, hint: "Clean, accurate first drafts" },
        { k: "Trust and probate administration", w: 20, hint: "Runs a matter end to end" },
        { k: "Client meetings", w: 20, hint: "Leads a meeting alone, explains plainly" },
        { k: "Texas estates law", w: 15, hint: "Knows the Estates Code and local practice" },
        { k: "File volume and organisation", w: 10, hint: "Carries a full caseload" },
        { k: "Fit with a small firm", w: 10, hint: "Comfortable with lean support" }
      ],
      offer: [
        ["Position and start date", "Job title, the attorney they report to, the start date."],
        ["Base salary", "Annual base, pay schedule, when it is next reviewed."],
        ["Bonus or origination", "How any bonus is worked out and when it is paid; the share of fees on originated matters, if any."],
        ["Benefits", "Health insurance, bar dues, CLE, malpractice cover, paid time off."],
        ["Work arrangement", "On-site or hybrid days, office hours, where they work."],
        ["Licence condition", "Offer depends on an active Texas licence in good standing."],
        ["At-will statement", "Texas employment is at-will unless you agree otherwise in writing."],
        ["Confidentiality and client files", "Client confidences, firm files and what happens to them when someone leaves."],
        ["Restrictions after leaving", "Texas Disciplinary Rule 5.06 limits agreements that restrict a lawyer's practice after leaving. Keep this section to what that rule allows."],
        ["Acceptance", "A date to reply by and a signature line."]
      ]
    }
  },

  /* Fees page: questions to ask any recruiter. answer: terms key, or literal text (sample, marked) */
  recruiterQuestions: [
    { q: "What is the fee, and is it a share of base salary or total pay?", why: "A share of total pay includes bonus and can cost far more.", term: "fee" },
    { q: "Do we pay anything before we hire?", why: "Retainers are paid even if no one is hired.", term: "upfront" },
    { q: "How long is the guarantee, and is it a refund or a replacement?", why: "Length and remedy decide what you get back if a hire leaves.", term: "guaranteeDetail" },
    { q: "When is the invoice due?", why: "Some recruiters invoice on the offer, before the hire starts.", term: "payment" },
    { q: "Do you need exclusivity?", why: "Exclusivity stops you posting or using other recruiters.", term: "exclusivity" },
    { q: "If we hire someone you introduced months later, do we owe a fee?", why: "The window decides when an old introduction still costs money.", text: "[introduction window to confirm]" },
    { q: "Will candidates learn my firm's name before I agree?", why: "Protects a confidential search.", text: "No. Candidates see a description of the seat until you say yes." }
  ],

  /* Where to post: which kinds of hire each place suits best (by index in placesToPost) */
  placesToPostFit: {
    "houston-tx": [["attorney"], ["attorney"], ["clerk"], ["attorney", "paralegal"], ["paralegal", "staff"], ["attorney", "paralegal", "staff", "clerk"]]
  },

  /* Where to hire: extra bar groups (real organisations; contact and cycle are sample) */
  placesToHireExtra: {
    "houston-tx": [
      { name: "State Bar of Texas Real Estate, Probate and Trust Law Section", kind: "Bar association", contact: "Section events and newsletter", cycle: "Annual meeting and CLE through the year" },
      { name: "Houston Young Lawyers Association", kind: "Bar association", contact: "Committees and events", cycle: "Monthly events" },
      { name: "Houston Lawyers Association", kind: "Bar association", contact: "Events and member network", cycle: "Events through the year" }
    ]
  }
});

/* ===== Candidate pages sample data (13-18); merges into window.ORION_DATA.
   Every value here is SAMPLE DATA awaiting Orion's figures and is shown inside <span class="mark">. */
(function (D) {
  /* Skills each confidential job asks for (keys = data.jobs ids). Used to match a resume to jobs. */
  D.jobTags = {
    "J-HOU-EP-01": ["Texas bar", "Drafting wills and trusts", "Trust administration"],
    "J-HOU-EP-02": ["Texas bar", "Drafting wills and trusts", "Client-facing", "Portable book"],
    "J-HOU-EP-03": ["Texas bar", "Drafting wills and trusts", "Probate"],
    "J-HOU-EP-04": ["Texas bar", "Estate tax", "Trust administration"],
    "J-HOU-LIT-01": ["Texas bar", "Court appearances", "Depositions"],
    "J-HOU-RE-01": ["Texas bar", "Client-facing"],
    "J-HOU-PL-01": ["Drafting wills and trusts", "Trust administration", "Probate"],
    "J-HOU-PI-01": ["Texas bar", "Depositions", "Client-facing"],
    "J-DAL-EP-01": ["Texas bar", "Drafting wills and trusts", "Probate"],
    "J-AUS-EP-01": ["Texas bar", "Trust administration", "Probate"]
  };

  /* The "use sample resume" text. No real person, employer or school. */
  D.sampleResume = [
    "[Name hidden in this sample]",
    "Houston, Texas. Open to on-site or hybrid.",
    "",
    "EXPERIENCE",
    "Associate attorney, estate planning boutique (6 attorneys), Houston. 2020 to present.",
    "- Draft revocable trusts, wills and powers of attorney, 15+ plans a month.",
    "- Run trust administrations end to end, 20+ a year.",
    "- File probate applications in the Harris County probate courts.",
    "- Lead client meetings, some in Spanish.",
    "",
    "ADMISSIONS",
    "State Bar of Texas, 2020.",
    "",
    "EDUCATION",
    "J.D., [law school]",
    "",
    "Current base salary: $118,000"
  ].join("\n");

  /* Words the resume reader looks for. Order matters: first role rule that matches wins. */
  D.resumeRules = {
    roles: [
      ["estate-planning-paralegal", /estate planning paralegal|paralegal[^.\n]*(trust|estate|probate)/i],
      ["litigation-paralegal", /litigation paralegal|paralegal[^.\n]*(discovery|litigation)/i],
      ["legal-assistant", /legal assistant|legal secretary/i],
      ["commercial-litigation-attorney", /commercial litigation|business litigation/i],
      ["personal-injury-attorney", /personal injury|plaintiff/i],
      ["insurance-defense-attorney", /insurance defense/i],
      ["family-law-attorney", /family law|divorce|custody/i],
      ["real-estate-attorney", /real estate|closings|title commitment/i],
      ["estate-planning-attorney", /estate planning|trusts? and estates|revocable trust|wills/i],
      ["litigation-attorney", /litigation|litigator/i]
    ],
    tags: [
      ["Texas bar", /state bar of texas|texas bar|licensed in texas/i],
      ["Drafting wills and trusts", /draft[^.\n]*(trust|will)/i],
      ["Trust administration", /trust administration/i],
      ["Probate", /probate/i],
      ["Estate tax", /estate tax|gift tax|form 70[69]/i],
      ["Client-facing", /client meeting|client-facing|clients? intake|meet clients/i],
      ["Spanish", /spanish|bilingual/i],
      ["Portable book", /portable|book of business/i],
      ["Court appearances", /court appearance|hearings?|first chair|trial/i],
      ["Depositions", /deposition/i],
      ["E-filing", /e-?fil/i],
      ["Discovery", /discovery/i]
    ]
  };

  /* Usual bonus at small firms, by role kind (sample) */
  D.bonusNorms = {
    attorney: "Bonus at small firms is usually 5% to 15% of base, often tied to collections or origination.",
    paralegal: "Bonus at small firms is usually $2k to $6k a year, most often discretionary.",
    staff: "Bonus at small firms is usually $1k to $3k a year, most often discretionary."
  };

  /* Best firms to work for, Houston. Generic descriptors only: no real firm is named. */
  D.bestFirmsCriteria = [
    ["Size", "Small and mid-size firms; associates get client work early."],
    ["Practice focus", "At least half the work in one practice area."],
    ["Published pay", "A base range on every role it opens."],
    ["Work arrangement", "On-site or hybrid stated up front."],
    ["Public reviews", "4.5 or more on average, employee and client reviews."]
  ];
  D.bestFirms = {
    "houston-tx": [
      { practice: "Estate planning", desc: "Estate planning boutique", size: "8 attorneys", area: "Galleria", pay: "$120k–$145k", mode: "On-site", reviews: "4.8 of 5" },
      { practice: "Estate planning", desc: "Tax and estates firm", size: "18 attorneys", area: "Downtown", pay: "$140k–$190k", mode: "Hybrid", reviews: "4.6 of 5" },
      { practice: "Estate planning", desc: "Family and estates firm", size: "10 attorneys", area: "Katy", pay: "$110k–$135k", mode: "On-site or hybrid", reviews: "4.7 of 5" },
      { practice: "Litigation", desc: "Business litigation firm", size: "20 attorneys", area: "Galleria", pay: "$130k–$175k", mode: "On-site", reviews: "4.5 of 5" },
      { practice: "Litigation", desc: "Insurance defense firm", size: "14 attorneys", area: "Downtown", pay: "$105k–$135k", mode: "Hybrid", reviews: "4.6 of 5" },
      { practice: "Personal injury", desc: "Plaintiff personal injury firm", size: "9 attorneys", area: "Midtown", pay: "$100k–$125k", mode: "On-site", reviews: "4.9 of 5" },
      { practice: "Family law", desc: "Family law firm", size: "7 attorneys", area: "Memorial", pay: "$95k–$125k", mode: "On-site or hybrid", reviews: "4.7 of 5" },
      { practice: "Real estate", desc: "Commercial real estate firm", size: "9 attorneys", area: "Memorial", pay: "$118k–$140k", mode: "Hybrid", reviews: "4.5 of 5" },
      { practice: "Employment", desc: "Employment law firm", size: "6 attorneys", area: "Greenway Plaza", pay: "$115k–$140k", mode: "Hybrid", reviews: "4.8 of 5" }
    ]
  };
})(window.ORION_DATA);
