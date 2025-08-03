require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'noah-i2v', stage: 'hello-render' });
});

// SDK check
app.get('/sdk-check', async (req, res) => {
  try {
    const sdk = await import('@runwayml/sdk');
    res.json({
      ok: true,
      loaded: true,
      exportedKeys: Object.keys(sdk || {}).slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ ok: false, loaded: false, error: String(e?.message || e) });
  }
});

// Runway ping — בדיקת מפתח API
app.get('/runway/ping', async (req, res) => {
  try {
    const { default: RunwayML } = await import('@runwayml/sdk');
    if (!process.env.RUNWAYML_API_SECRET) {
      return res.status(500).json({ ok: false, error: 'Missing env RUNWAYML_API_SECRET' });
    }
    const client = new RunwayML({});
    return res.json({
      ok: true,
      clientReady: !!client,
      hasKey: true
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

// I2V Stub
app.post('/api/i2v', (req, res) => {
  const { image, promptText = '', ratio = '1280:720', duration = 5 } = req.body || {};

  if (!image) return res.status(400).json({ error: 'Missing `image` (URL or data URI)' });
  const validRatio = /^\d+:\d+$/.test(ratio);
  if (!validRatio) return res.status(400).json({ error: 'Bad `ratio` format. Use e.g. "1920:1080"' });
  if (typeof duration !== 'number' || duration < 2 || duration > 10) {
    return res.status(400).json({ error: 'Bad `duration`. Use 2–10 seconds' });
  }

  const fakeTaskId = 'task_dummy_' + Math.random().toString(36).slice(2, 8);
  return res.status(202).json({
    taskId: fakeTaskId,
    status: 'processing',
    echo: { image: String(image).slice(0, 60) + '...', promptText, ratio, duration }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`noah-i2v listening on :${port}`);
});
