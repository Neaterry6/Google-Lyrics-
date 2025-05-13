const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Lyrics endpoint
app.get('/lyrics', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required.' });
  }

  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}+lyrics`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': process.env.COOKIE,
      },
    });

    // Check for Google bot detection
    if (response.data.includes("detected unusual traffic")) {
      return res.status(403).json({ error: 'Blocked by Google. Update your cookies or rotate user-agents.' });
    }

    const $ = cheerio.load(response.data);

    // Try multiple selectors as Google’s structure changes
    const lyrics = $('div[jsname="U2fWfd"] span, div[jsname="B6iNxe"] span').text().trim();

    if (lyrics) {
      return res.status(200).json({ lyrics });
    }

    return res.status(404).json({ message: 'Lyrics not found.' });
    
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
});

app.get('/', (req, res) => {
  res.send('Google Lyrics Scraper API is alive.');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
