## 🎬 CineQuest — Movie Search App

Search millions of movies powered by the free OMDb API.

## Deploy: 
Live: https://anilnxtwaveproject13.vercel.app

🚀 Run Locally
bash# 1. Install
npm install

# 2. Add your API key → get it free at https://www.omdbapi.com/apikey.aspx
echo "VITE_OMDB_API_KEY=your_key_here" > .env.local

# 3. Start
npm run dev
App runs at http://localhost:5173

✨ Features

🔍 Real-time movie search with debounce
⭐ Filter by minimum IMDb rating
🗂️ Sort by popularity, release date, rating, or title
📄 Pagination (up to 100 pages)
🖼️ Movie posters with hover plot overlay
🧪 50 unit tests (Vitest + Testing Library)


📜 Scripts
CommandDescriptionnpm run devStart dev servernpm run buildProduction build → dist/npm testRun all testsnpm run previewPreview production build

☁️ Deploy to Vercel
bashnpm run build
# Drag the dist/ folder to app.vercel.com → Deploy manually
Or connect your GitHub repo on Vercel and set:

Build command: npm run build
Publish directory: dist
Environment variable: VITE_OMDB_API_KEY = your key


🛠️ Tech Stack
React 19 · TypeScript · Vite · Axios · CSS Modules · Vitest · OMDb API
