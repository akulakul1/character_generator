const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateCharacter(prompt) {
  const geminiPrompt = `
You are a fantasy character generator.

Generate:
- A name
- A vivid backstory (2-3 sentences max)
- Stats (Power Level out of 100, Strength, Intelligence, Dexterity — each 1 to 10)

Character Prompt: ${prompt}

Return JSON in this format:
{
  "name": "...",
  "backstory": "...",
  "stats": {
    "powerLevel": ...,
    "str": ...,
    "int": ...,
    "dex": ...
  }
}
`;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
    {
      contents: [{ parts: [{ text: geminiPrompt }] }],
    }
  );

  const textOutput = response.data.candidates[0].content.parts[0].text;

  // Extract JSON from Gemini response
  const jsonStart = textOutput.indexOf("{");
  const jsonEnd = textOutput.lastIndexOf("}");
  const jsonString = textOutput.substring(jsonStart, jsonEnd + 1);
  const character = JSON.parse(jsonString);

  // Optional: attach a placeholder image
  character.image_url = `https://api.dicebear.com/8.x/adventurer/svg?seed=${character.name.replace(/\s+/g, "_")}`;

  return character;
}

module.exports = generateCharacter;
