const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

// DB connection
const connectDB = require("./config/db");

// Auth middleware
const { protect } = require("./middleware/authMiddleware");

// Initialize app
const app = express();

// 🔗 Connect MongoDB
connectDB();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Health Check =====
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// ===== Auth Routes =====
app.use("/api/auth", require("./routes/authRoutes"));

// ===== Blockchain Identity Routes =====
app.use("/api/identity", require("./routes/identityRoutes"));

// ===== TEMP Protected Test Route (STEP 1.3) =====
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
