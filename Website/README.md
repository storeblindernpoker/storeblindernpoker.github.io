# Store Blindern Poker — Website

A clean, modern website for the Store Blindern Poker association.

## 🚀 Free Hosting with GitHub Pages

1. Push this `Website` folder to a GitHub repository
2. Go to **Settings → Pages** in your repository
3. Under **Source**, select the branch (e.g., `main`) and folder (`/Website` or root `/`)
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

> **Tip:** If you want the Website folder to be the root, you can create a separate repo with just these files.

## 📁 Structure

```
Website/
├── index.html              ← Home page
├── events.html             ← Events page
├── leaderboard.html        ← Leaderboard page
├── css/
│   └── style.css           ← All styles
├── js/
│   └── app.js              ← All interactivity
└── data/
    ├── events.json          ← Event data (edit this to add/update events)
    └── leaderboard.json     ← Leaderboard data (edit this to update rankings)
```

## 🎯 How to Update Content

### Adding a New Event

Edit `data/events.json` and add a new object at the top of the array:

```json
{
  "id": "evt-008",
  "title": "Poker Night #8 — Title Here",
  "date": "2026-04-09",
  "time": "19:00",
  "location": "Blindern Campus, Room 401",
  "description": "Description of the event.",
  "buyIn": "100 NOK",
  "maxPlayers": 20,
  "status": "upcoming"
}
```

### Updating the Leaderboard

Edit `data/leaderboard.json`:

- Update `season` and `lastUpdated`
- Update `rounds` count
- Edit the `players` array — each player has:
  - `rank` — current rank
  - `previousRank` — rank from last round (used to show ▲▼ arrows)
  - `pseudonym` — player's display name
  - `points` — total points accumulated

```json
{
  "rank": 1,
  "previousRank": 2,
  "pseudonym": "The Shark",
  "points": 2450
}
```

## 🎨 Design

- **Palette:** Dark mahogany tones, gold accents, deep blacks
- **Typography:** Playfair Display (headings) + Inter (body)
- **Inspiration:** Apple-clean minimalism meets poker club richness
- **Fully responsive** — works on mobile, tablet, and desktop

## 🛠 Local Development

Just open `index.html` in a browser, or use a local server:

```bash
# Python
cd Website && python3 -m http.server 8000

# Node
npx serve Website
```

Then visit `http://localhost:8000`
