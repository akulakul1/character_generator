const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/generate-character", async (req, res) => {
  const { prompt } = req.body;

  const fullPrompt = `
You are a fantasy RPG character creator.
Generate a detailed JSON response ONLY (no markdown or explanation) based on this prompt: "${prompt}".
Structure:
{
  "name": "Fantasy Name",
  "backstory": "2-3 sentence backstory",
  "stats": {
    "str": number(1-10),
    "int": number(1-10),
    "dex": number(1-10),
    "powerLevel": number(1-100)
  }
}
`;

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const rawText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Remove unwanted markdown or code block characters
    const sanitizedText = rawText.replace(/```json|```/g, '').trim();

    let character;
    try {
      character = JSON.parse(sanitizedText);
    } catch (err) {
      console.error("Failed to parse JSON from Gemini:", err);
      return res.status(500).json({ error: "Invalid JSON from Gemini" });
    }

    // Add fantasy image from Dicebear (or your preferred generator)
    character.image_url = `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(character.name)}`;

    res.json(character);
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate character" });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Server running at http://localhost:${PORT}`);
});
