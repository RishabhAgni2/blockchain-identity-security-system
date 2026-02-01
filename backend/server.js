require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Multer setup
const upload = multer({ dest: "uploads/" });

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// Upload & hash route
app.post("/upload", upload.single("document"), (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    fs.unlinkSync(filePath);

    res.json({ success: true, hash });
  } catch (error) {
    res.status(500).json({ success: false, message: "File processing failed" });
  }
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
