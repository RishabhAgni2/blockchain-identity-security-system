// require("dotenv").config();
// const connectDB = require("./config/db");

// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const crypto = require("crypto");
// const fs = require("fs");

// const { protect } = require("./middleware/authMiddleware");
// const Identity = require("./models/Identity");

// const app = express();

// // 🔗 Connect Database
// connectDB();

// // 🧱 Middlewares
// app.use(cors());
// app.use(express.json());

// // 📂 Multer setup
// const upload = multer({ dest: "uploads/" });

// // 🟢 Health check
// app.get("/", (req, res) => {
//   res.send("Backend running successfully");
// });

// // 🔐 PROTECTED Upload & Hash Route + Save Identity
// app.post(
//   "/upload",
//   protect,
//   upload.single("document"),
//   async (req, res) => {
//     try {
//       const filePath = req.file.path;
//       const fileBuffer = fs.readFileSync(filePath);

//       // 🔑 Generate SHA-256 hash
//       const hash = crypto
//         .createHash("sha256")
//         .update(fileBuffer)
//         .digest("hex");

//       // 🧹 Remove temp file
//       fs.unlinkSync(filePath);

//       // 🗂️ Save identity record in DB
//       const identity = await Identity.create({
//         user: req.user._id,
//         documentHash: hash,
//       });

//       res.json({
//         success: true,
//         hash,
//         identityId: identity._id,
//         uploadedBy: req.user.email,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: "File processing failed",
//       });
//     }
//   }
// );

// // 🔐 Auth routes
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// // 🚀 Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Existing Routes (keep yours) =====
// example:
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));

// ===== Blockchain Identity Route (NEW) =====
const identityRoutes = require("./routes/identityRoutes");
app.use("/api/identity", identityRoutes);

// ===== Health Check =====
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
