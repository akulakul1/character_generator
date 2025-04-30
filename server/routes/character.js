const express = require('express');
const router = express.Router();
const generateCharacter = require('../utils/geminigenerate');

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  try {
    const characterData = await generateCharacter(prompt);
    res.json(characterData);
  } catch (error) {
    console.error("Error generating character:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
