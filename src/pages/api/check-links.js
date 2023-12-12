// pages/api/check-links.js
import axios from 'axios';

export default async function handler(req, res) {
  const { link } = req.body; // Change 'url' to 'link'

  try {
    const { data: html } = await axios.get(link.startsWith('http') || link.startsWith('https') ? link : `http://${link}`);
    const links = extractLinks(html);
    const results = await checkLinks(links);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching page:', error.message);
    res.status(500).json({ error: 'Error fetching page' });
  }
}

// ...rest of the file remains unchanged


function extractLinks(html) {
  const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
  const links = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    links.push(match[2]);
  }

  return links;
}

async function checkLinks(links) {
    const results = await Promise.all(
      links.map(async (link) => {
        let attempts = 0;
        while (attempts < 3) {
          try {
            const response = await axios.head(link, { timeout: 10000, family: 6 });
            return { url: link, valid: response.status === 200 };
          } catch (error) {
            attempts++;
          }
        }
        return { url: link, valid: false };
      })
    );
  
    return results;
  }
