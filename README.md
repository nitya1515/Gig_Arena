# Gig Arena - Placement Intelligence Hub
*From Opportunity to Offer, Prepare Smarter.*

A React + Vite + Tailwind demo that helps students check eligibility (with explained reasons), see transparent "Profile Match" scores, build preparation briefs, track applications, take a skill diagnostic and share interview experiences.

## Run locally
```
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # stable demo mode
```
Requires Node 18+.

## How it works
- `src/engine.js`: rule-based eligibility (unspecified rules = "unknown") and documented matching formula (skills 40, role 25, location 15, type 10, urgency 10). Profile Match is not a selection probability.
- `src/data.js`: **fictional sample data**, not real vacancies.

## Current limitations (be upfront with judges)
- Frontend-only demo: data is stored in browser localStorage. There is no backend, database, real authentication, admin moderation queue or automated tests yet.
- Interview reports show "Pending review" but cannot be approved without an admin area.
- Next steps: Express + PostgreSQL backend, real auth, admin moderation, tests.
