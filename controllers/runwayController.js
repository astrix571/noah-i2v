// controllers/runwayController.js
const { generateVideoFromPrompt } = require("../services/runwayClient");

const createVideo = async (req, res) => {
  const { prompt, image } = req.body;

  if (!prompt || !image) {
    return res.status(400).json({ error: "Missing prompt or image" });
  }

  try {
    const taskId = await generateVideoFromPrompt(prompt, image);
    res.json({ taskId });
  } catch (err) {
    console.error("❌ Runway error:", err.message);
    res.status(500).json({ error: "Failed to create video", details: err.message });
  }
};

module.exports = { createVideo };
