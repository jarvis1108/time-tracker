# Time Tracker

A mobile-first web app for personal time tracking during a 1-week high-granularity audit. Track how you spend your time across 8 categories with one-tap entry, daily timelines, and weekly insights.

**Live:** https://time-tracker-seven-ebon.vercel.app

## Getting Started

### Use the app

1. Open the URL above on your phone (iPhone Chrome recommended)
2. Tap **Add to Home Screen** for an app-like experience
3. Tap a category button to start tracking — that's it

> **Important:** Always use the same browser. Your data is stored locally and won't sync across browsers or devices.

### Run locally

```bash
npm install
npm run dev
```

### Deploy

```bash
npx vercel --prod
```

## How It Works

### Quick Entry

Tap one of 8 category buttons to start a timer. Tapping a different category automatically stops the previous timer and starts a new one. No confirmation dialogs — one tap = done.

| Category | Emoji | What it covers | Examples |
|----------|-------|----------------|----------|
| Core Work | 🎯 | Direct output toward your main goal | Job applications, resume tailoring, interview prep, portfolio work |
| Exploration | 🔧 | Work-adjacent but not direct output | Planning, reviewing tasks, optimizing systems, learning tools |
| Side Hustle | 💰 | Side income activities | Manufactured spending, mileage transfers, credit card research |
| Fitness | 🏃 | Physical activity | Gym, exercise, sports |
| Social | 👥 | People time | Calls, hangouts, family, friends, networking |
| Life Admin | 🍳 | Doing a specific task | Cooking, eating, walking dog, errands, cleaning, groceries |
| Leisure | 🎮 | Active entertainment + aimless browsing | Scrolling social media, gaming, watching shows, random phone time |
| Rest | 😴 | Body is recovering (no screen) | Sleep, naps, intentional rest. Holding your phone ≠ Rest |

> **Core Work vs Exploration:** If it directly moves an application/interview/portfolio forward → Core Work. If it supports that work but doesn't produce output (planning, reviewing) → Exploration.

Optionally add a **description** (e.g., "saved 16 jobs on LinkedIn") and an **energy tag** (High / Low) while a timer is running.

### Classification Rules

**Classify by behavior, not by purpose.** Record the purpose in the description field.

- Spending 2 hours browsing gifts online = **Leisure** (behavior is browsing), not Social. Write "gift for gf" in description.
- Picking up a pre-selected gift in 10 min = **Life Admin** (doing a specific errand).
- Aimless phone scrolling = **Leisure**, even if it doesn't feel like entertainment.
- Lying in bed with no screen = **Rest**. Lying in bed scrolling phone = **Leisure**.
- When in doubt, choose **Leisure**. Better to overestimate it — the audit is about exposing where time goes.
- Add 2-3 words of description to every entry. No need for sentences — "food", "dog", "phone", "applying" are fine.

### Timeline

View today's recorded blocks in a vertical timeline. Each block shows time range, category, description, energy, and duration. Blocks are proportional to duration.

- **Tap** a block to edit (opens a bottom sheet)
- **Swipe left** to delete
- **Tap "+ Add Block"** to manually add a past time range
- **Navigate dates** with the arrow buttons to review previous days

### Daily Summary

Below the timeline, see:
- Category breakdown (stacked bar with percentages)
- Total tracked time, Core Work hours, Leisure hours
- Longest continuous Core Work block
- Time from first entry to first Core Work entry
- Highlighted gaps > 15 minutes where nothing was tracked

### Weekly Summary

Switch to the **Week** view tab to see:
- Stacked bar chart comparing category distribution across days
- Weekly totals per category
- Auto-generated insights (e.g., "Core Work averaged 1.5h/day — below the 3-4h target")
- Energy correlation by category (if energy tags were used)

### Export

Tap **Export** in the header to download your data as:
- **JSON** — full data dump for analysis in other tools
- **Markdown** — formatted daily report for notes or conversations

## Edge Cases Handled

- **Midnight crossover:** If a timer is running at midnight, the entry is automatically split at 00:00
- **Forgotten timer:** A subtle banner appears if a timer has been running for 4+ hours
- **App closed with timer:** The active timer persists in localStorage and resumes on reopen

## Tech Stack

- React + Vite
- Tailwind CSS v4
- Recharts (data visualization)
- react-swipeable (swipe gestures)
- localStorage (data persistence)
- PWA manifest (Add to Home Screen)
