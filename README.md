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

| Category | Emoji | Color |
|----------|-------|-------|
| Core Work | 🎯 | Blue |
| Exploration | 🔧 | Light Blue |
| Side Hustle | 💰 | Amber |
| Fitness | 🏃 | Green |
| Social | 👥 | Purple |
| Life Admin | 🍳 | Orange |
| Leisure | 🎮 | Red |
| Rest | 😴 | Gray |

Optionally add a **description** (e.g., "saved 16 jobs on LinkedIn") and an **energy tag** (High / Low) while a timer is running.

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
