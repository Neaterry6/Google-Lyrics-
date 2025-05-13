const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // To load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse query params
app.use(express.json());

// Lyrics route
app.get('/lyrics', async (req, res) => {
  const query = req.query.query;

  // If the query parameter is missing, return an error
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }

  try {
    // Make a request to Google search with the lyrics query
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}+lyrics`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',  // Simulating a browser request
        'Cookie': process.env.COOKIE,  // Using the cookies from the environment variable
      },
    });

    // Log the raw HTML response to debug
    console.log(response.data);  // Log the full HTML to inspect the structure

    // Load the HTML with Cheerio
    const $ = cheerio.load(response.data);

    // Try to find lyrics based on the current structure
    const lyrics = $('div[jsname="B6iNxe"] span').text().trim(); // Adjust the selector as needed

    // If lyrics are found, send them as the response
    if (lyrics) {
      return res.status(200).json({ lyrics });
    }

    // If no lyrics found, return an error message
    return res.status(404).json({ message: 'Lyrics not found.' });
  } catch (error) {
    // Log any errors and send a 500 Internal Server Error response
    console.error('Error scraping lyrics:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
