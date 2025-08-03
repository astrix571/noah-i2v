const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const runwayRoutes = require("./routes/runway");

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Routes ===
app.use("/runway", runwayRoutes);

// === Root ===
app.get("/", (req, res) => {
  res.send("🚀 Noah Engine is live");
});

// === Server Start ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
