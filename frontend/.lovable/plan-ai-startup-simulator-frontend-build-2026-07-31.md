# AI Startup Simulator — Frontend Build

A premium dark-theme SaaS product covering the full flow: Landing → Auth → Dashboard → New Analysis → Live Progress → Results → History → Profile. Frontend-only prototype with realistic mock data and a simulated AI agent run.

## Visual identity

Midnight Indigo: near-black navy canvas (#0a0a1a), layered surfaces (#141432 / #1e1e5a), electric indigo accent (#4f46e5) with a violet-to-cyan gradient for hero and score visuals. Dark-only theme.

- Typography: Space Grotesk for headings (tight tracking, large display sizes), DM Sans for body. Loaded via a link tag in the root head.
- Surfaces: 16–20px radii, hairline 1px borders at low opacity, soft indigo glow shadows. Glass blur reserved for the sticky nav, command-style overlays, and floating progress panel — not on every card.
- Generous whitespace, restrained motion, no template sidebar. App chrome is a slim top nav with an inline route switcher plus avatar menu.

## Pages

1. **Landing (`/`)** — hero with animated abstract orbit/mesh graphic and "Analyze Your Startup" CTA, product description, features, How It Works (3 steps), Why Use It, FAQ accordion, footer.
2. **Auth** — `/login`, `/register`, `/forgot-password`. Split-screen: form on one side, animated brand panel with generated illustration on the other. Client-side validation only; submitting sets a mock session and routes to the dashboard.
3. **Dashboard (`/dashboard`)** — welcome header, three stat tiles (total analyses, average score, trend), recent analyses as cards, quick actions, prominent Create New Analysis.
4. **New Analysis (`/analysis/new`)** — 4-step form (Startup Name, Problem, Solution, Target Users) with a segmented progress indicator, per-step validation, and slide transitions.
5. **Progress (`/analysis/:id/progress`)** — nine agent steps as an animated vertical timeline with icons, descriptions, per-step spinner and completion check, overall progress ring, and estimated completion countdown. Simulated timings, auto-advances to results.
6. **Results (`/analysis/:id`)** — sectioned report with sticky section nav: Summary, Competitors (cards with logo placeholder, site, strengths/weaknesses), Market Gaps, Startup Score (circular score + category breakdown + strength/weakness meters), Personas, Persona Feedback (chat bubbles), Adoption Analytics (Recharts: growth line, adoption S-curve, TAM/SAM/SOM, revenue projection), Final Recommendations (priority + risk labels, action items).
7. **History (`/history`)** — searchable card grid, reopen and delete with confirm dialog and toast.
8. **Profile (`/profile`)** — profile details, account settings, theme control, logout.

## Technical notes

- TanStack Router file routes; each route gets its own `head()` metadata. Placeholder index is replaced by the landing page.
- Design tokens defined in `src/styles.css` under `@theme inline` — no hardcoded color classes in components.
- Motion (Framer Motion) for page transitions, staggered fade/slide-ups, timeline and score animations; Recharts for charts; lucide-react icons; sonner mounted once in `__root.tsx` for toasts.
- Mock layer in `src/lib/mock/`: analysis fixtures, agent step definitions, and a simulated run driver. State (session, analyses) persisted in localStorage via a small store hook, read after hydration to avoid SSR mismatch.
- Reusable components under `src/components/` grouped by `ui/` (buttons, cards, inputs, dialogs, progress, skeletons), `layout/` (nav, page shell, footer), and `report/` (score card, persona card, competitor card, recommendation card, chart panels, timeline).
- shadcn primitives used as bases only, restyled to the custom system.
- Generated abstract hero and auth artwork saved to `src/assets/`.

## Not included

No real authentication, database, or live AI — all data is mock and resets are handled locally. Easy to wire to Lovable Cloud later.
