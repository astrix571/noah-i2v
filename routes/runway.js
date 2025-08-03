const express = require("express");
const axios = require("axios");
const router = express.Router();

// 📡 בדיקת מפתח
router.get("/ping", (req, res) => {
  const ok = !!process.env.RUNWAYML_API_SECRET;
  res.json({ ok, clientReady: true, hasKey: ok });
});

// 🎬 קריאה להפקת וידאו דרך Gen‑2 / Gen‑3 API
router.post("/i2v/create", async (req, res) => {
  const { prompt, image } = req.body;
  const apiKey = process.env.RUNWAYML_API_SECRET;
  if (!prompt || !image || !apiKey) {
    return res.status(400).json({ error: "Missing prompt, image, or API key" });
  }

  try {
    const response = await axios.post(
      "https://api.runwayml.com/v1/image_to_video",
      {
        promptText: prompt,
        promptImage: [{ uri: image, position: "first" }],
        fps: 12,
        numFrames: 24,
        guidanceScale: 12,
        ratio: "1280:768"
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Runway-Version": "2024-11-06"
        }
      }
    );
    res.json({ taskId: response.data.id });
  } catch (err) {
    console.error("❌ Runway error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Runway create failed",
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
