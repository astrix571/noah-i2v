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

const port = process.env.PORT || 8080; // Render מספק PORT
app.listen(port, () => {
  console.log(`noah-i2v listening on :${port}`);
});
