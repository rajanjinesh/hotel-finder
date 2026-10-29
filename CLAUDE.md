# Hotel Finder: Project Guide for Claude

## About me
- I'm a product manager building a quick prototype to learn MCP, CLAUDE.md and skills.
- Explain decisions in plain language. Ask before big changes or adding new libraries.

## The product (v1 prototype)
- Input (from the UI): destination, check-in date, check-out date, adults, children (age per child, 0–17).
- Output: top 3 hotels, cheapest total price first. Show name, total price, rating and a link.
- Exact rules (sorting, minimum rating, edge cases) come from the PRD. The PRD wins over this file.

## Sources of truth (read via MCP while building, never from the app)
- **PRD:** Notion, "Hotel Finder" page / Features database. Read it before starting any feature.
- **UI design:** Figma. Fetch it ONCE (free plan has very few MCP calls), then save the specs to
  `docs/design-spec.md` and build from that file. Don't re-fetch unless I ask.
- **Hotel data:** HasData Booking.com.
  - Build time: use the `booking` MCP only to explore the data shape. Max 3 calls.
  - Run time: the app calls the HasData REST API from `/api/hotels` (server-side only).

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- API key: `HASDATA_API_KEY` in `.env.local` (and in Vercel environment variables)
- Code in GitHub; Vercel auto-deploys from `main`

## How to work
1. **PRD first.** Create the PRD in Notion from the PRD I give you in my prompt: a "Hotel Finder" page with a Features database (Name, Status, PRD). Set Status to "Not started". Don't start coding in the same step.
2. **Read the PRD back from Notion** before building, and summarize what you'll build so I can confirm.
3. Build in small steps; test locally with `npm run dev`.
4. Use mock hotel data for UI work to save HasData credits; switch to the real API at the end.
5. After each working feature: commit with a clear message and push to GitHub.
6. When the feature is done and deployed, update its Status in Notion to "Built".

## Rules
- Never commit `.env.local` or print the API key anywhere.
- Never call HasData from the browser; only from `/api/hotels`.
- Stay within v1 scope. Note new ideas under "Future scope" in the PRD instead of building them.
