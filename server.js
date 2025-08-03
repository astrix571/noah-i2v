const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const runwayRoutes = require('./routes/runway');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/generate-video', runwayRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('NoahMotion V12 is alive 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
