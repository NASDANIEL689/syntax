const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the same folder as server.js
app.use(express.static(path.join(__dirname)));

// Chat backend: Google Gemini only. Use GEMINI_API_KEY in .env (get a free key at https://aistudio.google.com/apikey).
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not set in .env. Chat API will return an error until you add it.');
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

app.post('/api/chat', async (req, res) => {
  if (!apiKey) {
    res.status(503).json({ reply: 'Chat is not configured. Add GEMINI_API_KEY to your .env file (get a free key at https://aistudio.google.com/apikey) and restart the server.' });
    return;
  }
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ reply: 'Please send a message.' });
      return;
    }
    const url = GEMINI_URL + '?key=' + encodeURIComponent(apiKey);
    const body = {
      contents: [{ parts: [{ text: message.trim() }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error && data.error.message ? data.error.message : response.statusText;
      console.error('Gemini API error:', errMsg);
      res.status(response.status).json({ reply: 'Sorry, the AI could not respond: ' + errMsg });
      return;
    }
    const textPart = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0];
    const content = textPart && textPart.text ? textPart.text.trim() : '';
    res.json({ reply: content || 'No response.' });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ reply: 'Sorry, the AI could not respond: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Open http://localhost:' + PORT + '/ai.html to use the chat.');
});
