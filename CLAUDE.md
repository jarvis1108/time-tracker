# CLAUDE.md

Project guide for AI-assisted maintenance of this codebase.

## Project Overview

Time Tracker — a mobile-first React web app for personal time tracking. Uses localStorage for persistence, no backend. Deployed to Vercel as a static site.

## Commands

- `npm run dev` — Start dev server (Vite)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint

## Architecture

```
src/
  components/     # React UI components
  hooks/          # Custom React hooks (state + timer logic)
  utils/          # Pure functions (categories, time, insights, export)
  App.jsx         # Root component, ties everything together
  main.jsx        # Entry point
  index.css       # Tailwind directives + custom animations
```

### Data Flow

- `useEntries` hook manages all time entries (CRUD + localStorage persistence)
- `useTimer` hook manages the active timer (start/stop, elapsed time, localStorage persistence for surviving page close)
- `App.jsx` is the orchestrator — passes hooks into components, manages sheet/modal state
- Timer stop → calls `addEntry` via callback → entry saved to localStorage

### Key Design Decisions

- **No routing library** — single page app, view toggled via state (`'today'` | `'week'`)
- **Bottom sheets** for edit/add (not modals) — mobile UX pattern, preserves scroll position
- **Swipe-to-delete** via react-swipeable on timeline blocks
- **Categories are hardcoded** in `src/utils/categories.js` — not user-configurable (by design, for a 1-week audit)
- **localStorage only** — no backend, no sync, single-device usage
- **Midnight crossover** — timer auto-splits entries at 00:00 (handled in `useTimer`)

### Component Responsibilities

| Component | Role |
|-----------|------|
| `QuickEntry` | 8 category buttons, description input, energy toggles, timer display |
| `Timeline` | Renders sorted entries + gaps for a given date |
| `TimeBlock` | Single entry block with swipe-to-delete |
| `BottomSheet` | Reusable slide-up sheet (used by EditSheet, AddBlockSheet, ExportMenu) |
| `EditSheet` | Edit an existing entry's time, category, description, energy |
| `AddBlockSheet` | Create a new entry for a past time range |
| `DailySummary` | Category breakdown bar, metrics cards, gap warnings |
| `WeeklySummary` | Stacked bar chart (Recharts), weekly totals, auto-generated insights |
| `ExportMenu` | JSON and Markdown export triggers |
| `ReminderBanner` | Shows when timer running >4 hours |

### Data Schema

Each entry in localStorage (`time-tracker-entries`):

```json
{
  "id": "uuid",
  "date": "2026-02-22",
  "startTime": "10:00",
  "endTime": "11:30",
  "category": "core_work",
  "description": "optional note",
  "energy": "high" | "low" | null,
  "duration": 90
}
```

Active timer in localStorage (`time-tracker-active-timer`):

```json
{
  "category": "core_work",
  "startedAt": 1740000000000,
  "description": "optional note",
  "energy": "high" | "low" | null
}
```

## Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Custom category colors defined as CSS custom properties in `src/index.css` via `@theme`
- Custom animations: `animate-pulse-dot` (timer indicator), `animate-slide-up` (bottom sheets)
- Mobile-first: primary breakpoint at `sm:` (640px)

## Common Maintenance Tasks

**Add a new category:** Edit `src/utils/categories.js` — add to the `CATEGORIES` array. The grid auto-adjusts.

**Change a metric in daily summary:** Edit `src/utils/insights.js` → `generateDailyMetrics()`.

**Change weekly insight thresholds:** Edit `src/utils/insights.js` → `generateWeeklyInsights()`.

**Modify export format:** Edit `src/utils/export.js`.

**Adjust gap detection threshold:** Change the `minGapMinutes` default in `src/utils/time.js` → `findGaps()`.

**Change forgotten timer threshold:** In `src/hooks/useTimer.js`, adjust the `4 * 60 * 60 * 1000` value in `isRunningLong`.

## Workflow Rules

- **After fixing a bug or completing a backlog item:** Update `BACKLOG.md` — mark the item as ✅ Fixed with a short note on the fix, and update the Quick Reference table status.
- **After changing data schema or architecture:** Update the relevant sections in this file (`CLAUDE.md`).
- **Deploy flow:** `npm run build` → verify clean → `git commit` → `git push` → `npx vercel --prod --yes`.

## Deployment

Static site on Vercel. No environment variables needed. Push to `main` or run `npx vercel --prod`.

## Reference Docs

Design spec and background research are in `references/` (gitignored).
