# Time Tracker Tool — Claude Code Build Prompt

## Phase 1: Vision & Context

Build a responsive web app for personal time tracking during a 1-week high-granularity audit. The primary user is a UX designer conducting a short-term time audit to identify productivity patterns and time allocation issues during a job search period.

### Design principles
- **Minimal friction**: The #1 priority. Every interaction should take <5 seconds. If it takes longer, the design has failed.
- **Mobile-first**: Must work smoothly on iPhone Safari (primary input device during away-from-desk moments) and desktop Chrome (primary work environment).
- **Visual clarity**: Clean, modern UI. Think of it as a portfolio-worthy side project — good enough to showcase as a product design case study.
- **Bilingual ready**: UI in English, but must handle Chinese text input in descriptions gracefully.

### Visual style
- Light mode default, clean white background
- Category colors are the primary visual language (see color system below)
- Minimal chrome, no unnecessary borders or decorations
- Typography: system font stack, clear hierarchy
- Inspired by Apple Calendar's timeline view for daily visualization

---

## Phase 2: Core Features

### 2.1 Quick Entry (Main Screen)
- **8 category buttons** displayed prominently, each with emoji + label + assigned color
- Tapping a category button:
  - Automatically stops the previous timer
  - Starts a new timer for the selected category
  - Shows elapsed time on the active category
- **Optional description field**: A single-line text input below the buttons. User can type a short note (e.g., "saved 16 jobs on LinkedIn"). Not required.
- **Optional energy tag**: Two small toggle buttons (⬆️ High / ⬇️ Low) next to the description. Defaults to unset. Tap to set, tap again to clear.
- **No modals, no popups, no confirmation dialogs.** One tap = action done.

### 2.2 Category System (Fixed for audit period)

| id | emoji | label | color |
|----|-------|-------|-------|
| core_work | 🎯 | Core Work | #2563EB |
| exploration | 🔧 | Exploration | #60A5FA |
| side_hustle | 💰 | Side Hustle | #F59E0B |
| fitness | 🏃 | Fitness | #22C55E |
| social | 👥 | Social | #A855F7 |
| life_admin | 🍳 | Life Admin | #F97316 |
| leisure | 🎮 | Leisure | #EF4444 |
| rest | 😴 | Rest | #9CA3AF |

### 2.3 Daily Timeline View
- Vertical timeline showing today's recorded blocks, similar to Apple Calendar's day view
- Each block is colored by category, shows:
  - Time range (e.g., "10:00 – 11:30")
  - Category emoji + label
  - Description (if entered)
  - Energy tag (if set)
  - Duration
- Blocks are proportional to duration (taller = longer)
- Current active timer shown at the top with a pulsing indicator
- Can scroll back to view previous days

### 2.4 Daily Summary
- Below the timeline, show a summary section:
  - **Category breakdown**: Horizontal stacked bar or pie chart showing time per category with percentages
  - **Key metrics**:
    - Total tracked time
    - Core Work hours
    - Leisure hours
    - Longest continuous Core Work block
    - Time from wake-up to first Core Work entry
  - **Untracked gaps**: Highlight any gaps >15 min where no category was active

### 2.5 Weekly Summary (available after 7 days)
- **Daily comparison**: Stacked bar chart showing category distribution for each day of the week
- **Weekly totals**: Table with total hours per category
- **Pattern insights**: Auto-generated observations, such as:
  - "Your Core Work averaged 1.5h/day — well below the 3-4h target"
  - "Leisure time peaks between 7-9 PM every day"
  - "You never start Core Work before 11 AM"
  - "Side Hustle consumed more time than Core Work on 3/7 days"
- **Energy correlation**: If energy tags are used, show which categories correlate with high vs low energy

### 2.6 Edit & Correction
- Tap any block on the timeline to edit:
  - Adjust start/end time
  - Change category
  - Edit description
  - Add/change energy tag
- Swipe left to delete a block
- Ability to manually add a block for a past time range (for gaps or forgotten entries)

---

## Phase 3: Data & Storage

### Architecture: Single-device, mobile-first
- **Primary input device**: iPhone Chrome
- The user will also view the app on desktop Chrome for timeline/summary review, but all recording happens on phone
- Deploy to **Vercel** (free tier) so the app is accessible via URL on any device
- Add PWA manifest so user can "Add to Home Screen" on iPhone for app-like experience

### Storage
- Use **localStorage** as primary storage for the 1-week audit period
- Since recording happens on one device (iPhone Chrome), localStorage is sufficient — no cross-device sync needed
- ⚠️ Important: Safari can evict localStorage for home screen web apps. Since user is on Chrome, this is not an issue. Add a note in the UI reminding user to stick to the same browser.
- Data structure: JSON array of time entries

```json
{
  "entries": [
    {
      "id": "uuid",
      "date": "2026-02-22",
      "startTime": "10:00",
      "endTime": "11:30",
      "category": "core_work",
      "description": "saved 16 jobs on LinkedIn",
      "energy": "high" | "low" | null,
      "duration": 90
    }
  ]
}
```

### Export
- **Export as JSON**: Full data dump for further analysis in Claude Code or other tools
- **Export as Markdown**: Formatted daily/weekly report, suitable for pasting into notes or Claude conversations
- Export button accessible from settings/menu

### Deployment
- **Vercel** via `vercel` CLI or GitHub integration
- No environment variables needed (no backend, no API keys)
- Single static site deployment

---

## Phase 4: Technical Spec

### Stack
- **React** with functional components and hooks
- **Tailwind CSS** for styling
- **Recharts** for data visualization (charts)
- Single-page app, no routing needed
- No backend, no authentication — purely client-side
- Deploy to **Vercel** (free tier)

### Responsive breakpoints
- Mobile: < 640px (primary input mode — large touch targets for buttons, this is the main recording interface)
- Desktop: >= 640px (shows timeline and summary side by side, primarily for review)

### Performance
- Instant load, no splash screen
- Smooth animations for timer transitions
- Works offline (all localStorage)

---

## Phase 5: Refinement Notes

### What NOT to build
- No user accounts or login
- No cloud sync (keep it simple for 1-week audit)
- No notification/reminder system
- No Pomodoro timer
- No goal-setting features
- No dark mode (unless trivial to add)
- No category customization UI (categories are hardcoded for audit period)

### Edge cases to handle
- **Midnight crossover**: If a timer is running at midnight, automatically split the entry at 00:00 and start a new entry for the next day
- **Forgotten timer**: If a timer has been running for >4 hours, show a subtle reminder banner (not a popup) asking "Still doing [category]?"
- **App closed with active timer**: When reopening, show how long the timer has been running and let user confirm or adjust
- **No data yet**: Show a friendly empty state with instructions on first launch

### Future considerations (not for v1)
- Long-term tracking mode with simplified categories
- Weekly/monthly trend charts
- Integration with markdown-based task management system
- PWA support for home screen installation
