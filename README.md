<div align="center">
  <img src="public/icon.png" width="120" alt="ZIVOX Logo" />
  <h1>ZIVOX</h1>
  <p><strong>A Premium Cinematic Streaming Platform</strong></p>
</div>

<p align="center">
  ZIVOX is a modern, high-performance streaming web application built for watching movies, TV shows, and anime. It features a stunning Netflix-tier dark UI, completely ad-free viewing (via built-in Sandbox Shields), and automatic server switching.
</p>

## ✨ Features

- **Premium UI/UX:** Stunning cinematic dark mode, smooth micro-animations, glassmorphism, and responsive design across all devices.
- **Zero Ads / No Popups:** Built-in iframe proxies, Sandbox Shields, and Click Interceptors block intrusive ads and popups from third-party streaming providers.
- **Auto-Source Testing:** Automatically cycles through 15+ independent streaming servers to find the best quality and fastest load time.
- **No Account Required:** Watch history, favorites, and playback progress are stored locally on your device for absolute privacy.
- **Binge-Friendly:** Auto-play next episode for TV shows and anime.
- **Advanced SEO:** Fully optimized for 2026 search engines and AI crawlers (ChatGPT, Perplexity). Includes programmatic sitemaps, `llms.txt`, FAQPage JSON-LD schemas, and dynamic metadata.
- **PWA Ready:** Installable as a Progressive Web App directly to your home screen.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + custom CSS variables
- **Data Source:** TMDB API (The Movie Database)
- **Icons:** Lucide React
- **Fonts:** Inter, Space Grotesk, JetBrains Mono
- **Deployment:** Vercel

## 🛠️ Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lightning-bolt346/Personal-Movie-Platform.git
   cd Personal-Movie-Platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the example file and add your TMDB API Key. You can get one for free at [themoviedb.org](https://www.themoviedb.org/).
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   TMDB_API_KEY="your_tmdb_api_key_here"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡️ Disclaimer

ZIVOX is a UI/UX project created for educational purposes. It does not host any media content on its own servers. All streams are scraped/embedded from third-party independent providers. This project uses the TMDB API but is not endorsed or certified by TMDB.

## 📄 License

MIT License
