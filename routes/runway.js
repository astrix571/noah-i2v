const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔁 בדיקת תקינות חיבור וסוד
router.get("/ping", (req, res) => {
  const key = process.env.RUNWAYML_API_SECRET;
  const ok = !!key;
  res.json({ ok, clientReady: true, hasKey: ok });
});

// 🎬 יצירת וידאו מהתמונה והטקסט
router.post("/i2v/create", async (req, res) => {
  const { prompt, image } = req.body;
  const apiKey = process.env.RUNWAYML_API_SECRET;

  if (!prompt || !image || !apiKey) {
    return res.status(400).json({ error: "Missing prompt, image, or API key" });
  }

  try {
    const response = await axios.post(
      "https://api.runwayml.com/v1/ai/gen-2/text-to-video",
      {
        prompt,
        init_image_url: image,
        num_frames: 24,
        fps: 12,
        guidance_scale: 12
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const taskId = response.data.id;
    res.json({ taskId });
  } catch (err) {
    console.error("❌ Runway create error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Runway create failed",
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
