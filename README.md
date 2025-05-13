

# Google Lyrics Scraper API

A lightweight REST API that scrapes Google search result pages for song lyrics using cookie-authenticated requests.

## Features

- Fetch lyrics by querying Google search results.
- Deploy-ready for Render.
- Requires Google cookies for authenticated scraping.

## Usage

**Endpoint:**

GET /lyrics?query={song+title+artist}

**Example:**

https://your-render-service.onrender.com/lyrics?query=adele+hello

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/google-lyrics-api.git
cd google-lyrics-api

2. Install dependencies:



npm install

3. Set your Google cookies (from browser) in Render or as environment variable COOKIE


4. Start the server:



npm start

Deploy to Render

Connect your GitHub repo to Render.

Set the build command: npm install

Set the start command: npm start

Add an environment variable:

Key: COOKIE

Value: (your full Google cookie string)



Dependencies

express

axios

cheerio


License

MIT

