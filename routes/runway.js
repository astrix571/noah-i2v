const express = require("express");
const router = express.Router();
const { createVideoFromPrompt } = require("../services/runwayClient");

// POST /runway/i2v/create
router.post("/i2v/create", async (req, res) => {
  const { prompt, image } = req.body;

  if (!prompt || !image) {
    return res.status(400).json({ error: "Missing prompt or image URL" });
  }

  try {
    const result = await createVideoFromPrompt(prompt, image);
    res.json({ taskId: result });
  } catch (err) {
    console.error("Create video error:", err.message);
    res.status(500).json({ error: "Failed to create video", details: err.message });
  }
});

module.exports = router;
