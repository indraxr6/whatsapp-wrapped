# WhatsApp Chat Wrapped

A privacy-first, client-side web app that turns an exported WhatsApp chat into a Spotify Wrapped-style recap. It visualizes response habits, emoji and media leaderboards, call stats, a word cloud, topic detection, and dynamic chat insights—all built around a chat's own real numbers.

## Features

- **100% Client-Side Processing**: The entire chat file is parsed and analyzed entirely in the browser. No chat data is ever uploaded to a server.
- **Robust Parsing Engine**: Built to handle WhatsApp's actual export chaos, including iOS vs. Android formats, Indonesian/Javanese/English system-message variants, invisible Unicode characters, and irregular multiline messages.
- **Offline NLP Analytics**: Uses complex regex and offline NLP techniques (custom stopword filtering, slurs tracking, topic detection) to generate natural chat insights and personality profiling entirely offline.
- **Cross-Platform Export**: Engineered robust workarounds for complex browser rendering bugs (WebKit layout race conditions, CSSOM SecurityErrors, cross-origin restrictions) allowing users to safely export their dashboard to a PNG on both Desktop and Safari iOS.
- **Optional AI Insights**: Users can provide a free Gemini API key to generate a personalized "AI Roast" based strictly on aggregated stats and random excerpts. The app degrades gracefully to robust offline templates if no key is provided.

## Tech Stack

- **Framework:** React, TypeScript, Vite
- **Styling:** Tailwind CSS (Custom Neo-Brutalism design system)
- **Data Visualization:** Recharts, react-d3-cloud
- **Exporting:** html-to-image (with custom Safari fallbacks and Blob compression)

## Running Locally

**Prerequisites:** This project requires Node v20.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/whatsapp-wrapped.git
   cd whatsapp-wrapped
   ```

2. Use Node 20:
   ```bash
   nvm use 20
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Privacy & Security

All chat processing happens locally in the user's browser. The app does not use analytics, tracking cookies, or databases.

- The raw chat file (`_chat.txt`) is never uploaded.
- If using the AI feature, only non-identifying aggregated metrics and a handful of randomly sampled text excerpts are sent to Google's Gemini API.
- The Gemini API key is stored locally in `localStorage` and is never transmitted to any third-party servers outside of Google API.
