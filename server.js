// === Load dependencies ===
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const runwayRoutes = require("./routes/runway");

// === Init environment ===
dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// === Middleware ===
app.use(bodyParser.json());

// === Routes ===
app.use("/runway", runwayRoutes);

// === Health check ===
app.get("/", (req, res) => {
  res.send("Noah I2V server is running 🚀");
});

// === Start server ===
app.listen(PORT, () => {
  console.log(`noah-i2v listening on :${PORT}`);
});
