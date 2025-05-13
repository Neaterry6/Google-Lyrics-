const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/lyrics", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).send("Missing 'query' parameter.");

  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}+lyrics`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Cookie": process.env.COOKIE
      }
    });

    const $ = cheerio.load(response.data);
    const lyrics = $('div[data-lyricid]').text() || $('div[jsname="U7izfe"]').text();

    if (!lyrics) return res.send("Lyrics not found.");
    res.send(lyrics);

  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch lyrics.");
  }
});

app.listen(PORT, () => console.log(`Lyrics API running on port ${PORT}`))
