require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'noah-i2v', stage: 'hello-render' });
});

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
