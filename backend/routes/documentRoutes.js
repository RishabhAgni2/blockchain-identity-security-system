const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { protect } = require("../middleware/authMiddleware");
const Document = require("../models/Document");

// 🔗 Blockchain contract (NEW – Phase 3)
const proofContract = require("../blockchain");

const router = express.Router();

// ===== Ensure uploads folder exists =====
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ===== Multer config =====
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// =====================================================
// 📤 UPLOAD DOCUMENT (Protected)
// =====================================================
router.post(
  "/upload",
  protect,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read file
      const fileBuffer = fs.readFileSync(req.file.path);

      // 🔑 Generate SHA-256 hash
      const hash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      // 🧹 Remove temp file
      fs.unlinkSync(req.file.path);

      // 🗂 Save metadata in MongoDB
      const document = await Document.create({
        user: req.user._id,
        originalName: req.file.originalname,
        filePath: path.join("uploads", req.file.filename),

        fileHash: hash,
      });

      // ⛓️ Store proof on blockchain (PHASE 3)
      const tx = await proofContract.storeProof(hash);
      await tx.wait();

      res.status(201).json({
        success: true,
        message: "Document uploaded & proof stored",
        documentId: document._id,
        hash,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// =====================================================
// 📄 GET USER DOCUMENTS (Dashboard)
// =====================================================
router.get("/", protect, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

module.exports = router;
