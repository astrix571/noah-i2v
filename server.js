const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HF_API_KEY = process.env.HF_API_KEY || "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";

app.use(cors());
app.use(express.json());

// ברירת מחדל
app.get("/", (req, res) => {
  res.send("🎬 Noah-i2v API is live and ready for video generation.");
});

// יצירת וידאו מתוך פרומפט
app.post("/generate-video", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60000
      }
    );

    // תוצאה = קובץ וידאו בפורמט Bytes או לינק מוכן
    if (response.headers["content-type"] === "video/mp4") {
      // שמור קובץ לשרת או תן כקישור — נדרש לוגיקה נוספת
      return res.status(200).json({ message: "Video generated (binary received)" });
    }

    // אם המודל עדיין בטעינה
    if (response.data?.error?.includes("Loading")) {
      return res.status(202).json({ status: "Model is warming up. Please try again shortly." });
    }

    // תשובה רגילה
    res.json({ result: response.data });

  } catch (err) {
    console.error("❌ HuggingFace API Error:", err.message);
    res.status(500).json({
      error: "Failed to generate video",
      details: err.response?.data || err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Noah-i2v API running at http://localhost:${PORT}`);
});
