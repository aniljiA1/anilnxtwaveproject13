# 🎬 CineQuest – Movie Search App

A production-grade single-page movie search app built with **React 19 + TypeScript + Vite**, powered by the **OMDb API** (Open Movie Database).

---

## 🔑 Get Your Free API Key (takes 2 minutes)

1. Go to 👉 **https://www.omdbapi.com/apikey.aspx**
2. Select **FREE** tier (1,000 requests/day — no credit card)
3. Enter your email address and submit
4. Check your inbox — the key arrives within minutes
5. Add it to `.env.local` (see Setup below)

> OMDb is free, open, and requires no account registration beyond an email address.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env.local
# Edit .env.local → VITE_OMDB_API_KEY=your_key_here

# 3. Start the dev server
npm run dev
# → http://localhost:5173
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 Movie search | Real-time search with 400ms debounce |
| 📄 Pagination | Navigate up to 100 pages of results |
| 🗂️ Sort | By Popularity, Release Date, Rating, Title |
| ↕️ Direction | Ascending or Descending |
| ⭐ Rating filter | Slider (0–9) to filter by minimum IMDb rating |
| 🖼️ Posters | Hover to reveal plot overview |
| 💀 Skeletons | Loading placeholders |
| ♿ Accessible | Full ARIA labels + keyboard navigation |
| 🧪 Tests | 50 unit tests across utils, components, hooks |

---

## 🧱 Project Structure

```
src/
├── api/
│   └── tmdb.ts              # OMDb Axios client + data mapping
├── components/
│   ├── SearchBar.tsx         # Search input with clear button
│   ├── FilterBar.tsx         # Sort + direction + rating slider
│   ├── MovieGrid.tsx         # Responsive grid + skeleton loader
│   ├── MovieCard.tsx         # Movie card with poster & overlay
│   ├── StarRating.tsx        # Visual star rating (0–10)
│   ├── Pagination.tsx        # Page nav with smart ellipsis
│   ├── EmptyState.tsx        # Idle / no-results / error states
│   └── ResultsInfo.tsx       # Result count + page indicator
├── hooks/
│   └── useMovieSearch.ts     # All search state + API logic
├── types/
│   └── movie.ts              # TypeScript interfaces
├── utils/
│   └── movieUtils.ts         # Pure sort / filter / format functions
└── __tests__/
    ├── setup.ts
    ├── movieUtils.test.ts    # 16 utility tests
    ├── components.test.tsx   # 27 component tests
    └── useMovieSearch.test.ts # 7 hook integration tests
```

---

## 🧪 Tests

```bash
npm test             # Run all 50 tests once
npm run test:watch   # Watch mode for development
```

---

## 🏗️ Build

```bash
npm run build    # TypeScript check + Vite production build → dist/
npm run preview  # Serve the production build locally
```

---

## ☁️ Deploy to Netlify

**Option A – Drag & Drop (fastest):**
```bash
npm run build
# Drag the dist/ folder to app.netlify.com → "Deploy manually"
```

**Option B – Git integration:**
1. Push this repo to GitHub
2. On Netlify: New site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variable: `VITE_OMDB_API_KEY` = your key
6. Deploy!

> `netlify.toml` is already configured for SPA routing.

---

## 🛠️ Tech Stack

- **React 19** · **TypeScript** · **Vite**
- **Axios** for HTTP
- **CSS Modules** for scoped component styles
- **Vitest** + **Testing Library** for tests
- **OMDb API** (https://www.omdbapi.com)
