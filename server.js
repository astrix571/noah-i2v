const axios = require("axios");

app.post("/runway/i2v/create", async (req, res) => {
  const { prompt, image } = req.body;
  const RUNWAY_API_KEY = process.env.RUNWAYML_API_SECRET;

  if (!prompt || !image || !RUNWAY_API_KEY) {
    return res.status(400).json({ error: "Missing prompt, image, or API key" });
  }

  try {
    const response = await axios.post(
      "https://api.runwayml.com/v1/ai/gen-2/text-to-video",
      {
        prompt: prompt,
        init_image_url: image,
        num_frames: 24,
        fps: 12,
        guidance_scale: 12
      },
      {
        headers: {
          "Authorization": `Bearer ${RUNWAY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const taskId = response.data.id;
    res.json({ taskId });
  } catch (err) {
    console.error("Runway create error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Runway create failed",
      details: err.response?.data || err.message
    });
  }
});
