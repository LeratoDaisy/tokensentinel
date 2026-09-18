# tokenSentinel

*Protecting utilities from fraud, from the inside out.*

AI-powered fraud detection for electricity and water utilities — built for **The Future Is Hers** hackathon (WeThinkCode_ × Cisco × Go Fourth Learning × WISE SA), Track 2: **Cyber Safe & Secure**.

## What it does

tokenSentinel is designed to protect utilities from fraudulent transactions, fake tokens, and insider activity. It monitors issuance in real time and identifies suspicious patterns as they happen — if a fraudulent token is detected, the system can immediately flag or block the transaction and the affected meter number.

**Our goal:** don't just stop the fraudulent transaction. Detect the pattern, protect the customer, alert the utility, and help investigators trace the activity back to its source.

## Beyond the customer — the insider problem

Fraud can involve people inside the utility or distribution network who misuse their access to generate or sell fraudulent tokens for personal profit. By detecting unusual transaction patterns and linking suspicious activity to specific accounts, meters, or access points, tokenSentinel gives the utility evidence to investigate potential perpetrators — not just a blocked transaction that disappears.

## How it works

Every issuance event is scored against the issuing operator's own learned baseline — not a single fixed rule for everyone — so normal variation at one depot doesn't drown out a real anomaly at another.

Three signals feed a single composite risk score:

- **Behavioral deviation** — value/frequency compared to the operator's historical mean and spread (a rolling z-score).
- **Temporal pattern** — issuance outside normal hours, or in unusually rapid succession, is weighted more heavily.
- **Duplication & structure checks** — reference patterns resembling known fraud signatures are flagged independently of value.

Every flag carries two pieces of evidence: the **operator** who issued it and the **meter/account number** it affected — the pairing that turns a single flag into a case an investigator can actually open. From the incident queue, an investigator can mark a flag as under investigation or **block** the transaction outright.

The score decays over time when nothing new is flagged, so the dashboard always reflects current state, not historical noise.

## One engine, many prepaid systems

The detection logic above is identical no matter what's being vended. The dashboard includes a vertical switcher in the sidebar, leading with the two utilities this was built for and extending outward:

- **Electricity** — prepaid token vending (the flagship, most fully-built demo)
- **Water** — prepaid meter credits
- **Airtime & data** — network agent vouchers
- **Transit** — prepaid card top-ups
- **Social grants** — government voucher issuance
- **Retail gift cards** — in-store issuance

Switching verticals swaps the seed data and terminology; the scoring engine underneath never changes. That's deliberate — it's proof the approach generalizes to any system where an insider can generate value out of nothing, not five separate products.

## This demo

This is a working front-end simulation: it generates simulated issuance activity live in the browser (including seeded anomalies) and runs the actual scoring logic against it, so the detection reasoning can be shown end-to-end to judges. A production version would connect this same scoring layer to each utility's real transaction stream.

## Running it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── main.jsx                # React entry point
├── App.jsx                 # Top-level layout, section routing, vertical state
├── index.css                # Design tokens and global styles
├── data/
│   └── verticals.js         # Seed data + terminology for all six prepaid verticals
├── hooks/
│   └── useSimulation.js     # Core simulation + anomaly scoring logic (vertical-aware)
└── components/
    ├── Sidebar.jsx           # Nav + vertical switcher
    ├── TopBar.jsx
    ├── StatTiles.jsx
    ├── LiveFeed.jsx           # Live issuance feed, shows affected meter/account per event
    ├── VolumeChart.jsx
    ├── IncidentsTable.jsx     # Incident queue — Investigate / Block actions
    ├── OperatorsTable.jsx
    └── Methodology.jsx
```

## Team

Built by a five-person team for The Future Is Hers hackathon, 18 September.
