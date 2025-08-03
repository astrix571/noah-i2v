const axios = require("axios");

const RUNWAY_API_KEY = process.env.RUNWAYML_API_SECRET;

async function createVideoFromPrompt(prompt, imageUrl) {
  if (!RUNWAY_API_KEY) {
    throw new Error("Runway API key is missing");
  }

  const response = await axios.post(
    "https://api.runwayml.com/v1/ai/gen-2/text-to-video",
    {
      prompt,
      init_image_url: imageUrl,
      num_frames: 24,
      fps: 12,
      guidance_scale: 12
    },
    {
      headers: {
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.id; // מחזיר את ה-taskId
}

module.exports = {
  createVideoFromPrompt
};
